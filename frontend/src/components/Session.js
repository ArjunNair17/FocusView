import React from 'react';
import PropTypes from 'prop-types';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import Button from '@mui/material/Button';
import { Link, Navigate } from 'react-router-dom';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import CancelIcon from '@mui/icons-material/Cancel';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import addNotification from 'react-push-notification';
import logo from './logo.png'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import * as Tone from 'tone';

// Your CircularProgressWithLabel component
import io from 'socket.io-client';
import { EmailAuthCredential, getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useRef, useState } from 'react';


import { getDatabase, ref, set, get, onValue, update, push } from "firebase/database";



function CircularProgressWithLabel(props) {

  return (

    <Box sx={{ position: 'relative', display: 'inline-flex' }}>

      <CircularProgress variant="determinate" {...props} />

      <Box

        sx={{

          top: 0,

          left: 0,

          bottom: 0,

          right: 0,

          position: 'absolute',

          display: 'flex',

          alignItems: 'center',

          justifyContent: 'center',

        }}

      >

        <Typography variant="header" component="div" style={{ color: '#FFF' }}>

          {"Study " + `${Math.round(props.value)}%`}

        </Typography>

      </Box>

    </Box>

  );

}

CircularProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
};



// Your Page3 component
function Session() {
  const navigate = useNavigate();

  const [progress, setProgress] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const [posture, setPosture] = useState("Good Posture");
  const [attention, setAttention] = useState("Looking At Screen");
  const [audioLevel, setAudioLevel] = useState("Good Noise Level");
  const [totalTicks, setTotalTicks] = useState(0);
  const [goodTicks, setGoodTicks] = useState(0);
  const videoRef = useRef(null);
  const socketRef = useRef(null);
  const [currentUser, setUser] = useState("");


  const handleDisconnect = (() => {
    console.log("HELLOOOO!!!!")
    if (socketRef.current) {
      socketRef.current.emit("handleDisc");
    }
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }

  });



  // Calculate total duration whenever hours, minutes, or seconds change
  const totalDuration = React.useMemo(() => {
    const hours = parseInt(localStorage.getItem('hours')) || 0;
    const minutes = parseInt(localStorage.getItem('minutes')) || 0;
    const seconds = parseInt(localStorage.getItem('seconds')) || 0;
    return (seconds * 1000) + (minutes * 60 * 1000) + (hours * 60 * 60 * 1000);
  }, []);

  // [window.hours, window.minutes, window.seconds]

  console.log("duration", totalDuration); // Debugging

  const granularity = 1000; // Update progress every second
  const increment = (granularity / totalDuration) * 100; // Calculate increment percentage

  useEffect(() => {


    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then(permission => {
        if (permission !== 'granted') {
          alert('Permission to display notifications was denied');
        }
      });
    }

    socketRef.current = io('http://127.0.0.1:5000', {
      transports: ['websocket'],
    });

    socketRef.current.on('response_posture', (data) => {
      setPosture(data);

    });

    socketRef.current.on('notify_posture', (data) => {
      console.log("Got here1 bro")

      if (Notification.permission === 'granted') {
        console.log("hellooooooo!")
        new Notification('FocusView', {
          body: data,
          icon: logo
        });
      }
    });

    socketRef.current.on('response_gaze', (data) => {
      setAttention(data);
    });



    const mic = new Tone.UserMedia();
    const meter = new Tone.Meter();
    meter.normalRange = false;
    mic.open().then(() => {
      mic.connect(meter)
    })

    const interval = setInterval(() => {
      const level = meter.getValue();

      if (level > -35) {
        setAudioLevel("Too Loud")
      }

      else {
        setAudioLevel("Good Noise Level")
        setGoodTicks(goodTicks + 1)
      }
      console.log('Current decibel level:', level);
      setTotalTicks(totalTicks + 1);

      // Do something with the decibel level, such as updating state or UI
    }, 250);


    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
        };

        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp8' });
        if (videoRef.current !== null) {
          mediaRecorder.ondataavailable = async (event) => {
            if (event.data.size > 0) {
              const blob = event.data;
              const arrayBuffer = await blob.arrayBuffer();
              const buffer = new Uint8Array(arrayBuffer);
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              const videoElement = videoRef.current;
              canvas.width = videoElement.videoWidth;
              canvas.height = videoElement.videoHeight;
              ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

              canvas.toBlob((blob) => {
                const reader = new FileReader();
                reader.onload = () => {
                  const buffer = new Uint8Array(reader.result);
                  socketRef.current.emit('videoData', buffer);
                };
                reader.readAsArrayBuffer(blob);
              }, 'image/jpeg');
            }
          };
          mediaRecorder.start(100);
        }

      })

      .catch(error => {
        console.error('Error accessing webcam:', error);
      });

    return () => {
      // Clean up
      if (socketRef.current) {
        socketRef.current.disconnect();
      }

      mic.close();
      clearInterval(interval);

      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);




  React.useEffect(() => {
    const timer = setInterval(() => {
      if (!isPaused) {
        setProgress((prevProgress) => (prevProgress + increment >= 100 ? 0 : prevProgress + increment));
      }
    }, granularity);

    return () => {
      clearInterval(timer);
    };
  }, [isPaused]);

  const handlePauseClick = () => {
    setIsPaused(!isPaused); // Toggle pause state
  };


  console.log(posture);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {

    setOpen(true);

  };



  const handleClose = () => {

    //handleDisconnect();

    setOpen(false);

  };


  const handleFullClose = async () => {
    handleDisconnect();
  
    const blud = async () => {
      const auth = getAuth();
  
      // Create a promise to wait for the auth state to change
      const userAuthPromise = new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            resolve(user);
            unsubscribe(); // Unsubscribe from further auth state changes
          } else {
            reject(new Error("User is signed out"));
          }
        });
      });
  
      try {
        const user = await userAuthPromise;
        const uid = user.uid;
        const currentEmail = user.email;
        console.log(user.uid);
        console.log("userEmail " + currentEmail);
        setUser(user.uid);
  
        // Create a promise that resolves when the 'custom' event is received
        const customEventPromise = new Promise((resolve, reject) => {
          socketRef.current.on('custom', async (data) => {
            console.log("HELLLOOOOO!!!");
            console.log("Disconnect Data " + data);
            const userData = data;
            const db = getDatabase();
            console.log("user " + userData);
            console.log(userData.percent_good_posture);
            const userRef = ref(db, "users/" + uid);
            var noisePercentage = goodTicks / totalTicks;
            console.log(noisePercentage);
  
            if (isNaN(noisePercentage)) {
              noisePercentage = 1;
            }
            try {
              const snapshot = await get(userRef);
              if (snapshot.exists()) {
                const curUser = snapshot.val().past_5_posture || [];
                const currentGaze = snapshot.val().past_5_gaze || [];
                const currentNoise = snapshot.val().past_5_noise || [];
                console.log(snapshot.val());
  
                console.log(userData.percent_good_gaze);
  
                if (curUser.length >= 20) {
                  curUser.shift();
                  curUser.push(userData.percent_good_posture);
                } else {
                  curUser.push(userData.percent_good_posture);
                }
  
                if (currentGaze.length >= 20) {
                  currentGaze.shift();
                  currentGaze.push(userData.percent_good_gaze);
                } else {
                  currentGaze.push(userData.percent_good_gaze);
                }
  
                if (currentNoise.length >= 20) {
                  currentNoise.shift();
                  currentNoise.push(noisePercentage);
                } else {
                  currentNoise.push(noisePercentage);
                }
                console.log(curUser);
                console.log(currentGaze);
  
                userData.past_5_gaze = currentGaze;
                userData.past_5_posture = curUser;
                userData.past_5_noise = currentNoise;
                // User exists, update the existing user's information
                await update(userRef, userData);
                console.log("User information updated successfully");
                resolve(); // Resolve the promise when update is successful
              } else {
                // User doesn't exist, add a new user
                const newUserRef = ref(db, 'users/' + uid);
                const percentPosture = userData.percent_good_posture;
                const percentGaze = userData.percent_good_gaze;
                userData.past_5_gaze = [];
                userData.past_5_posture = [];
                userData.past_5_noise = [];
  
                userData.past_5_noise.push(noisePercentage);
  
                userData.past_5_gaze.push(percentGaze);
                userData.past_5_posture.push(percentPosture);
  
                await set(newUserRef, userData);
                console.log("New user added successfully");
                resolve(); // Resolve the promise when new user is added
              }
            } catch (error) {
              console.error("Error processing user data:", error);
              reject(error);
            }
          });
        });
  
        // Await the custom event before proceeding to the next action
        await customEventPromise;
        console.log("Custom event processed, moving to next page.");
        // Move to another page or perform the next action
      } catch (error) {
        console.error("Error processing:", error);
      }
    };
  
    await blud();

    window.location.href = '/session_summary';

  };
  
  // Call the function to start the process

  

  return (
    <div className="App">
      <header className="App-header">

        <CircularProgressWithLabel value={progress} size={300} />
        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          {/* <IconButton>
            <VideoCameraFrontIcon style={{ fontSize: 40, color: '#FFFFFF' }} />
          </IconButton> */}
          <IconButton onClick={handlePauseClick}>
            {isPaused ? (
              <PlayCircleIcon style={{ fontSize: 40, color: '#FFFFFF' }} />
            ) : (
              <PauseCircleIcon style={{ fontSize: 40, color: '#FFFFFF' }} />
            )}
          </IconButton>
          <IconButton onClick={handleClickOpen}>
            <CancelIcon style={{ fontSize: 40, color: '#FFFFFF' }} />
          </IconButton>
        </div>
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255)',
            padding: '25px',
            borderRadius: '10px',
            // minWidth: '500px', // Minimum height for the box
          }}
        >
          <div style={{ color: '#00', marginBottom: '7px', fontSize: '20px' }}>
            {posture}
          </div>

          <div style={{ color: '#00', marginBottom: '7px', fontSize: '20px' }}>
            {attention}
          </div>

          <div style={{ color: '#00', fontSize: '20px' }}>
            {audioLevel}
          </div>

        </Box>

        <video ref={videoRef} style={{ display: 'none' }}></video>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"End Session?"}
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleClose}>No</Button>
            <Button onClick={handleFullClose} autoFocus>
              Yes
            </Button>

          </DialogActions>
        </Dialog>
      </header>
    </div>
  );
}



export { Session, CircularProgressWithLabel };
