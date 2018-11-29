#!/bin/bash
echo Enter the api endpoint from where content will be pulled, ie https://wp.avatarla.io/wp-json
read apiurl
echo Ferpect, $apiurl
echo Now enter your frontend domain please for example: exa-front.example.com
read frontdomain
echo Ferpect, $frontdomain will be used as frontend domain.
echo Enter build tag ie: prod-0.1
read buildtag

docker build --build-arg API_URL=$apiurl --build-arg FRONTEND_DOMAIN=$frontdomain -f ./docker/nuxtgenerate/Dockerfile -t nuxtgen:$buildtag .
docker run -d -it --name nuxtgenbuilder_$buildtag nuxtgen:$buildtag
mkdir -p builds_nuxtgen/$buildtag
docker cp nuxtgenbuilder_$buildtag:/usr/app/dist builds_nuxtgen/$buildtag
docker stop nuxtgenbuilder_$buildtag
docker rm nuxtgenbuilder_$buildtag