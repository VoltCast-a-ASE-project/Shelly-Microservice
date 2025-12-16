# get node image for build
FROM node:20-alpine AS build

# create work dir
WORKDIR /app

# installs for sqlite
RUN apk add --no-cache sqlite

# copy necessary installs etc.
COPY package*.json ./

# create project
RUN npm ci --omit=dev

# copy all
COPY service.js .
COPY VMC/controllers/ VMC/controllers/
COPY VMC/models/ VMC/models/
COPY VMC/routes/ VMC/routes/
COPY database/ database/
COPY swagger.js .

#run swagger
RUN npm run swagger

# get node image for run
FROM node:20-alpine

WORKDIR /app

# set env to production
ENV NODE_ENV=production

# get app dir
COPY --from=build /app ./

# create db volume
VOLUME ["/app/database"]

# set user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# expose on port 8083
EXPOSE 8083

# start service
CMD ["node", "service.js"]