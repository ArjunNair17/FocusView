import React from 'react';
import { Box, Typography, ThemeProvider, createTheme } from '@mui/material';
import { Gauge } from '@mui/x-charts/Gauge';
import { LineChart } from '@mui/x-charts/LineChart';

import Stack from '@mui/material/Stack';


function Page4() {
  return (
    <div className="App">
      <header className="App-header">
        <ThemeProvider
          theme={createTheme({
            palette: {
              primary: {
                main: '#FFFBFB4D',
                dark: '#FFFFFF6D',
              },
            },
          })}
        >
        <Typography variant="h5" style={{ color: '#FFF', marginBottom: '20px' }}>Session Report</Typography>
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
                position: 'relative', // Add position relative to contain the text
            }}
            >
            <Typography variant="h5" style={{ color: '#FFF', position: 'absolute', top: '10%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                Posture
            </Typography>
            <Gauge width={200} height={200} value={10} color="#FFFFF"  style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}/>
            <LineChart
            xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
            series={[
                {
                data: [2, 5.5, 2, 8.5, 1.5, 5],
                },
            ]}
            width={370}
            height={300}
            />
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
                position: 'relative', // Add position relative to contain the text
              }}
            >
            <Typography variant="h5" style={{ color: '#FFF', position: 'absolute', top: '10%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                Eye Tracking
            </Typography>
            <Gauge width={200} height={200} value={10}  style={{ color: '#FFF', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}/>
            <LineChart
            xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
            series={[
                {
                data: [2, 5.5, 2, 8.5, 1.5, 5],
                },
            ]}
            width={370}
            height={300}
            />
           </Box>
          </div>
        </ThemeProvider>
            
      </header>
    </div>
  );
}

export default Page4;
