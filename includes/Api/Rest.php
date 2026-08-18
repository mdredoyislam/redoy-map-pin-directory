<?php
namespace MPD\Api;

if (!defined('ABSPATH')) {
    exit;
}

class Rest {
    public function __construct() {
        add_action('rest_api_init', [$this, 'register_routes']);
    }

    public function admin_permissions_check() {
        return current_user_can('manage_options');
    }

    public function register_routes() {
        $namespace = 'mpd/v1';

        // Get locations
        register_rest_route($namespace, '/locations', [
            'methods'  => 'GET',
            'callback' => [$this, 'get_locations'],
            'permission_callback' => '__return_true', // Public for frontend map
        ]);

        // Settings
        register_rest_route($namespace, '/settings', [
            'methods'  => 'GET',
            'callback' => [$this, 'get_settings'],
            'permission_callback' => '__return_true', // Public for frontend map
        ]);
        register_rest_route($namespace, '/settings', [
            'methods'  => 'POST',
            'callback' => [$this, 'update_settings'],
            'permission_callback' => [$this, 'admin_permissions_check'],
        ]);

        // Create location
        register_rest_route($namespace, '/locations', [
            'methods'  => 'POST',
            'callback' => [$this, 'create_location'],
            'permission_callback' => [$this, 'admin_permissions_check'],
        ]);

        // Delete location
        register_rest_route($namespace, '/locations/(?P<id>\d+)', [
            'methods'  => 'DELETE',
            'callback' => [$this, 'delete_location'],
            'permission_callback' => [$this, 'admin_permissions_check'],
        ]);

        // --- Maps ---
        register_rest_route($namespace, '/maps', [
            'methods'  => 'GET',
            'callback' => [$this, 'get_maps'],
            'permission_callback' => '__return_true',
        ]);
        register_rest_route($namespace, '/maps', [
            'methods'  => 'POST',
            'callback' => [$this, 'create_map'],
            'permission_callback' => [$this, 'admin_permissions_check'],
        ]);
        register_rest_route($namespace, '/maps/(?P<id>\d+)', [
            'methods'  => 'DELETE',
            'callback' => [$this, 'delete_map'],
            'permission_callback' => [$this, 'admin_permissions_check'],
        ]);

        // --- Categories ---
        register_rest_route($namespace, '/categories', [
            'methods'  => 'GET',
            'callback' => [$this, 'get_categories'],
            'permission_callback' => '__return_true',
        ]);
        register_rest_route($namespace, '/categories', [
            'methods'  => 'POST',
            'callback' => [$this, 'create_category'],
            'permission_callback' => [$this, 'admin_permissions_check'],
        ]);
        register_rest_route($namespace, '/categories/(?P<id>\d+)', [
            'methods'  => 'DELETE',
            'callback' => [$this, 'delete_category'],
            'permission_callback' => [$this, 'admin_permissions_check'],
        ]);

        // --- Temp Setup ---
        register_rest_route($namespace, '/setup-db', [
            'methods'  => 'GET',
            'callback' => [$this, 'setup_db'],
            'permission_callback' => [$this, 'admin_permissions_check'],
        ]);

        // Get analytics
        register_rest_route($namespace, '/analytics', [
            'methods'  => 'POST',
            'callback' => [$this, 'track_analytics'],
            'permission_callback' => '__return_true',
        ]);
    }

