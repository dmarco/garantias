#!/bin/bash
# Ask the user for their name THE_DOCKER_IMAGE_PREFIX
echo Enter your wordpress backend domain. For example: exa-back.example.com
read backdomain
echo Perpect, $backdomain will be used as backend domain.
echo Enter your frontend domain please for example: exa-front.example.com
read frontdomain
echo Perpect, $frontdomain will be used as frontend domain.
echo Enter your ADMIN domain please for example: admin-exa.example.com
read admindomain
echo Perpect, $admindomain will be used as ADMIN domain.
echo Enter your DOCKER IMAGE PREFIX for example: pepe
read dockerimageprefix
echo Perpect, $dockerimageprefix will be used as your DOCKER IMAGE PREFIX
cp .env.local .env


cp -R env/local.source env/local


find ./env/local -type f -name "*.env" -print0 | xargs -0 sed -i "s/THE_LOCAL_BACK_DOMAIN/$backdomain/g"
find . -type f -name ".env" -print0 | xargs -0 sed -i "s/THE_LOCAL_BACK_DOMAIN/$backdomain/g"
find ./env/local -type f -name "*.env" -print0 | xargs -0 sed -i "s/THE_LOCAL_FRONT_DOMAIN/$frontdomain/g"
find . -type f -name ".env" -print0 | xargs -0 sed -i "s/THE_LOCAL_FRONT_DOMAIN/$frontdomain/g"

find ./env/local -type f -name "*.env" -print0 | xargs -0 sed -i "s/THE_ADMIN_DOMAIN/$admindomain/g"
find . -type f -name ".env" -print0 | xargs -0 sed -i "s/THE_ADMIN_DOMAIN/$admindomain/g"

find ./env/local -type f -name "*.env" -print0 | xargs -0 sed -i "s/THE_DOCKER_IMAGE_PREFIX/$dockerimageprefix/g"
find . -type f -name ".env" -print0 | xargs -0 sed -i "s/THE_DOCKER_IMAGE_PREFIX/$dockerimageprefix/g"