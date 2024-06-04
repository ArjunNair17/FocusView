import React from 'react';
import PropTypes from 'prop-types';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import CancelIcon from '@mui/icons-material/Cancel';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';


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
        <Typography variant="header" component="div" style={{ color: '#FFF'}}>
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

  const videoRef = useRef(null);
  const socketRef = useRef(null);
  const [currentUser,setUser] = useState("");

  const handleDisconnect = (() =>{
    if(socketRef.current) {
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
  }, [] );

  // [window.hours, window.minutes, window.seconds]

  console.log("duration", totalDuration); // Debugging

  const granularity = 1000; // Update progress every second
  const increment = (granularity / totalDuration) * 100; // Calculate increment percentage

  useEffect(() => {
    socketRef.current = io('http://127.0.0.1:5000', {
      transports: ['websocket'],
    });
  
    socketRef.current.on('response', (data) => {
       setPosture(data);
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
            // ...
        } else {
            console.log("signed out");
            // User is signed out
            // ...
      }
    });
  
  
    const curUserName = userName;
    console.log("curUserName " + curUserName);
  
    socketRef.current.on('custom', (data) => {
      console.log("Disconnect Data " + data);
      const user = data;
      const db = getDatabase();
      const userRef = ref(db, "users/" + userName)
  
  
      get(userRef)
            .then(snapshot => {
                if (snapshot.exists()) {
                    const curUser = snapshot.val().percent_good_posture;
                    console.log(snapshot.val());
  
                    console.log(curUser);
                    
                    if(curUser.length > 5) {
                        curUser.shift()
                        curUser.push(user.percent_good_posture)
                    }
  
                    else {
                      curUser.push(user.percent_good_posture);
                    }
                    
                    console.log(curUser)
                    user.percent_good_posture = curUser;
                    
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
                    const newUserRef = ref(db, 'users/' + userName);
                    user.percent_good_posture = [user.percent_good_posture];
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
  
    navigator.mediaDevices.getUserMedia({ video: true })
    . then(stream => {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play();
      };
        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp8' });
  
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
      })
  
      // .catch(error => {
      //   console.error('Error accessing webcam:', error);
      // });
  
    return () => {
      // Clean up
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
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
    handleDisconnect();
    setOpen(false);
  };

  return (
    <div className="App">
      <header className="App-header">
     
        <CircularProgressWithLabel value={progress} size={300} />
        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <IconButton>
            <VideoCameraFrontIcon style={{ fontSize: 40 ,  color: '#FFFFFF'}} />
          </IconButton>
          <IconButton onClick={handlePauseClick}>
            {isPaused ? (
              <PlayCircleIcon style={{ fontSize: 40 ,color: '#FFFFFF'}} />
            ) : (
              <PauseCircleIcon style={{ fontSize: 40 ,color: '#FFFFFF'}} />
            )}
          </IconButton>
          <IconButton onClick={handleClickOpen}>
            <CancelIcon style={{ fontSize: 40 ,color: '#FFFFFF'}} />
          </IconButton>
        </div>
        <div>
          {posture}
        </div>

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
              Yes
            </Button>
            
          </DialogActions>
        </Dialog>
      </header>
    </div>
  );
}

export { Session, CircularProgressWithLabel };
