FROM avatarla/docker-alpine-phpfpm-wpcli:latest

ARG SRC_DIR
ARG DOCKER_IMAGE_CONTEXT

COPY $SRC_DIR /var/www/html

RUN echo 'ACF_PRO_KEY=b3JkZXJfaWQ9NjgzMzN8dHlwZT1kZXZlbG9wZXJ8ZGF0ZT0yMDE1LTExLTA3IDE5OjQ1OjM1' > /var/www/html/.env

COPY --from=composer:1.5 /usr/bin/composer /usr/bin/composer
RUN /usr/bin/composer install --no-interaction --optimize-autoloader --working-dir=/var/www/html/

RUN rm -rf /var/www/html/logs/* \
    && chown -R www-data:www-data /var/www/html


COPY $DOCKER_IMAGE_CONTEXT/php.ini /usr/local/etc/php/conf.d/php.ini

COPY $DOCKER_IMAGE_CONTEXT/docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

#VOLUME /var/www/html/public 
# ENTRYPOINT ["docker-entrypoint.sh"]

#COPY docker/phpfpm/xdebug.ini /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini

EXPOSE 9000
CMD ["php-fpm"]


