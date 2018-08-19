FROM node:8

WORKDIR /app
COPY . /app

# prep and run static
WORKDIR /app/client
RUN ["npm", "install"]
RUN ["npm", "run", "build"]

# prep and run backend
WORKDIR /app
RUN ["npm", "install"]
CMD ["npm", "simulate"]
