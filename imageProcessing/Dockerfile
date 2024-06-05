# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY ./dependencies.txt /app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r dependencies.txt

#Install OpenGL and GLib Libraries for CV
RUN apt-get update && apt-get install -y libgl1-mesa-glx libglib2.0-0

COPY . . 

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Run without display
ENV DISPLAY=:0

# Run app.py when the container launches
CMD ["python", "server.py"]
