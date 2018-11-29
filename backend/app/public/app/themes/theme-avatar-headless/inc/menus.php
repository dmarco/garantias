<?php


function register_menus() {
	register_nav_menu( 'header-menu', __( 'Header Menu', 'theme-avatar-headless' ) );
}
add_action( 'after_setup_theme', 'register_menus' );
