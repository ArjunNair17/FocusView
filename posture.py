import cv2
import time
import os
import math as m
import mediapipe as mp
import numpy as np


setInitial = True
GoodPostureLSN = 0
GoodPostureRSN = 0
GoodLSNAngle = 0
GoodRSNAngle = 0
GoodNSAngle = 0
yellow = (0, 255, 255)
tickCounter = 0
#distance threshold
Dthreshold = 0.90
#angle threshold 
Athreshold = 0.85
#holds total ticks
tickTotal = 0 
#holds total ticks in which you have bad posture
tickBadPosture = 0
#threshold until badposture detection
tickThreshold = 0 #fix this value later ex. 30
#varaibles for timer
newBadPosture = False
maxTime = 0
start = 0
justHadBadPosture = False
#counts how long it runs 
tickPending = True


# Initilize medipipe selfie segmentation class.
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(
    min_detection_confidence=0.3,  # Minimum confidence threshold for pose detection
    min_tracking_confidence=0.3    # Minimum confidence threshold for pose tracking
)
mp_holistic = mp.solutions.holistic
cap = cv2.VideoCapture(0)

def maxRun(curTime, maxTime):
    print(curTime, "   ", maxTime)
    if (curTime > maxTime):
        return curTime 
    else:
        return maxTime


#calculating distance between points
def calculateDistance(x1, y1, x2, y2):
    return m.sqrt((x1-x2)**2 + (y1-y2)**2)

def calculateAngle(a,b,c):

    a = np.array(a)
    b = np.array(b)
    c = np.array(c)
    #a is the point between the vectors, in the case it will be point 
    #at the shoulders
    v1 = b - a 
    v2 = c - a
    
    cosine_angle = np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))
    angle = np.arccos(cosine_angle)

    # Convert the angle from radians to degrees
    return np.degrees(angle)


def draw():
    # Use lm and lmPose as representative of the following methods.
    lm = keypoints.pose_landmarks
    lmPose = mp_pose.PoseLandmark

    # Acquire the landmark coordinates.
    # Once aligned properly, left or right should not be a concern.      
    # Left shoulder.
    lShoulderX= int(lm.landmark[lmPose.LEFT_SHOULDER].x * w)
    lShoulderY = int(lm.landmark[lmPose.LEFT_SHOULDER].y * h)
    lShoulderPoint = [lShoulderX, lShoulderY]
    cv2.circle(frame, (lShoulderX, lShoulderY), 5, (0, 255, 0), -1)
    # Right shoulder
    rShoulderX = int(lm.landmark[lmPose.RIGHT_SHOULDER].x * w)
    rShoulderY = int(lm.landmark[lmPose.RIGHT_SHOULDER].y * h)
    rShoulderPoint = [rShoulderX, rShoulderY]
    cv2.circle(frame, (rShoulderX, rShoulderY), 5, (0, 255, 0), -1)
    # Left ear.
    noseX = int(lm.landmark[lmPose.NOSE].x * w)
    noseY = int(lm.landmark[lmPose.NOSE].y * h)
    nosePoint = (noseX, noseY)
    cv2.circle(frame, (noseX, noseY), 5, (0, 255, 0), -1)

    return [rShoulderX, rShoulderY, lShoulderX, lShoulderY, noseX, noseY, rShoulderPoint, lShoulderPoint, nosePoint]




if not cap.isOpened():
    print("Error: Could not open webcam.")
    exit()

time.sleep(5)
#change this to be in good posture
print("Be in good posture")