    public function get_locations($request) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'mpd_locations';
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, PluginCheck.Security.DirectDB.UnescapedDBParameter
        $locations = $wpdb->get_results("SELECT * FROM $table_name ORDER BY created_at DESC");
        return rest_ensure_response($locations);
    }

    public function create_location($request) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'mpd_locations';
        $params = $request->get_json_params();

        $data = [
            'title' => sanitize_text_field($params['title'] ?? ''),
            'slug' => sanitize_title($params['title'] ?? ''),
            'description' => sanitize_textarea_field($params['description'] ?? ''),
            'lat' => floatval($params['lat'] ?? 0),
            'lng' => floatval($params['lng'] ?? 0),
            'address' => sanitize_text_field($params['address'] ?? ''),
            'category' => sanitize_text_field($params['category'] ?? ''),
            'status' => sanitize_text_field($params['status'] ?? 'active'),
            'created_at' => current_time('mysql')
        ];

        if (!empty($params['id'])) {
            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
            $result = $wpdb->update($table_name, $data, ['id' => intval($params['id'])]);
            $message = 'Location updated';
        } else {
            // Check limit before creating new
            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, PluginCheck.Security.DirectDB.UnescapedDBParameter
            $count = $wpdb->get_var("SELECT COUNT(*) FROM $table_name");
            if ($count >= 5) {
                return new \WP_Error('limit_reached', 'You are using 5 available Locations in the Free version.', ['status' => 403]);
            }
            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
            $result = $wpdb->insert($table_name, $data);
            $message = 'Location created';
        }

        if ($result === false) {
            return new \WP_Error('db_insert_error', 'Could not save location', ['status' => 500]);
        }

        return rest_ensure_response(['id' => !empty($params['id']) ? intval($params['id']) : $wpdb->insert_id, 'message' => $message]);
    }

    public function delete_location($request) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'mpd_locations';
        $id = intval($request['id']);

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
        $result = $wpdb->delete($table_name, ['id' => $id], ['%d']);

        if ($result === false) {
            return new \WP_Error('db_delete_error', 'Could not delete location', ['status' => 500]);
        }

        return rest_ensure_response(['status' => 'success', 'message' => 'Location deleted']);
    }

    // --- Maps CRUD ---
    public function get_maps($request) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'mpd_maps';
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, PluginCheck.Security.DirectDB.UnescapedDBParameter
        $maps = $wpdb->get_results("SELECT * FROM $table_name ORDER BY created_at DESC");
        return rest_ensure_response($maps);
    }

    public function create_map($request) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'mpd_maps';
        $params = $request->get_json_params();

        $data = [
            'title' => sanitize_text_field($params['title'] ?? 'New Map'),
            'settings' => wp_json_encode($params['settings'] ?? []),
            'created_at' => current_time('mysql')
        ];

        // Check if updating
        if (!empty($params['id'])) {
            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
            $result = $wpdb->update($table_name, $data, ['id' => intval($params['id'])]);
        } else {
            // Check limit before creating new
            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, PluginCheck.Security.DirectDB.UnescapedDBParameter
            $count = $wpdb->get_var("SELECT COUNT(*) FROM $table_name");
            if ($count >= 5) {
                return new \WP_Error('limit_reached', 'You are using 5 available Maps in the Free version.', ['status' => 403]);
            }
            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
            $result = $wpdb->insert($table_name, $data);
        }

        if ($result === false) {
            return new \WP_Error('db_error', 'Could not save map', ['status' => 500]);
        }

        return rest_ensure_response(['status' => 'success', 'message' => 'Map saved']);
    }

    public function delete_map($request) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'mpd_maps';
        $id = intval($request['id']);
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
        $result = $wpdb->delete($table_name, ['id' => $id], ['%d']);
        if ($result === false) {
            return new \WP_Error('db_delete_error', 'Could not delete map', ['status' => 500]);
        }
        return rest_ensure_response(['status' => 'success']);
    }

    // --- Categories CRUD ---
    public function get_categories($request) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'mpd_categories';
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, PluginCheck.Security.DirectDB.UnescapedDBParameter
        $categories = $wpdb->get_results("SELECT * FROM $table_name ORDER BY created_at DESC");
        return rest_ensure_response($categories);
    }

    public function create_category($request) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'mpd_categories';
        $params = $request->get_json_params();

        $data = [
            'name' => sanitize_text_field($params['name'] ?? ''),
            'slug' => sanitize_title($params['name'] ?? ''),
            'color' => sanitize_text_field($params['color'] ?? 'bg-gray-100 text-gray-700'),
            'icon' => sanitize_text_field($params['icon'] ?? 'Layers'),
            'created_at' => current_time('mysql')
        ];

        if (!empty($params['id'])) {
            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
            $result = $wpdb->update($table_name, $data, ['id' => intval($params['id'])]);
        } else {
            // Check limit before creating new
            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, PluginCheck.Security.DirectDB.UnescapedDBParameter
            $count = $wpdb->get_var("SELECT COUNT(*) FROM $table_name");
            if ($count >= 3) {
                return new \WP_Error('limit_reached', 'Category limit (3) reached in the Free version.', ['status' => 403]);
            }
            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
            $result = $wpdb->insert($table_name, $data);
        }

        if ($result === false) {
            return new \WP_Error('db_error', 'Could not save category', ['status' => 500]);
        }
        return rest_ensure_response(['status' => 'success', 'message' => 'Category saved']);
    }

    public function delete_category($request) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'mpd_categories';
        $id = intval($request['id']);
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
        $result = $wpdb->delete($table_name, ['id' => $id], ['%d']);
        if ($result === false) {
            return new \WP_Error('db_delete_error', 'Could not delete category', ['status' => 500]);
        }
        return rest_ensure_response(['status' => 'success']);
    }

    public function setup_db($request) {
        require_once(MPD_PLUGIN_DIR . 'mri-map-pin-directory.php');
        mpd_activate_plugin();
        return rest_ensure_response(['status' => 'success', 'message' => 'Database tables created!']);
    }

    public function track_analytics($request) {
        return rest_ensure_response(['status' => 'success']);
    }

    public function get_settings($request) {
        $settings = get_option('mpd_settings', [
            'defaultCountry' => 'us',
            'defaultPinStyle' => 'standard-red',
            'popupStyle' => 'original'
        ]);
        
        // Migrate old invalid data if it was saved by mistake
        if ($settings['defaultCountry'] === 'United States') $settings['defaultCountry'] = 'us';
        if ($settings['defaultPinStyle'] === 'Standard Red Marker') $settings['defaultPinStyle'] = 'standard-red';
        
        return rest_ensure_response($settings);
    }

    public function update_settings($request) {
        $params = $request->get_json_params();
        $settings = [
            'defaultCountry' => sanitize_text_field($params['defaultCountry'] ?? 'us'),
            'defaultPinStyle' => sanitize_text_field($params['defaultPinStyle'] ?? 'standard-red'),
            'popupStyle' => sanitize_text_field($params['popupStyle'] ?? 'original'),
        ];
        update_option('mpd_settings', $settings);
        return rest_ensure_response(['status' => 'success', 'message' => 'Settings saved successfully']);
    }
}

new Rest();
