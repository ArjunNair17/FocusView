import React, { useState, useEffect, useRef } from 'react';
import { ThemeProvider, createTheme, Typography, Box } from '@mui/material';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { LineChart } from '@mui/x-charts/LineChart';
import ReactCardFlip from 'react-card-flip';

import { EmailAuthCredential, getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set, get, onValue, update, push } from "firebase/database";


function SessionSummary() {
  const [isFlipped1, setIsFlipped1] = useState(false);
  const [isFlipped2, setIsFlipped2] = useState(false);
  const [posture, setPosture] = useState(false);
  const [gaze,setGaze] = useState(false);
  const [postureTrend, setPostureTrend] = useState([]);
  const [gazeTrend, setGazeTrend] = useState([]);
  const [postureTrend_Xaxis, setPostureTrend_Xaxis] = useState([]);
  const [gazeTrend_Xaxis, setGazeTrend_Xaxis] = useState([]);
  

  const handleClick1 = (e) => {
    e.preventDefault();
    setIsFlipped1(!isFlipped1);
  };

  const handleClick2 = (e) => {
    e.preventDefault();
    setIsFlipped2(!isFlipped2);
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: '#FFFBFB4D',
        dark: '#FFFFFF6D',
      },
    },
  });

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const currentUser = user.uid;

      const db = getDatabase();
      const userRef = ref(db, "users/" + currentUser);

      get(userRef)
        .then(snapshot => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            
            setGaze(data.percent_good_gaze);
            setGazeTrend(data.past_5_gaze);

            setPosture(data.percent_good_posture);
            setPostureTrend(data.past_5_posture);

            const lenGaze = data.past_5_gaze.length;
            const lenPosture  = data.past_5_posture.length;

            const temp_gaze = [];
            const temp_posture = [];
            
            for (let i = 0; i<lenGaze; i++){
              temp_gaze[i] = i+1;
            }

            for (let j = 0; j<lenPosture; j++){
              temp_posture[j] = j+1;
            }
            setPostureTrend_Xaxis(temp_posture);
            setGazeTrend_Xaxis(temp_gaze);

          }
        });
    } else {
      console.log("signed out");
    }
  });


  

  return (
    <div className="App">
      <header className="App-header">
        <ThemeProvider theme={theme}>
          <div>
          <Typography variant="h5" style={{ color: '#FFFFFF', marginBottom: '30px' }}>Session Report</Typography>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div>
                <Box 
                  sx={{
                    width: 400,
                    height: 250,
                    borderRadius: 5,
                    marginTop: 2,
                    bgcolor: 'white',
                    '&:hover': {
                      bgcolor: 'white',
                    },
                    position: 'relative',
                  }}
                >
                  <Typography variant="h5" style={{ color: '#000000',  fontSize: '1.4rem',position: 'absolute', top: '10%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    Posture
                  </Typography>
                  <Gauge width={200} height={200} value={posture * 100} color="#008080" 
                   style={{ position: 'absolute', top: '55%', left: '50%', transform: 'translate(-50%, -50%)' }} 
                   sx={(theme) => ({
                    [`& .${gaugeClasses.valueText}`]: {
                      fontSize: 40,
                    },
                    [`& .${gaugeClasses.valueArc}`]: {
                      fill: '#008080',
                    },
                    [`& .${gaugeClasses.referenceArc}`]: {
                      fill: theme.palette.text.disabled,
                    },
                  })} />
                </Box>
              </div>
            

              <div>
                <Box 
                  sx={{
                    width: 400,
                    height: 350,
                    borderRadius: 5,
                    marginTop: 2,
                    bgcolor: 'white',
                    '&:hover': {
                      bgcolor: 'white',
                    },
                    position: 'relative',
                  }}
                >
                  <Typography variant="h5" style={{ color: '#000000', position: 'absolute',fontSize: '1.2rem', top: '10%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    Posture Trend
                  </Typography>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <LineChart
                      xAxis={[{ data: postureTrend_Xaxis , label: 'Last 5 sessions from oldest to newest' }]}
                      series={[{ data: postureTrend }]}
                      width={370}
                      height={300}
                    />
                  </div>
                </Box>
              </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div>
                <Box 
                  sx={{
                    width: 400,
                    height: 250,
                    borderRadius: 5,
                    marginTop: 2,
                    marginLeft: 2,
                    bgcolor: 'white',
                    '&:hover': {
                      bgcolor: 'white',
                    },
                    position: 'relative',
                  }}
                >
                  <Typography variant="h5" style={{ color: '#000000', position: 'absolute', fontSize: '1.4rem', top: '10%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    Eye Tracking
                  </Typography>
                  <Gauge width={200} height={200} value={gaze * 100}  
                  style={{ position: 'absolute', top: '55%', left: '50%', transform: 'translate(-50%, -50%)' }} 
                  sx={(theme) => ({
                    [`& .${gaugeClasses.valueText}`]: {
                      fontSize: 40,
                    },
                    [`& .${gaugeClasses.valueArc}`]: {
                      fill: '#008080',
                    },
                    [`& .${gaugeClasses.referenceArc}`]: {
                      fill: theme.palette.text.disabled,
                    },
                  })} />
                </Box>
              </div>

              <div>
                <Box 
                  sx={{
                    width: 400,
                    height: 350,
                    borderRadius: 5,
                    marginTop: 2,
                    marginLeft: 2,
                    bgcolor: 'white',
                    '&:hover': {
                      bgcolor: 'white',
                    },
                    position: 'relative',
                  }}
                >
                  <Typography variant="h5" style={{ color: '#000000', position: 'absolute',fontSize: '1.2rem', top: '10%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    Eye Tracking Trend
                  </Typography>
                  
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                  <LineChart
                    xAxis={[{ data: gazeTrend_Xaxis, label: 'Last 5 sessions from oldest to newest' }]}
                    series={[{ data: gazeTrend }]}
                    width={370}
                    height={300}
                  />
                </div>
                </Box>
              </div>
          </div>
          </div>
        </ThemeProvider>
      </header>
    </div>
  );
}



export default SessionSummary;
