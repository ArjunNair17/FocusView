# modified from https://docs.opencv.org/3.1.0/d8/d83/tutorial_py_grabcut.html
import numpy as np
import cv2
from matplotlib import pyplot as plt
from collections import deque

#break video into jpg frames
video = cv2.VideoCapture('test2.mp4')
reading, img = video.read()
count = 0
# while reading:    
#   mask = np.zeros(img.shape[:2],np.uint8)
#   bgdModel = np.zeros((1,65),np.float64)
#   fgdModel = np.zeros((1,65),np.float64) 
#   rect = (50,50,450,290)
#   cv2.grabCut(img,mask,rect,bgdModel,fgdModel,5,cv2.GC_INIT_WITH_RECT)
#   mask2 = np.where((mask==0)|(mask==2),0,1).astype('uint8') #0 and 2 pixels are background, 1 and 3 pixels are foreground
#   img = img*mask2[:,:,np.newaxis]
#   cv2.imwrite("test/frame%d.jpg" % count, img)
#   print('Extracted frame: ', count)

#   reading,img = video.read()
#   # print('Read a new frame: ', reading)
#   count += 1

#detect motion in the background frames
count = 159
print("----------beginning motion detection-------------")
frame1 = cv2.imread('test/frame0.jpg')
frame1_gray = cv2.cvtColor(frame1, cv2.COLOR_BGR2GRAY)
frame1_gray = cv2.GaussianBlur(frame1_gray, (21, 21), 0)
THRESHOLD_VALUE = 25
MIN_CONTOUR_AREA = 1000
FRAMES_REMEMBERED = 30
FRAMES_MOTION_THRESHOLD = 20 #number of frames in the past FRAMES_REMEMBERED frames that need to have detected change to claim motion detection
queue = deque()
motion_rating = 0
for i in range(1, count):
  # print("frames ", i-1, ",", i)
  frame2 = cv2.imread('test/frame%d.jpg' % i)
  frame2_gray = cv2.cvtColor(frame2, cv2.COLOR_BGR2GRAY)
  frame2_gray = cv2.GaussianBlur(frame2_gray, (21, 21), 0)
  diff = cv2.absdiff(frame1_gray, frame2_gray)
  _, thresh = cv2.threshold(diff, THRESHOLD_VALUE, 255, cv2.THRESH_BINARY)
  thresh = cv2.dilate(thresh, None, iterations=2)
  contours, _ = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
  vote = 0
  for contour in contours:
    # Ignore small contours to reduce noise
    if cv2.contourArea(contour) < MIN_CONTOUR_AREA:
      vote -= 1
      continue
    # Large contour = motion detected
    vote += 1
    # break
  motion_detected = -1
  if vote>0:
    motion_detected = 1
    print("Motion detected between frames", i-1, i)
  if(len(queue) > FRAMES_REMEMBERED): #if we already stored FRAMES_REMEMBERED frames, remove the oldest one
    val = queue.popleft()
    motion_rating -= val
  
  motion_rating += motion_detected
  queue.append(motion_detected)
  print("motion rating:", motion_rating)
  if(motion_rating > -FRAMES_REMEMBERED + FRAMES_MOTION_THRESHOLD):
    print("MOTION DETECTED -------")


print("done")
   