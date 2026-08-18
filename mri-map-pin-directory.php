<?php
/**
 * Plugin Name: MRI Map Pin Directory
 * Plugin URI: https://github.com/mdredoyislam/mri-map-pin-directory
 * Description: A modern SaaS-style Location Directory, Store Locator, and Custom Map Pin Management for WordPress.
 * Version: 1.0.0
 * Author: Md Redoy Islam
 * Author URI: https://github.com/mdredoyislam
 * License: GPL2
 * license URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: mri-map-pin-directory
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

define('MPD_VERSION', '1.0.0');
define('MPD_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('MPD_PLUGIN_URL', plugin_dir_url(__FILE__));

// Load core files
if (file_exists(MPD_PLUGIN_DIR . 'includes/Api/Rest.php')) {
    require_once MPD_PLUGIN_DIR . 'includes/Api/Rest.php';
}

// Initialize the plugin
function mpd_init() {
    // Add admin menu
    add_action('admin_menu', 'mpd_add_admin_menu');
    // Enqueue admin scripts
    add_action('admin_enqueue_scripts', 'mpd_enqueue_admin_scripts');
    
    // Frontend Map Shortcode & Assets
    add_shortcode('mri_mpd_map', 'mpd_render_frontend_map');
    add_action('wp_enqueue_scripts', 'mpd_enqueue_frontend_scripts');
    
    // Global filter for React ES Modules
    add_filter('script_loader_tag', 'mpd_add_module_type_to_script', 10, 3);
}
add_action('plugins_loaded', 'mpd_init');

function mpd_add_admin_menu() {
    add_menu_page(
        'Map Pin Directory',
        'Map Pin Directory',
        'manage_options',
        'map-pin-directory',
        'mpd_admin_page_callback',
        'dashicons-location-alt',
        30
    );
}

function mpd_admin_page_callback() {
    echo '<div id="mpd-admin-app"></div>';
}

function mpd_enqueue_admin_scripts($hook) {
    if ($hook !== 'toplevel_page_map-pin-directory') {
        return;
    }
    
    // Check if production build exists
    $is_production = file_exists(MPD_PLUGIN_DIR . 'assets/admin.js');
    
    if (!$is_production && wp_get_environment_type() === 'local') {
        // Development mode: Vite Server
        wp_enqueue_script('mpd-vite-client', 'http://localhost:3000/@vite/client', array(), MPD_VERSION, true);
        wp_enqueue_script('mpd-admin-app', 'http://localhost:3000/src/admin/main.jsx', array(), MPD_VERSION, true);
    } elseif ($is_production) {
        // Production mode: Load compiled assets
        wp_enqueue_script('mpd-admin-app-prod', MPD_PLUGIN_URL . 'assets/admin.js', array(), MPD_VERSION, true);
        wp_localize_script('mpd-admin-app-prod', 'mpdApiSettings', array(
            'root' => esc_url_raw(rest_url()),
            'nonce' => wp_create_nonce('wp_rest')
        ));
        
        if (file_exists(MPD_PLUGIN_DIR . 'assets/style.css')) {
            wp_enqueue_style('mpd-admin-styles', MPD_PLUGIN_URL . 'assets/style.css', array(), MPD_VERSION);
        }
    }
}

function mpd_add_module_type_to_script($tag, $handle, $src) {
    if (in_array($handle, array('mpd-vite-client', 'mpd-admin-app', 'mpd-frontend-app', 'mpd-admin-app-prod', 'mpd-frontend-app-prod'))) {
        // phpcs:ignore WordPress.WP.EnqueuedResources.NonEnqueuedScript
        return str_replace( ' src=', ' type="module" src=', $tag );
    }
    return $tag;
}

// Frontend shortcode
function mpd_render_frontend_map($atts) {
    // Merge shortcode attributes with defaults
    $atts = shortcode_atts(array(
        'map_id' => 'default',
        'height' => '600px'
    ), $atts, 'mri_mpd_map');

    // Return the root div for React to attach to
    return '<div class="mpd-frontend-root" data-map-id="' . esc_attr($atts['map_id']) . '" style="height: ' . esc_attr($atts['height']) . '; width: 100%;"></div>';
}

function mpd_enqueue_frontend_scripts() {
    global $post;
    // Basic check to see if shortcode is present
    if (is_a($post, 'WP_Post') && has_shortcode($post->post_content, 'mri_mpd_map')) {
        $is_production = file_exists(MPD_PLUGIN_DIR . 'assets/frontend.js');

        if (!$is_production && wp_get_environment_type() === 'local') {
            // Development mode: Vite Server
            wp_enqueue_script('mpd-vite-client', 'http://localhost:3000/@vite/client', array(), MPD_VERSION, true);
            wp_enqueue_script('mpd-frontend-app', 'http://localhost:3000/src/frontend/main.jsx', array(), MPD_VERSION, true);
        } elseif ($is_production) {
            // Production mode: Load compiled assets
            wp_enqueue_script('mpd-frontend-app-prod', MPD_PLUGIN_URL . 'assets/frontend.js', array(), MPD_VERSION, true);
            wp_localize_script('mpd-frontend-app-prod', 'mpdApiSettings', array(
                'root' => esc_url_raw(rest_url()),
                'nonce' => wp_create_nonce('wp_rest')
            ));

            if (file_exists(MPD_PLUGIN_DIR . 'assets/style.css')) {
                wp_enqueue_style('mpd-frontend-styles', MPD_PLUGIN_URL . 'assets/style.css', array(), MPD_VERSION);
            }
        }
    }
}

// Database creation on activation
register_activation_hook(__FILE__, 'mpd_activate_plugin');
function mpd_activate_plugin() {
    global $wpdb;
    
    $charset_collate = $wpdb->get_charset_collate();
    $table_locations = $wpdb->prefix . 'mpd_locations';
    $table_reviews = $wpdb->prefix . 'mpd_reviews';
    $table_analytics = $wpdb->prefix . 'mpd_analytics';
    $table_maps = $wpdb->prefix . 'mpd_maps';
    $table_categories = $wpdb->prefix . 'mpd_categories';

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
