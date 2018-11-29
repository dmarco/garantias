<?php
/**
 * Register custom REST API routes.
 */


/**
 * Respond to a REST API request to get post data.
 *
 * @param WP_REST_Request $request
 * @return WP_REST_Response
 */
function rest_get_post( WP_REST_Request $request ) {
	return rest_get_content( $request, 'post', __FUNCTION__ );
}

/**
 * Respond to a REST API request to get page data.
 *
 * @param WP_REST_Request $request
 * @return WP_REST_Response
 */
function rest_get_page( WP_REST_Request $request ) {
	return rest_get_content( $request, 'page', __FUNCTION__ );
}

/**
 * Respond to a REST API request to get post or page data.
 * * Handles changed slugs
 * * Doesn't return posts whose status isn't published
 * * Redirects to the admin when an edit parameter is present
 *
 * @param WP_REST_Request $request
 * @param str $type
 * @param str $function_name
 * @return WP_REST_Response
 */
function rest_get_content( WP_REST_Request $request, $type, $function_name ) {
	if ( ! in_array( $type, array ( 'post', 'page' ) ) ) {
		$type = 'post';
	}
	$slug = $request->get_param( 'slug');
	if ( ! $post = get_content_by_slug( $slug, $type ) ) {
		return new WP_Error(
			$function_name,
			$slug . ' ' . $type . ' does not exist',
			array( 'status' => 404 )
		);
	};

	// Shortcut to WP admin page editor
	$edit = $request->get_param( 'edit' );
	if ( $edit === 'true' ) {
		header( 'Location: /wp-admin/post.php?post=' . $post->ID . '&action=edit' );
		exit;
	}
	$controller = new WP_REST_Posts_Controller( 'post' );
	$data = $controller->prepare_item_for_response( $post, $request );
	$response = $controller->prepare_response_for_collection( $data );

	return new WP_REST_Response( $response );
}

/**
 * Returns a post or page given a slug. Returns false if no post matches.
 *
 * @param str $slug
 * @param str $type Valid values are 'post' or 'page'
 * @return Post
 */
function get_content_by_slug( $slug, $type = 'post' ) {
	if ( ! in_array( $type, array ( 'post', 'page' ) ) ) {
		$type = 'post';
	}
	$args = array(
		'name'        => $slug,
		'post_type'   => $type,
		'post_status' => 'publish',
		'numberposts' => 1
	);

	$post_search_results = get_posts( $args );

	if ( !$post_search_results ) { //maybe the slug changed?
		// check wp_postmeta table for old slug
		$args = array(
			'meta_query' => array(
				array(
					'key' => '_wp_old_slug',
					'value' => $post_slug,
					'compare' => '=',
				)
			)
		);
		$query = new WP_Query( $args );
		$post_search_results = $query->posts;
	}
	if ( isset( $post_search_results[0] ) ) {
		return $post_search_results[0];
	}
	return false;
}

/**
 * Respond to a REST API request to get a post's latest revision.
 * * Requires a valid _wpnonce on the query string
 * * User must have 'edit_posts' rights
 * * Will return draft revisions of even published posts
 *
 * @param  WP_REST_Request $request
 * @return WP_REST_Response
 */
function rest_get_post_preview(WP_REST_Request $request) {
	$post_id = $request->get_param('id');
	// Revisions are drafts so here we remove the default 'publish' status
	remove_action('pre_get_posts', 'set_default_status_to_publish');
	if ( $revisions = wp_get_post_revisions( $post_id, array( 'check_enabled' => false ) )) {
		$last_revision = reset($revisions);
		$rev_post = wp_get_post_revision($last_revision->ID);
		$controller = new WP_REST_Posts_Controller('post');
		$data = $controller->prepare_item_for_response( $rev_post, $request );
	} elseif ( $post = get_post( $post_id ) ) { // There are no revisions, just return the saved parent post
		$controller = new WP_REST_Posts_Controller('post');
		$data = $controller->prepare_item_for_response( $post, $request );
	} else {
		return new WP_Error( 'rest_get_post_preview', 'Post ' . $post_id . ' does not exist',
			array( 'status' => 404 ) );
	}
	$response = $controller->prepare_response_for_collection( $data );
	return new WP_REST_Response($response);
}

/**
 * ACF Data in Post Object Response
 */
// You must add all custom post types to this array for ACF fields to be included in the response

$types = [ 'page'];

foreach ($types as $type) {
  add_filter( 'acf/rest_api/'.$type.'/get_fields', function( $data, $response ) use ($types) {


    if ( $response instanceof WP_REST_Response ) {
    	// die($response->get_data);
      $data = $response->get_data();
    }

    array_walk_recursive( $data, 'deepIncludeACFFields', $types );

    return $data;

  }, 10, 3 );
}

function deepIncludeACFFields( &$item, $key, $postTypes ) {
  if ( isset( $item->post_type ) && in_array( $item->post_type, $postTypes ) ) {
    $item->acf = get_fields( $item->ID );
  }
}

// function rest_prepare_categorias_de_nota( $response, $object ) {
//     if ( $object instanceof WP_Term ) {
//         $response->data['acf'] =get_fields( $object->taxonomy . '_' . $object->term_id );
//     }

//     return $response;
// }

// add_filter( 'rest_prepare_categorias_de_nota', 'rest_prepare_categorias_de_nota', 10, 3 );

// Enable the option show in rest
add_filter( 'acf/rest_api/field_settings/show_in_rest', '__return_true' );


function custom_preview_page_link($link) {
	$id = get_the_ID();
	$post_data = get_post($id );

	$revision_post_data = wp_get_post_revisions($id);
	$latest = array_shift($revision_post_data);

	$nonce = wp_create_nonce( 'wp_rest' );
	
	$uri = "";
	
	if ($post_data->post_type === "page") {
		if ($post_data->post_name === 'home-page') {
				$uri = "";
		}else{
				$uri = $post_data->post_name;
		}
	
	}
	
	if ($post_data->post_type === "producto") {
	
		$uri = "productos/" . $post_data->post_name;

	}
	
	//$link ='https://confort-front.avatarla.io/'. $uri . '?revision_id='. $latest->ID. '&parent_id=' .$post_data->ID. '&post_type=' .$post_data->post_type.'&slug=' .$post_data->post_name. '&preview=true&_wpnonce='. $nonce;
	//$link = 'https://confort-back.avatarla.io/wp-json/wp/v2/pages/'. $id. '/revisions/?_wpnonce='. $nonce;
$link = "";
	return $link;
}
//add_filter('preview_post_link', 'custom_preview_page_link');

// add acf values to revisions rest api
add_filter( 'rest_prepare_revision', function( $response, $post ) {
    $data = $response->get_data();
    $data['acf'] = get_fields( $post->ID );

    return rest_ensure_response( $data );
}, 10, 2 );