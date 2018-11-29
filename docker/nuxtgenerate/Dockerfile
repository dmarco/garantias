FROM avatarla/docker-node-8.9-alpine-nodemon:latest

ARG FRONTEND_DOMAIN
ARG API_URL

ENV API_URL ${API_URL}
ENV FRONTEND_DOMAIN ${FRONTEND_DOMAIN}

WORKDIR /usr/app

COPY ./frontend/app /usr/app

RUN npm install --quiet
RUN npm run generate




