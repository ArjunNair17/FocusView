import pyaudio
import numpy as np
from datetime import datetime

# Constants
THRESHOLD = 0.1  # Adjust this value as needed for your use case
CHUNK = 1024  # Number of frames per buffer
FORMAT = pyaudio.paInt16  # Audio format (16-bit)
CHANNELS = 1  # Number of channels (mono)

RATE = 44100  # Sample rate (samples per second)
totalticks = 0
loudticks = 0
timestamplist = []

def is_too_loud(data, threshold):
    # Convert the byte data to numpy array
    audio_data = np.frombuffer(data, dtype=np.int16)
    # Normalize the audio data
    normalized_data = audio_data / 32768.0
    # Calculate the RMS value
    rms_value = np.sqrt(np.mean(normalized_data**2))
    return rms_value > threshold

# Initialize PyAudio
p = pyaudio.PyAudio()

# Open a stream with the specified format, channels, rate, and input flag set to True
stream = p.open(format=FORMAT,
                channels=CHANNELS,
                rate=RATE,
                input=True,
                frames_per_buffer=CHUNK)

print("Listening...")

try:
    while True:
        # Read a chunk of audio data from the stream
        data = stream.read(CHUNK, exception_on_overflow=False)
        totalticks += 1
        if is_too_loud(data, THRESHOLD):
            print("Warning: Sound is too loud!")
            now = datetime.now()
            # Format the datetime object as a timestamp
            timestamp = now.strftime("%Y-%m-%d %H:%M:%S")
            timestamplist.append(timestamp)
            loudticks += 1

      
            
        

        

except KeyboardInterrupt:
    print("Stopping...")

# Stop and close the stream
stream.stop_stream()
stream.close()

# Terminate the PyAudio object
p.terminate()

#hold proportion of the time in which loud noise is detected

stats = [round(loudticks/totalticks), timestamplist]
