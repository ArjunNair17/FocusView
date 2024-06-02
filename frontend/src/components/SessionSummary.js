import React, { useState, useEffect, useRef } from 'react';
import { ThemeProvider, createTheme, Typography, Box } from '@mui/material';
import { Gauge } from '@mui/x-charts/Gauge';
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
  const [gazeTrend, setGazeTrend] = useState(false);
  

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
          <Typography variant="h5" style={{ color: '#FFF', marginBottom: '20px' }}>Session Report</Typography>

          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <ReactCardFlip isFlipped={isFlipped1} >
              <div>
                <Box onClick={handleClick1}
                  sx={{
                    width: 372,
                    height: 525,
                    borderRadius: 5,
                    marginRight: 2,
                    bgcolor: 'primary.main',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    position: 'relative',
                  }}
                >
                  <Typography variant="h5" style={{ color: '#FFF', position: 'absolute', top: '10%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    Posture
                  </Typography>
                  <Gauge width={200} height={200} value={posture * 100} color="#FFFFF" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                </Box>
              </div>

              <div>
                <Box onClick={handleClick1}
                  sx={{
                    width: 372,
                    height: 525,
                    borderRadius: 5,
                    marginRight: 2,
                    bgcolor: 'primary.main',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    position: 'relative',
                  }}
                >
                  <Typography variant="h5" style={{ color: '#FFF', position: 'absolute', top: '10%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    Posture
                  </Typography>
                  <LineChart
                    xAxis={[{ data: [1, 2, 3, 4, 5] }]}
                    series={[{ data: [2, 5.5, 2, 8.5, 1.5] }]}
                    width={370}
                    height={300}
                  />
                </Box>
              </div>
            </ReactCardFlip>

            <ReactCardFlip isFlipped={isFlipped2} >
              <div>
                <Box onClick={handleClick2}
                  sx={{
                    width: 372,
                    height: 525,
                    borderRadius: 5,
                    marginLeft: 2,
                    bgcolor: 'primary.main',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    position: 'relative',
                  }}
                >
                  <Typography variant="h5" style={{ color: '#FFF', position: 'absolute', top: '10%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    Eye Tracking
                  </Typography>
                  <Gauge width={200} height={200} value={gaze * 100} style={{ color: '#FFF', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                </Box>
              </div>

              <div>
                <Box onClick={handleClick2}
                  sx={{
                    width: 372,
                    height: 525,
                    borderRadius: 5,
                    marginLeft: 2,
                    bgcolor: 'primary.main',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    position: 'relative',
                  }}
                >
                  <Typography variant="h5" style={{ color: '#FFF', position: 'absolute', top: '10%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    Eye Tracking
                  </Typography>
                  <LineChart
                    xAxis={[{ data: [1, 2, 3, 4, 5] }]}
                    series={[{ data: [2, 5.5, 2, 8.5, 1.5] }]}
                    //xAxis={[{ data: xAxisData }]}
                    //series={[{ data: postureTrend }]}
                    width={370}
                    height={300}
                  />
                </Box>
              </div>
            </ReactCardFlip>
          </div>
        </ThemeProvider>
      </header>
    </div>
  );
}



export default SessionSummary;
