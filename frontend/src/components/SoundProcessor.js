import React, { useEffect, useRef, useState } from 'react';

const SoundDetector = () => {
  const [isAudioContextInitialized, setIsAudioContextInitialized] = useState(false);
  const [soundLevel, setSoundLevel] = useState(0);
  const [totalSoundLevel, setTotalSoundLevel] = useState(0);
  const [badSoundLevel, setBadSoundLevel] = useState(0);
  const [proportion, setProportion] = useState(0);
  const [isAudioStopped, setIsAudioStopped] = useState(false);
  const [goodNoise, setGoodNoise] = useState(true)
  const audioContextRef = useRef(null);
  const microphoneRef = useRef(null);
  const audioWorkletNodeRef = useRef(null);
  const canvasRef = useRef(null);
  const soundthreshold = 75;

  const startAudioContext = async () => {
    if (!isAudioContextInitialized) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      await audioContextRef.current.audioWorklet.addModule('volume-processor.js');
  
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
          audioWorkletNodeRef.current = new AudioWorkletNode(audioContextRef.current, 'volume-processor');
  
          audioWorkletNodeRef.current.port.onmessage = (event) => {
            let { volume } = event.data;
  
            // Convert negative dB to a 0 to 100 scale for better readability
            const normalizedVolume = Math.max(0, (volume + 100));
            setSoundLevel(normalizedVolume);
            drawSoundLevel(normalizedVolume);
  
            setTotalSoundLevel((prevTotal) => {
              return prevTotal + 1;
            });

            if (normalizedVolume> soundthreshold) {
              setBadSoundLevel((prevBad) => prevBad + 1);
              setGoodNoise(false)
            }
            else{
                setGoodNoise(true)
            }
          };
  
          microphoneRef.current.connect(audioWorkletNodeRef.current);
          audioWorkletNodeRef.current.connect(audioContextRef.current.destination);
  
          setIsAudioContextInitialized(true);
          setIsAudioStopped(false); // Reset the audio stopped flag
        })
        .catch((err) => console.error('Error accessing microphone: ', err));
    }
  };

  const stopAudioContext = () => {
    if (isAudioContextInitialized) {
      if (audioWorkletNodeRef.current) {
        audioWorkletNodeRef.current.disconnect();
      }
      if (microphoneRef.current) {
        microphoneRef.current.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }

      setIsAudioContextInitialized(false);
      setIsAudioStopped(true); // Set audio stopped flag
    }
  };

  const calculateProportion = () => {
    if (totalSoundLevel > 0) {
      const proportionValue = (badSoundLevel / totalSoundLevel) * 100;
      setProportion(proportionValue.toFixed(2));
    } else {
      setProportion(0);
    }
  };

  useEffect(() => {
    calculateProportion();
  }, [totalSoundLevel, badSoundLevel, isAudioStopped]);

  const drawSoundLevel = (volume) => {
    // Draw the sound level on the canvas
  };

  return (
    <div>
      <h1>Sound Detector</h1>
      <button onClick={startAudioContext} disabled={isAudioContextInitialized}>Start Listening</button>
      <button onClick={stopAudioContext} disabled={!isAudioContextInitialized}>Stop Listening</button>
      <p>Click the button to start listening for sound levels...</p>
      <p>Current Sound Level: {soundLevel.toFixed(2)} dB</p>
      <p>Proportion of Time Exceeding {soundthreshold} dB: {proportion}%</p>
      <p>{goodNoise ? 'Good Noise' : 'Bad Noise'}</p>
      <canvas ref={canvasRef} width={300} height={150} style={{ border: '1px solid black' }}></canvas>
    </div>
  );
};

export default SoundDetector;
