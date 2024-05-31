# modified from https://docs.opencv.org/3.1.0/d8/d83/tutorial_py_grabcut.html
import numpy as np
import cv2
from matplotlib import pyplot as plt

#break video into jpg frames
video = cv2.VideoCapture('test.mp4')
reading, image = video.read()
count = 0
while reading:
  cv2.imwrite("test/frame%d.jpg" % count, image)     # save frame as JPEG file      
  reading,image = video.read()
  print('Read a new frame: ', reading)
  count += 1

#extract background from each frame
for count2 in range(0,count):
    img = cv2.imread('test/frame%d.jpg' % count2)
    mask = np.zeros(img.shape[:2],np.uint8)

    bgdModel = np.zeros((1,65),np.float64)
    fgdModel = np.zeros((1,65),np.float64) 
    rect = (50,50,450,290)
    cv2.grabCut(img,mask,rect,bgdModel,fgdModel,5,cv2.GC_INIT_WITH_RECT)

    mask2 = np.where((mask==1)|(mask==3),0,1).astype('uint8')
    img = img*mask2[:,:,np.newaxis]
    cv2.imwrite("test_nobg/frame%d.jpg" % count2, img)
    print('Extracted bg from frame: ', count2)
    # plt.imshow(img),plt.colorbar(),plt.show()

#detect motion in the background frames
print("----------beginning motion detection-------------")
frame1 = cv2.imread('test_nobg/frame0.jpg')
frame1_gray = cv2.cvtColor(frame1, cv2.COLOR_BGR2GRAY)
frame1_gray = cv2.GaussianBlur(frame1_gray, (21, 21), 0)
THRESHOLD_VALUE = 25
MIN_CONTOUR_AREA = 1000
for i in range(1, count):
  print("frames ", i-1, ",", i)
  frame2 = cv2.imread('test_nobg/frame%d.jpg' % count2)
  frame2_gray = cv2.cvtColor(frame2, cv2.COLOR_BGR2GRAY)
  frame2_gray = cv2.GaussianBlur(frame2_gray, (21, 21), 0)
  diff = cv2.absdiff(frame1_gray, frame2_gray)
  _, thresh = cv2.threshold(diff, THRESHOLD_VALUE, 255, cv2.THRESH_BINARY)
  thresh = cv2.dilate(thresh, None, iterations=2)
  contours, _ = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
  for contour in contours:
    # Ignore small contours to reduce noise
    if cv2.contourArea(contour) < MIN_CONTOUR_AREA:
        continue
    # Large contour = motion detected
    print("Motion detected")
    # break

print("done")
   