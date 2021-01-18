FROM node:lts-alpine
WORKDIR /usr/src/app
COPY bGames-APIrestPOSTAtt/package*.json ./
RUN npm install
COPY bGames-APIrestPOSTAtt ./
RUN ls -l
CMD ["npm", "run", "prod"]