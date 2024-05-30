import React, { useState } from 'react';
import { ThemeProvider, createTheme, Typography, Box } from '@mui/material';
import { Gauge } from '@mui/x-charts/Gauge';
import { LineChart } from '@mui/x-charts/LineChart';
import ReactCardFlip from 'react-card-flip';

function Page5() {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    setIsFlipped(!isFlipped);
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: '#FFFBFB4D',
        dark: '#FFFFFF6D',
      },
    },
  });

  return (
    <div className="App">
      <header className="App-header">
        <ThemeProvider theme={theme}>
          <Typography variant="h5" style={{ color: '#FFF', marginBottom: '20px' }}>Session Report</Typography>
          <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
            <div>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Box
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
                  <Gauge width={200} height={200} value={10} color="#FFFFF" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                </Box>

                <Box
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
                  <Gauge width={200} height={200} value={10} style={{ color: '#FFF', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                  
                </Box>
              </div>
              <button onClick={handleClick}>Click to flip</button>
            </div>


            <div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Box
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
                    xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                    series={[{ data: [2, 5.5, 2, 8.5, 1.5, 5] }]}
                    width={370}
                    height={300}
                  />
                </Box>
                <Box
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
                    EyeTracking
                  </Typography>
                  <LineChart
                    xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                    series={[{ data: [2, 5.5, 2, 8.5, 1.5, 5] }]}
                    width={370}
                    height={300}
                  />
                </Box>
              </div>
              <button onClick={handleClick}>Click to flip</button>
            </div>
          </ReactCardFlip>
        </ThemeProvider>
      </header>
    </div>
  );
}

export default Page5;
