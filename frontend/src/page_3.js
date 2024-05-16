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
function Page3() {
  const [progress, setProgress] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);


  // Calculate total duration whenever hours, minutes, or seconds change
  const totalDuration = React.useMemo(() => {
    const hours = parseInt(window.hours) || 0;
    const minutes = parseInt(window.minutes) || 0;
    const seconds = parseInt(window.seconds) || 0;
    return (seconds * 1000) + (minutes * 60 * 1000) + (hours * 60 * 60 * 1000);
  }, [window.hours, window.minutes, window.seconds]);

  console.log("duration", totalDuration); // Debugging
  //const totalDuration = (parseInt(window.seconds) * 1000) + (parseInt(window.minutes) * 60 * 1000) + (parseInt(window.hours) * 60 * 60 * 1000);; // Total duration in milliseconds
  //console.log("duration",totalDuration); // Debugging
  const granularity = 1000; // Update progress every second
  const increment = (granularity / totalDuration) * 100; // Calculate increment percentage

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
        setIsPaused(!isPaused); // Pause the timer
    };

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };



    
 return (
    <div className="App">
      <header className="App-header">
        <CircularProgressWithLabel value={progress} size={300} />
        <div style={{ display: 'flex', justifyContent: 'space-evenly'}}>
            <IconButton>
            <VideoCameraFrontIcon style={{ fontSize: 40 }} />
            </IconButton>
            <IconButton onClick={handlePauseClick}>
              <PauseCircleIcon style={{ fontSize: 40 }} />
            </IconButton>
            <IconButton onClick={handleClickOpen}>
            <CancelIcon style={{ fontSize: 40 }} />
            </IconButton>
        </div>
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

export { Page3, CircularProgressWithLabel };
