# server.py
import eventlet
eventlet.monkey_patch()

from flask import Flask, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS

import numpy as np
import cv2
import base64


face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')



app = Flask(__name__)

clients = {}

CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

@socketio.on('connect')
def handle_connect():
    print('Client connected')
    clients[request.sid] = 0

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')
    print(clients[request.sid])
    del request.sid

@socketio.on('videoData')
def handle_video(data):
    # Decode the incoming video data
    nparr = np.frombuffer(data, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if frame is not None:
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.2, 4)
        for x, y, w, h in faces:
            cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)
        cv2.imshow('Video', frame)
        cv2.waitKey(1)
        emit('response', len(faces), room=request.sid)

    
        # Display the frame for 1 ms and continue
    clients[request.sid] += 1
if __name__ == '__main__':
    socketio.run(app, host='127.0.0.1', port=5000)
    cv2.destroyAllWindows()
