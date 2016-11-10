# To build and run with Docker:
#  need to be lowercase
#  $ docker build -t ng-app .
#  $ docker run -it --rm -p 4000:4000 ng-app
#  $ docker run -it --rm -p 3000:3000 -p 3001:3001 ng-app
#  $ docker run --name testdb -p 27017:27017 -d mongo:3
#  $ docker run --name hapi-app -p 3000:3000 -d -e MONGO_HOST=testdb --link testdb ng-app

#  $ docker run -it -u root ng-app /bin/bash
# <container ID> root@78e82f680994$
#  $ docker commit 78e82f680994 ng-app #save after edit a file
#  $ docker build -t ng-app .

#  $ docker run -t -i ng-app /bin/bash
#  $ docker exce -it ng-app /bin/bash
# https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
# https://www.digitalocean.com/community/tutorials/how-to-deploy-a-node-js-and-mongodb-application-with-rancher-on-ubuntu-14-04
# http://support.dominodatalab.com/hc/en-us/articles/207051176-Modifying-Docker-Images-Directly
FROM node:latest

RUN mkdir -p /appName /home/nodejs && \
    groupadd -r nodejs && \
    useradd -r -g nodejs -d /home/nodejs -s /sbin/nologin nodejs && \
    chown -R nodejs:nodejs /home/nodejs

WORKDIR /appName
COPY package.json /appName/
RUN npm install --unsafe-perm=true

COPY . /appName
RUN chown -R nodejs:nodejs /appName
USER nodejs

ENV DB="mongodb://ibm564-r90jnw8d/node-rest-auth"
ENV PORT=4000
#CMD npm start
#EXPOSE 8080
CMD npm run dockerexpress
