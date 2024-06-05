import React from 'react';
import PropTypes from 'prop-types';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import Button from '@mui/material/Button';
import { Link, Navigate } from 'react-router-dom';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import CancelIcon from '@mui/icons-material/Cancel';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
    var userName = "";
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        userName = user.uid;
        const currentEmail = user.email;
        console.log(user.uid);
        console.log(userName);
        console.log("userEmail " + currentEmail);
        setUser(user.uid);

        const curUserName = userName;
        console.log("curUserName " + curUserName);



        socketRef.current.on('custom', (data) => {
          console.log("HELLLOOOOO!!!")
          console.log("Disconnect Data " + data);
          const user = data;
          const db = getDatabase();
          console.log(user)
          const userRef = ref(db, "users/" + uid)
          var noisePercentage = goodTicks / totalTicks;
          console.log(noisePercentage);

          if (isNaN(noisePercentage)) {
            noisePercentage = 1;
          }
          get(userRef)
            .then(snapshot => {
              if (snapshot.exists()) {
                const curUser = snapshot.val().past_5_posture;
                const currentGaze = snapshot.val().past_5_gaze;
                const currentNoise = snapshot.val().past_5_noise;
                console.log(snapshot.val());

                console.log(user.percent_good_gaze);

                if (curUser.length >= 20) {
                  curUser.shift()
                  curUser.push(user.percent_good_posture)
                }

                else {
                  curUser.push(user.percent_good_posture);
                }

                if (currentGaze.length >= 20) {
                  currentGaze.shift()
                  currentGaze.push(user.percent_good_gaze)
                }

                else {
                  currentGaze.push(user.percent_good_gaze);
                }

                if (currentNoise.length >= 20) {
                  currentNoise.shift()
                  currentNoise.push(noisePercentage)
                }

                else {
                  currentNoise.push(noisePercentage);
                }
                console.log(curUser)
                console.log(currentGaze)

                user.past_5_gaze = currentGaze;
                user.past_5_posture = curUser;
                user.past_5_noise = currentNoise;
                // User exists, update the existing user's information
                update(userRef, user)
                  .then(() => {
                    console.log("User information updated successfully");
                  })
                  .catch(error => {
                    console.error("Error updating user information:", error);
                  });
              } else {
                // User doesn't exist, add a new user using push()
                const newUserRef = ref(db, 'users/' + uid);
                const percentPosture = user.percent_good_posture;
                const percentGaze = user.percent_good_gaze;
                user.past_5_gaze = []
                user.past_5_posture = []
                user.past_5_noise = []

                user.past_5_noise.push(noisePercentage)

                user.past_5_gaze.push(percentGaze)
                user.past_5_posture.push(percentPosture)

                set(newUserRef, user)
                  .then(() => {
                    console.log("New user added successfully");
                  })
                  .catch(error => {
                    console.error("Error adding new user:", error);
                  });
              }
            })
        });

        // ...
      } else {
        console.log("signed out");
        // User is signed out
        // ...
      }
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

  const navigate = useNavigate();

  const handleFullClose = () => {
    handleDisconnect();
    window.location.href = '/session_summary';
    setOpen(false);
    
    // navigate('/session_summary');
  }


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

          <Button onClick={handleClose} autoFocus>

          

          <Button onClick={handleFullClose}>Yes </Button>
            <Link to="/session_summary"></Link>
          </Button>



        </DialogActions>

      </Dialog>

    </header>

  </div>

);
  
}

export { Session, CircularProgressWithLabel };
