<?php
/**
 * Plugin Name: Redoy Map Pin Directory
 * Plugin URI: https://github.com/mdmdredoyislam/redoy-map-pin-directory
 * Description: A modern SaaS-style Location Directory, Store Locator, and Custom Map Pin Management for WordPress.
 * Version: 1.0.0
 * Author: Md Redoy Islam
 * Author URI: https://github.com/mdmdredoyislam
 * License: GPL2
 * license URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: redoy-map-pin-directory
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

define('REDOY_MPD_VERSION', '1.0.0');
define('REDOY_MPD_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('REDOY_MPD_PLUGIN_URL', plugin_dir_url(__FILE__));

// Load core files
if (file_exists(REDOY_MPD_PLUGIN_DIR . 'includes/Api/Rest.php')) {
    require_once REDOY_MPD_PLUGIN_DIR . 'includes/Api/Rest.php';
}

// Initialize the plugin
function redoy_mpd_init() {
    // Add admin menu
    add_action('admin_menu', 'redoy_mpd_add_admin_menu');
    // Enqueue admin scripts
    add_action('admin_enqueue_scripts', 'redoy_mpd_enqueue_admin_scripts');
    
    // Frontend Map Shortcode & Assets
    add_shortcode('redoy_mpd_map', 'redoy_mpd_render_frontend_map');
    add_action('wp_enqueue_scripts', 'redoy_mpd_enqueue_frontend_scripts');
    
    // Global filter for React ES Modules
    add_filter('script_loader_tag', 'redoy_mpd_add_module_type_to_script', 10, 3);
}
add_action('plugins_loaded', 'redoy_mpd_init');

function redoy_mpd_add_admin_menu() {
    add_menu_page(
        'Map Pin Directory',
        'Map Pin Directory',
        'manage_options',
        'map-pin-directory',
        'redoy_mpd_admin_page_callback',
        'dashicons-location-alt',
        30
    );
}

function redoy_mpd_admin_page_callback() {
    echo '<div id="mpd-admin-app"></div>';
}

function redoy_mpd_enqueue_admin_scripts($hook) {
    if ($hook !== 'toplevel_page_map-pin-directory') {
        return;
    }
    
    // Check if production build exists
    $is_production = file_exists(REDOY_MPD_PLUGIN_DIR . 'assets/admin.js');
    
    if (!$is_production && wp_get_environment_type() === 'local') {
        // Development mode: Vite Server
        wp_enqueue_script('mpd-vite-client', 'http://localhost:3000/@vite/client', array(), REDOY_MPD_VERSION, true);
        wp_enqueue_script('mpd-admin-app', 'http://localhost:3000/src/admin/main.jsx', array(), REDOY_MPD_VERSION, true);
    } elseif ($is_production) {
        // Production mode: Load compiled assets
        wp_enqueue_script('mpd-admin-app-prod', REDOY_MPD_PLUGIN_URL . 'assets/admin.js', array(), REDOY_MPD_VERSION, true);
        wp_localize_script('mpd-admin-app-prod', 'redoyMpdApiSettings', array(
            'root' => esc_url_raw(rest_url()),
            'nonce' => wp_create_nonce('wp_rest')
        ));
        
        if (file_exists(REDOY_MPD_PLUGIN_DIR . 'assets/style.css')) {
            wp_enqueue_style('mpd-admin-styles', REDOY_MPD_PLUGIN_URL . 'assets/style.css', array(), REDOY_MPD_VERSION);
        }
    }
}

function redoy_mpd_add_module_type_to_script($tag, $handle, $src) {
    if (in_array($handle, array('mpd-vite-client', 'mpd-admin-app', 'mpd-frontend-app', 'mpd-admin-app-prod', 'mpd-frontend-app-prod'))) {
        // phpcs:ignore WordPress.WP.EnqueuedResources.NonEnqueuedScript
        return str_replace( ' src=', ' type="module" src=', $tag );
    }
    return $tag;
}

// Frontend shortcode
function redoy_mpd_render_frontend_map($atts) {
    // Merge shortcode attributes with defaults
    $atts = shortcode_atts(array(
        'map_id' => 'default',
        'height' => '600px'
    ), $atts, 'redoy_mpd_map');

    // Return the root div for React to attach to
    return '<div class="mpd-frontend-root" data-map-id="' . esc_attr($atts['map_id']) . '" style="height: ' . esc_attr($atts['height']) . '; width: 100%;"></div>';
}

function redoy_mpd_enqueue_frontend_scripts() {
    global $post;
    // Basic check to see if shortcode is present
    if (is_a($post, 'WP_Post') && has_shortcode($post->post_content, 'redoy_mpd_map')) {
        $is_production = file_exists(REDOY_MPD_PLUGIN_DIR . 'assets/frontend.js');

        if (!$is_production && wp_get_environment_type() === 'local') {
            // Development mode: Vite Server
            wp_enqueue_script('mpd-vite-client', 'http://localhost:3000/@vite/client', array(), REDOY_MPD_VERSION, true);
            wp_enqueue_script('mpd-frontend-app', 'http://localhost:3000/src/frontend/main.jsx', array(), REDOY_MPD_VERSION, true);
        } elseif ($is_production) {
            // Production mode: Load compiled assets
            wp_enqueue_script('mpd-frontend-app-prod', REDOY_MPD_PLUGIN_URL . 'assets/frontend.js', array(), REDOY_MPD_VERSION, true);
            wp_localize_script('mpd-frontend-app-prod', 'redoyMpdApiSettings', array(
                'root' => esc_url_raw(rest_url()),
                'nonce' => wp_create_nonce('wp_rest')
            ));

            if (file_exists(REDOY_MPD_PLUGIN_DIR . 'assets/style.css')) {
                wp_enqueue_style('mpd-frontend-styles', REDOY_MPD_PLUGIN_URL . 'assets/style.css', array(), REDOY_MPD_VERSION);
            }
        }
    }
}

// Database creation on activation
register_activation_hook(__FILE__, 'redoy_mpd_activate_plugin');
function redoy_mpd_activate_plugin() {
    global $wpdb;
    
    $charset_collate = $wpdb->get_charset_collate();
    $table_locations = $wpdb->prefix . 'redoy_mpd_locations';
    $table_reviews = $wpdb->prefix . 'redoy_mpd_reviews';
    $table_analytics = $wpdb->prefix . 'redoy_mpd_analytics';
    $table_maps = $wpdb->prefix . 'redoy_mpd_maps';
    $table_categories = $wpdb->prefix . 'redoy_mpd_categories';

    $sql = "CREATE TABLE $table_locations (
        id bigint(20) NOT NULL AUTO_INCREMENT,
        title varchar(255) NOT NULL,
        slug varchar(255) NOT NULL,
        description text,
        lat decimal(10,8),
        lng decimal(11,8),
        address varchar(255),
        city varchar(100),
        state varchar(100),
        country varchar(100),
        category varchar(100),
        metadata longtext,
        status varchar(50) DEFAULT 'active',
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY  (id)
    ) $charset_collate;

    CREATE TABLE $table_reviews (
        id bigint(20) NOT NULL AUTO_INCREMENT,
        location_id bigint(20) NOT NULL,
        user_id bigint(20) DEFAULT 0,
        rating int(1) NOT NULL,
        content text,
        status varchar(20) DEFAULT 'pending',
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY  (id)
    ) $charset_collate;

    CREATE TABLE $table_analytics (
        id bigint(20) NOT NULL AUTO_INCREMENT,
        event_type varchar(50) NOT NULL,
        event_data text,
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY  (id)
    ) $charset_collate;

    CREATE TABLE $table_maps (
        id bigint(20) NOT NULL AUTO_INCREMENT,
        title varchar(255) NOT NULL,
        settings longtext,
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY  (id)
    ) $charset_collate;

    CREATE TABLE $table_categories (
        id bigint(20) NOT NULL AUTO_INCREMENT,
        name varchar(255) NOT NULL,
        slug varchar(255) NOT NULL,
        icon varchar(255),
        color varchar(255),
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY  (id)
    ) $charset_collate;";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
}
