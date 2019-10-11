FROM node
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN npm install
EXPOSE 25565
CMD [ "node", "index.js" ]
