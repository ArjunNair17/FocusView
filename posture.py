import cv2
import time
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


def draw(frame, keypoints, h, w):

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

def doOneFrame(frame):
    global setInitial, GoodPostureLSN, GoodPostureRSN, Dthreshold, Athreshold, GoodNSAngle, GoodLSNAngle, GoodRSNAngle
    # Process the image.
    global h, w
    h,w = frame.shape[:2]

     # Process the image.
    keypoints = pose.process(frame)


    if keypoints.pose_landmarks:
        
        rShoulderX, rShoulderY, lShoulderX, lShoulderY, noseX, noseY, rShoulderPoint, lShoulderPoint, nosePoint = draw(frame, keypoints, h, w)

        currentLSN = calculateDistance(lShoulderX, lShoulderY, noseX, noseY)
        currentRSN = calculateDistance(rShoulderX, rShoulderY, noseX, noseY)
        #angle with lshoulder as vertex
        currentLSNAngle = calculateAngle(lShoulderPoint, nosePoint, rShoulderPoint)
        #angle with rshoulder as vertex
        currentRSNAngle = calculateAngle(rShoulderPoint, nosePoint, rShoulderPoint)
        #angle with nose as vertex
        currentNSAngle = calculateAngle(nosePoint, rShoulderPoint, lShoulderPoint)


        if setInitial:
            GoodPostureLSN = calculateDistance(lShoulderX, lShoulderY, noseX, noseY)
            GoodPostureRSN = calculateDistance(rShoulderX, rShoulderY, noseX, noseY)
            GoodLSNAngle = calculateAngle(lShoulderPoint, nosePoint, rShoulderPoint)
            GoodRSNAngle = calculateAngle(rShoulderPoint, nosePoint, rShoulderPoint)
            GoodNSAngle = calculateAngle(nosePoint, rShoulderPoint, lShoulderPoint)
            print(GoodPostureLSN)
            print(GoodPostureRSN)
            setInitial = False



        #checks if the distance between data points is within threshold
        distanceProportion = float(currentLSN)/float(GoodPostureLSN) <= Dthreshold or float(currentRSN)/float(GoodPostureRSN) <= Dthreshold
        #checks if the angle between datapoints is with threshold
        angleProportion = float(currentNSAngle)/float(GoodNSAngle) <= Athreshold or float(currentLSNAngle)/float(GoodLSNAngle) <= Athreshold  or float(currentRSNAngle)/float(GoodRSNAngle) <= Athreshold
        #checks if shoulders are aligned 
        shoulderLevel = (lShoulderY/rShoulderY) <= 0.95 or (rShoulderY/lShoulderY) <= 0.95

        #condition:
            #if the distance is under proportion return true
            #if the distance is under proportion but angle is under proportion return true
            #if angle is not within proportion but the shoulderLevel is within proportion return True

        
        if ((distanceProportion)  and  (angleProportion)):
            if (shoulderLevel):
                True
            #returns false if they have bad posture
            return False
        else:
            #return true if they have good posture
            return True
        