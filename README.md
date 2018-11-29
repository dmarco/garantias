For nuxt generate go to bottom.

Please verify nginx-proxy and nginx-companion are running. 

1. Run "docker ps"
2. If the containers below do not show up, then run the following commands.

```bash
docker network create reverse-proxy
```

```bash
docker run -d -p 80:80 -p 443:443 --name nginx-proxy --net reverse-proxy -v /opt/certs:/etc/nginx/certs:ro -v /etc/nginx/vhost.d -v /usr/share/nginx/html -v /var/run/docker.sock:/tmp/docker.sock:ro --label com.github.jrcs.letsencrypt_nginx_proxy_companion.nginx_proxy=true jwilder/nginx-proxy
```

```bash
docker run -d --name nginx-letsencrypt --net reverse-proxy --volumes-from nginx-proxy -v /opt/certs:/etc/nginx/certs:rw -v /var/run/docker.sock:/var/run/docker.sock:ro jrcs/letsencrypt-nginx-proxy-companion
```

_____


### Local Development

TWO options: (A) AUTOMATED or (B) MANUAL, if you really like copy pasting.

**(A) Automated**

1. cd into project folder and run 
```
./config_local.sh
```
2. Build images 
```
make builddev
```
3. Launch containers
```
make dev
```

**(B) Manual**

cd into project folder and run 

1. Copy .env
```bash
cp .env.local .env
```
2. Copy local.source folder as a starter 
```bash
cp -R env/local.source env/local
```

3. Run the following commands from the project root, replace MY_BACK_DOMAIN with your back domain
```bash   
find ./env/local -type f -name "*.env" -print0 | xargs -0 sed -i "s/THE_LOCAL_BACK_DOMAIN/MY_BACK_DOMAIN/g"
```
```bash
find . -type f -name ".env" -print0 | xargs -0 sed -i "s/THE_LOCAL_BACK_DOMAIN/MY_BACK_DOMAIN/g"
```
4. Run the following commands from the project root, replace MY_FRONT_DOMAIN with your front domain
```bash
find ./env/local -type f -name "*.env" -print0 | xargs -0 sed -i "s/THE_LOCAL_FRONT_DOMAIN/MY_FRONT_DOMAIN/g"
```
```bash
find . -type f -name ".env" -print0 | xargs -0 sed -i "s/THE_LOCAL_FRONT_DOMAIN/MY_FRONT_DOMAIN/g"
```
5. Build images 
```bash
make builddev
```
6. Launch containers
```bash
make dev
```


STAGING & PROD - Talk to Fernando Cambria or Kik
_____

## Nuxt generate

The nuxt generate implementation will use ./frontend/app as the source files and will generate the sattic version of it based on 3 parameters.

1. Api endopoint

Example: https://back.kik.apps-avatar.com/wp-json
This is the worpress Api full url, including /wp-json.
 
It sets the ENV API_URL which is picked up by axios as default.
You can select any endpoint compatible with this frontend, it can be your dev endpoint or you might want to generate a static version of a staging or live site.

2. Front end domain

Example: front.kik.apps-avatar.com

The domain used for canonical headers and other FQDN requirements.

3. Build tag

Example: prod-45.1-for-demo

This string will be used to tag the intermidiate images and containers for the build as weel as the artifact output directory.
All successful builds are stored in directory builds_nuxtgen/BUILD_TAG

### Instructions:

1. Run
```bash
./docker_nuxt_generate.sh
```
