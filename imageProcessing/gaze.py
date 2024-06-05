import cv2
import mediapipe as mp
import numpy as np

# Initialize MediaPipe Face Mesh
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(min_detection_confidence=0.5, min_tracking_confidence=0.5)

# Initialize the drawing utils
mp_drawing = mp.solutions.drawing_utils

# Define the drawing specifications
drawing_spec = mp_drawing.DrawingSpec(thickness=1, circle_radius=1)

# Function to calculate the gaze direction
def calculate_gaze_direction(landmarks, img_width, img_height):
    # Define the left and right eye landmarks
    left_eye_indices = [33, 160, 158, 133, 153, 144]
    right_eye_indices = [362, 385, 387, 263, 373, 380]

    # Get the coordinates of the left and right eye landmarks
    left_eye = np.array([(landmarks[i].x, landmarks[i].y, landmarks[i].z) for i in left_eye_indices])
    right_eye = np.array([(landmarks[i].x, landmarks[i].y, landmarks[i].z) for i in right_eye_indices])

    #print("Left eye", left_eye)
    #print("right eye", right_eye)
    # Calculate the center of each eye
    left_eye_center = left_eye.mean(axis=0).astype("float")
    right_eye_center = right_eye.mean(axis=0).astype("float")

    #print("Left eye center", left_eye_center)
    #print("right eye", right_eye_center)

    # Calculate the gaze direction (this is a simplistic approach)
    #gaze_direction = (left_eye_center + right_eye_center) / 2
    #screen_center = np.array([img_width / 2, img_height / 2])
    
    # Calculate the direction vector
    #direction_vector = gaze_direction - screen_center

    #vector between eyes
    eye_vector = left_eye_center - right_eye_center

    #Calculate the vector between top of head and tip of nose,
    nose_tip = landmarks[1]
    nose_tip = np.array([nose_tip.x, nose_tip.y, nose_tip.z])
    head_top = landmarks[10]
    head_top = np.array([head_top.x, head_top.y, head_top.z])

    vertical_vector = head_top - nose_tip

    #find the gaze vector by the cross product of the two vectors  
    gaze = np.cross(eye_vector, vertical_vector)
    #print("Vertical vector: ", vertical_vector)
    #print("Eye vector", eye_vector)

    #Return gaze vector
    return gaze

""" # Function to calculate the head tilt
def calculate_head_tilt(landmarks, img_width, img_height):
    # Define the indices for the key landmarks
    left_eye_inner = landmarks[133]  # Left eye inner corner
    right_eye_inner = landmarks[362]  # Right eye inner corner
    nose_tip = landmarks[1]  # Nose tip
    chin = landmarks[199]  # Chin

    # Convert landmarks to image coordinates
    left_eye_inner = np.array([left_eye_inner.x * img_width, left_eye_inner.y * img_height])
    right_eye_inner = np.array([right_eye_inner.x * img_width, right_eye_inner.y * img_height])
    nose_tip = np.array([nose_tip.x * img_width, nose_tip.y * img_height])
    chin = np.array([chin.x * img_width, chin.y * img_height])

    # Calculate vertical angle between the nose tip and chin
    vertical_vector = chin - nose_tip
    vertical_angle = np.arctan2(vertical_vector[1], vertical_vector[0]) * 180 / np.pi

    return vertical_angle """
def getScreenPlaneEquation(landmarks, img_width, img_height):
    pointA = np.array([1, 0, -0.1]) #top left
    pointB = np.array([0, 0, -0.1]) #top right
    pointC = np.array([1, 1, -0.1]) #bottom left
    vector1 = pointA - pointB
    vector2 = pointC - pointA
    crossVector = np.cross(vector1, vector2)
    return crossVector
def checkIntersection(landmarks, direction_vector, plane_equation_constants, plane_equation_d):
    #location of top of nose
    top_nose = landmarks[168]
    top_nose = np.array([top_nose.x, top_nose.y, top_nose.z])
    #find the a for which top_nose + a * direction vector has z = -0.1
    a = (plane_equation_d - top_nose[2]) / direction_vector[2]
    #apply that a to find the point of intersection
    poi = direction_vector * a + top_nose
    #check poi x and y
    print("POI: ", poi)
    if poi[0] >= 0.4 and poi[0] <= 0.7 and poi[1] <= 0.7 and poi[1] >= 0.2:
        return True
    else:
        return False
""" # Capture video from the webcam
cap = cv2.VideoCapture(1)

while cap.isOpened():
    success, image = cap.read()
    if not success:
        print("Ignoring empty camera frame.")
        continue

    # Convert the BGR image to RGB
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    
    # Process the image to find face mesh
    results = face_mesh.process(image)
    
    # Convert the image color back for rendering
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
    
    img_height, img_width, _ = image.shape
    
    if results.multi_face_landmarks:
        for face_landmarks in results.multi_face_landmarks:
            # Draw face landmarks
            mp_drawing.draw_landmarks(
                image=image,
                landmark_list=face_landmarks,
                connections=mp_face_mesh.FACEMESH_CONTOURS,
                landmark_drawing_spec=drawing_spec,
                connection_drawing_spec=drawing_spec)
            
            # Calculate the gaze direction
            direction_vector = calculate_gaze_direction(face_landmarks.landmark, img_width, img_height)
            #print(direction_vector)
            #if direction vector starting at eye location does not exceed the bounds of the camera screen
            #d = -0.1
            flag = checkIntersection(face_landmarks.landmark, direction_vector, getScreenPlaneEquation(face_landmarks.landmark, img_width, img_height), -0.1)
            if flag == True:
                cv2.putText(image, "Looking at Screen", (30, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)
            else:
                cv2.putText(image, "Not Looking at Screen", (30, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2, cv2.LINE_AA)
            
            vertical_angle = calculate_head_tilt(face_landmarks.landmark, img_width, img_height)
            #print(vertical_angle)
            #if vertical_angle < 90:  # Adjust this threshold based on your needs
            #    cv2.putText(image, "Looking Down", (30, 130), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2, cv2.LINE_AA)
            #else:
            #    cv2.putText(image, "Not Looking Down", (30, 130), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)
    else:
        cv2.putText(image, "Not Looking at Screen", (30, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2, cv2.LINE_AA)

    # Display the image
    cv2.imshow('MediaPipe Face Mesh', image)

    if cv2.waitKey(5) & 0xFF == 27:
        break

cap.release()
cv2.destroyAllWindows() """

def gazeDetect(image):
    # Process the image to find face mesh
    results = face_mesh.process(image)
        
    img_height, img_width, _ = image.shape
    
    if results.multi_face_landmarks:
        for face_landmarks in results.multi_face_landmarks:
            # Draw face landmarks
            mp_drawing.draw_landmarks(
                image=image,
                landmark_list=face_landmarks,
                connections=mp_face_mesh.FACEMESH_CONTOURS,
                landmark_drawing_spec=drawing_spec,
                connection_drawing_spec=drawing_spec)
            
            # Calculate the gaze direction
            direction_vector = calculate_gaze_direction(face_landmarks.landmark, img_width, img_height)
            #print(direction_vector)
            #if direction vector starting at eye location does not exceed the bounds of the camera screen
            #d = -0.1
            flag = checkIntersection(face_landmarks.landmark, direction_vector, getScreenPlaneEquation(face_landmarks.landmark, img_width, img_height), -0.1)
            if flag == True:
                #cv2.putText(image, "Looking at Screen", (30, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)
                return True
            else:
                #cv2.putText(image, "Not Looking at Screen", (30, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2, cv2.LINE_AA)
                return False
    else:
        return False