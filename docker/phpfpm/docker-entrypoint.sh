#!/usr/bin/env bash

#set -e   # (errexit) Exit if any subcommand or pipeline returns a non-zero status
#set -u   # (nounset) Exit on any attempt to use an uninitialised variable

ROOT_DIR=/var/www/html
WEB_USER=www-data

#curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

cd $ROOT_DIR

chown -R www-data:www-data $ROOT_DIR
#rm -rf public/wp
#rm -rf public/app/plugins
#echo 'ACF_PRO_KEY=${ACF_PRO_KEY}' > /var/www/html/.env

#composer install --no-interaction --optimize-autoloader --working-dir=/var/www/html/


# Make sure uploads directory exists and is writeable.
# mkdir -p $ROOT_DIR/wp-content/uploads
# chown $WEB_USER:$WEB_USER $ROOT_DIR/wp-content
# chown -R $WEB_USER:$WEB_USER $ROOT_DIR/wp-content/uploads

cd /var/www/html/public

# Install WordPress.

su $WEB_USER -s /bin/sh -c "wp core install --title=\"${SITE_TITLE}\"  --admin_user=\"${ADMIN_USER:-admin}\"   --admin_password=\"${ADMIN_PASSWORD:-kik1kik}\"  --admin_email=\"${ADMIN_EMAIL:-wp@avatarla.com}\" --url=\"${BACKEND_DOMAIN}\" --skip-email"

su $WEB_USER -s /bin/sh -c "\
wp theme activate theme-avatar-headless"

su $WEB_USER -s /bin/sh -c "\
wp rewrite structure '/%year%/%monthnum%/%day%/%postname%/'"

su $WEB_USER -s /bin/sh -c "\
wp plugin activate --all"

su $WEB_USER -s /bin/sh -c "\
 wp redis enable"

# su $WEB_USER -s /bin/sh -c "\
#  wp post create --post_type=page --post_status=publish --post_title='Home Page'"
 
# su $WEB_USER -s /bin/sh -c "\
#  wp post create --post_type=page --post_status=publish --post_title='Contacto'"
 
# su $WEB_USER -s /bin/sh -c "\
#  wp post create --post_type=page --post_status=publish --post_title='Productos'"
 
# su $WEB_USER -s /bin/sh -c "\
#  wp post create --post_type=page --post_status=publish --post_title='Tips y Usos'"
 
# su $WEB_USER -s /bin/sh -c "\
#  wp post create --post_type=page --post_status=publish --post_title='Conveniencia del Hogar'"
 
# su $WEB_USER -s /bin/sh -c "\
#  wp post create --post_type=page --post_status=publish --post_title='Tiendas'"
 
# active=$(wp plugin list --status=active --format=csv --fields=name)

# for plugin in $active; do
# 	(
# 		if [ ! $plugin = 'name' ]; then
# 			echo $plugin
# 		fi
# 	)
# done



#chown -R www-data:www-data $DOCUMENT_ROOT

exec php-fpm