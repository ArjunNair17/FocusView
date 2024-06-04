# server.py
import eventlet
eventlet.monkey_patch()

from user import User
from gaze import gazeDetect
from flask import Flask, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from posture import doOneFrame
import numpy as np
import cv2
import base64


import cv2
import time
import math as m
import mediapipe as mp
import numpy as np






app = Flask(__name__)

clients = {}

refreshTimer = 0

CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

@socketio.on('connect')
def handle_connect():
    print('Client connected')
    clients[request.sid] = User(0,0, 0)
    
    
@socketio.on('handleDisc')
def handleDisc():
    user_data = clients[request.sid].to_dict()
    emit("custom", user_data, room=request.sid)
    clients.pop(request.sid)

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')
    print(clients[request.sid].total_ticks)
   

@socketio.on('videoData')
def handle_video(data):
    posture_text = "Good Posture"
    gaze_text = "Looking At Screen"
    if(clients.get(request.sid) != None):
        
        currentClient = clients[request.sid]
        currentClient.increaseTimer()
        # Decode the incoming video data
        nparr = np.frombuffer(data, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if frame is not None:
            currentPosture = doOneFrame(frame)
            currentGaze = gazeDetect(frame)
            
            if(currentPosture):
                currentClient.increaseGoodTick()
                
            if(currentPosture == False):
                currentClient.increaseBadPostureTick()
                posture_text = "Bad Posture"
                
            if(currentGaze == True):
                currentClient.increaseGoodGazeTick()
            
            if(currentGaze == False):
                gaze_text = "Not Looking At Screen"
                
        
                
            print(currentGaze)
            print(currentPosture)
            print(currentClient.timer_())
            currentClient.increaseTick()
            
            
            if(currentClient.checkTimer()):
                emit('response_posture', posture_text, room=request.sid)
                emit('response_gaze', gaze_text, room = request.sid)
                currentClient.resetTimer()
                
            if(currentClient.postureBadForLongTime()):
                emit('notify_posture', "You've Had Bad Posture For A While!", room=request.sid)
                currentClient.resetBadTicks()
               
            print(currentClient.good_ticks/currentClient.total_ticks);
                
            # faces = face_cascade.detectMultiScale(gray, 1.2, 4)
            # for x, y, w, h in faces:
            #     cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)
            cv2.imshow('Video', frame)
            cv2.waitKey(1)
            # emit('response', len(faces), room=request.sid)

    
        # Display the frame for 1 ms and continue
    
if __name__ == '__main__':
    socketio.run(app, host='127.0.0.1', port=5000)
    cv2.destroyAllWindows()
