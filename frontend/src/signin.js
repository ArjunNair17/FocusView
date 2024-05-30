import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './App.css'; 
import Divider from '@mui/material/Divider';


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

const signUpBoxStyle = {
    
};

const horizontalLine = {
  display: 'block',
  width: '100%',
  height: '1px',
}

export default function SignIn() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <div className="App-header"> {/* Apply the class here */}
        <Container component="main" >
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.3)', // Black color with 50% opacity
            padding: '20px',
            borderRadius: '10px',
            width: '500px',  // Set the width to 100%
            height: '100%', // Set the height to 100%
            // minWidth: '500px', // Minimum height for the box
            }}
          >
            <Typography component="h1" variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
              Welcome back.<br />
              Sign in to your account
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="email address"
                name="email"
                autoComplete="email"
                autoFocus
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '40px',
                    '& fieldset': {
                      borderColor: 'white',
                      borderWidth: '2px',
                    },
                    '&:hover fieldset': {
                      borderColor: 'white',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white',
                    },
                    '& .MuiOutlinedInput-input': {
                      color: 'white',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'white',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: 'white',
                  }, 
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="password"
                type="password"
                id="password"
                autoComplete="current-password"
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '40px',
                    '& fieldset': {
                      borderColor: 'white',
                      borderWidth: '2px',
                    },
                    '&:hover fieldset': {
                      borderColor: 'white',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white',
                    },
                    '& .MuiOutlinedInput-input': {
                      color: 'white',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'white',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: 'white',
                  }, 
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, borderRadius: '40px', backgroundColor: 'black' }}
              >
                Sign In
              </Button>
              <Divider sx={{ borderColor: 'white' }}>
              <Typography variant="body2" sx={{ fontSize: '15px' }}>or</Typography>
              </Divider>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ 
                  mt: 3, 
                  mb: 2, 
                  borderRadius: '40px', 
                  backgroundColor: 'transparent', 
                  textTransform: 'lowercase',
                  border: '2px solid white', // Added border property
                  color: 'white' // Ensure text color is white
                }}
              >
                sign in
              </Button>
              {/* <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              /> */}
              
              {/* <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="#" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid> */}
            </Box>
          </Box>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
      </div>
    </ThemeProvider>
  );
}
