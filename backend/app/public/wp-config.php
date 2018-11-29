<?php

$table_prefix  = getenv('TABLE_PREFIX') ?: 'wp_';


    
foreach ($_ENV as $key => $value) {
	$capitalized = strtoupper($key);
	if (!defined($capitalized)) {
		define($capitalized, $value);
	}
}

/** SSL */  
define('FORCE_SSL_ADMIN', true);  
// in some setups HTTP_X_FORWARDED_PROTO might contain  
// a comma-separated list e.g. http,https  
// so check for https existence  
if (strpos($_SERVER['HTTP_X_FORWARDED_PROTO'], 'https') !== false)  
    $_SERVER['HTTPS']='on';
    
/** Absolute path to the WordPress directory. */

$isSsl = true;

define('WP_CONTENT_DIR', dirname(__FILE__).'/app');

unset($isSsl);

/** Absolute path to the WordPress directory. */
!defined('ABSPATH') && define('ABSPATH', __DIR__.'/wp/');

/** Sets up WordPress vars and included files. */
require __DIR__ . '/../vendor/autoload.php';

/** WP-Redis */
$redis_server = array(
    'host'     => redis,
    'port'     => 6379,
    'database' => 0, 
);

require_once ABSPATH . 'wp-settings.php';
