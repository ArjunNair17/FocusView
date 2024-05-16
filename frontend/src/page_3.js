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

// Your CircularProgressWithLabel component
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
        <Typography variant="caption" component="div" color="text.secondary">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
};

// Your Page3 component
function Page3() {
  const [progress, setProgress] = React.useState(10);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
    }, 800);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <CircularProgressWithLabel value={progress} size={300} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <VideoCameraFrontIcon/>
          <PauseCircleIcon />
          <CancelIcon />
        </div>
        
      </header>
    </div>
  );
}

export { Page3, CircularProgressWithLabel };
