FROM public.ecr.aws/lambda/nodejs:20
# FROM node:18.0.0-alpine

# Declaring env
ENV NODE_ENV development

# Setting up the work directory
WORKDIR /server

# Copying all the files in our project
COPY . .

# Installing dependencies
RUN npm install

# Starting our application
# CMD [ "node", "index.js" ]
CMD [ "index.handler" ]

# Exposing server port
EXPOSE 8080