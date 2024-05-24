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
for count in range(0,101):
    img = cv2.imread('test/frame%d.jpg' % count)
    mask = np.zeros(img.shape[:2],np.uint8)

    bgdModel = np.zeros((1,65),np.float64)
    fgdModel = np.zeros((1,65),np.float64) 
    rect = (50,50,450,290)
    cv2.grabCut(img,mask,rect,bgdModel,fgdModel,5,cv2.GC_INIT_WITH_RECT)

    mask2 = np.where((mask==1)|(mask==3),0,1).astype('uint8')
    img = img*mask2[:,:,np.newaxis]
    cv2.imwrite("test_nobg/frame%d.jpg" % count, img)
    # plt.imshow(img),plt.colorbar(),plt.show()