# Loop to capture frames from the webcam
while True:
    tickTotal += 1

    # Read a frame from the webcam
    ret, frame = cap.read()
    
    # Check if the frame was read successfully
    if not ret:
        print("Error: Could not read frame.")
        break

    h,w = frame.shape[:2]


    # Process the image.
    keypoints = pose.process(frame)


    if keypoints.pose_landmarks:
        
        rShoulderX, rShoulderY, lShoulderX, lShoulderY, noseX, noseY, rShoulderPoint, lShoulderPoint, nosePoint = draw()

        currentLSN = calculateDistance(lShoulderX, lShoulderY, noseX, noseY)
        currentRSN = calculateDistance(rShoulderX, rShoulderY, noseX, noseY)
        #angle with lshoulder as vertex
        currentLSNAngle = calculateAngle(lShoulderPoint, nosePoint, rShoulderPoint)
        #angle with rshoulder as vertex
        currentRSNAngle = calculateAngle(rShoulderPoint, nosePoint, rShoulderPoint)
        #angle with nose as vertex
        currentNSAngle = calculateAngle(nosePoint, rShoulderPoint, lShoulderPoint)

        print("left vs nose: " + str(currentLSN))
        print("right vs nose: " + str(currentRSN))

        if setInitial:
            GoodPostureLSN = calculateDistance(lShoulderX, lShoulderY, noseX, noseY)
            GoodPostureRSN = calculateDistance(rShoulderX, rShoulderY, noseX, noseY)
            GoodLSNAngle = calculateAngle(lShoulderPoint, nosePoint, rShoulderPoint)
            GoodRSNAngle = calculateAngle(rShoulderPoint, nosePoint, rShoulderPoint)
            GoodNSAngle = calculateAngle(nosePoint, rShoulderPoint, lShoulderPoint)
            print(GoodPostureLSN)
            print(GoodPostureRSN)
            setInitial = False

        #At any run if thresholds are not met will start counting bad posture. Once it has past 30 ticks, it will continue setting tickPending to false
        #until good posture is detected in which tickPending is set to false 
        
        #sees if it wants to set tickPending to True or not 
        #if ticketCounter is greater than 30 and if they have bad posture set tickPending to false
        #else (they have good posture or tickCounter less than 30 set to true)
        if (tickCounter >= tickThreshold and (float(currentLSN)/float(GoodPostureLSN) <= Dthreshold or abs(float(currentRSN)/float(GoodPostureRSN) ) <= Dthreshold) and  (float(currentNSAngle)/float(GoodNSAngle) <= Athreshold or float(currentLSNAngle)/float(GoodLSNAngle) <= Athreshold  or float(currentRSNAngle)/float(GoodRSNAngle) <= Athreshold)):
            tickPending = False
        else:
            tickPending = True

        #detecting bad posture
        #bad posture occurs if distance ratio of either shoulder is below threshold and if angle ratio of either one is below threshold
        if (tickPending == False or (float(currentLSN)/float(GoodPostureLSN) <= Dthreshold or abs(float(currentRSN)/float(GoodPostureRSN) ) <= Dthreshold) and  (float(currentNSAngle)/float(GoodNSAngle) <= Athreshold  or float(currentRSNAngle)/float(GoodRSNAngle) <= Athreshold) ):
            if (newBadPosture == False):
                newBadPosture = True
                print("Entered")
                start = time.time()
            print("pending fix")
            tickBadPosture += 1
            tickCounter += 1
            if (tickCounter >= tickThreshold):
                #use put text
                print("fix bad posture")
            justHadBadPosture = True
        else:
            tickCounter = 0
            if (justHadBadPosture == True):
                curTime = time.time()
                durationOfBadPosture = curTime - start
                print("duration of bad posture", durationOfBadPosture)
                maxTime = maxRun(durationOfBadPosture, maxTime)
                newBadPosture == False
                justHadBadPosture = False

            
                
        
    print("checkCounters", tickBadPosture, tickTotal)

    # Display the frameqq
    cv2.imshow('Video Feed', frame)

    # Check for key press to exit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break


#index 0 is percentage of time user had bad posture
#index 1 is max stretch of time they had bad posture 
stats = [tickBadPosture/tickTotal * 100, maxTime]     
print(stats)
print("you had bad posture " + str(int(stats[0])) + " percent of the time")
print("Your max length with bad posture is ", maxTime)

# Release the video capture device and close all OpenCV windows
cap.release()
cv2.destroyAllWindows()