FROM node:24-slim

WORKDIR /app

COPY . . 

RUN npm install

EXPOSE 3001

CMD ["npm", "start"] 