import logo from './logo.svg';
import './App.css';

// VideoCapture.js
import React, { useEffect, useRef } from 'react';
import io from 'socket.io-client';

const App = () => {
  const videoRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io('http://127.0.0.1:5000', {
      transports: ['websocket'],
    });

    socketRef.current.on('response', (data) => {
        console.log(data);
    });

    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();

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
      .catch(error => {
        console.error('Error accessing webcam:', error);
      });

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

    // Access the webcam
    // navigator.mediaDevices.getUserMedia({ video: true })
    //   .then(stream => {
    //     videoRef.current.srcObject = stream;
    //     videoRef.current.play();

    //     const mediaRecorder = new MediaRecorder(stream);
    //     mediaRecorder.ondataavailable = (event) => {
    //       if (event.data.size > 0) {
    //         socketRef.current.emit('videoData', event.data);
    //       }
    //     };

    //     mediaRecorder.start(100); // Collect video data every 100ms
    //   })
    //   .catch(error => {
    //     console.error('Error accessing webcam:', error);
    //   });

    // return () => {
    //   // Clean up
    //   if (socketRef.current) {
    //     socketRef.current.disconnect();
    //   }
    //   if (videoRef.current && videoRef.current.srcObject) {
    //     videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    //   }
    // };
  // }, []);

  return (
    <div>
      <video ref={videoRef} width="640" height="480" autoPlay />
    </div>
  );
};




export default App;
