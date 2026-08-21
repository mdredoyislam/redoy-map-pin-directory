=== Redoy Map Pin Directory ===
Contributors: mdmdredoyislam
Donate link: https://github.com/mdmdredoyislam
Tags: map, store locator, directory, openstreetmap, map pin
Requires at least: 5.8
Tested up to: 7.0
Stable tag: 1.0.0
Requires PHP: 8.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

A modern Location Directory, Store Locator, and Custom Map Pin Management for WordPress.

== Description ==

**Redoy Map Pin Directory** is a modern and high-performance mapping solution for WordPress. Whether you are building a store locator, a real estate map, a travel blog directory, or a community resource hub, Redoy Map Pin Directory provides a seamless experience for both you and your visitors.

Redoy Map Pin Directory features a **React-powered dashboard**. It provides a single-page application experience built right into your WordPress site—meaning no page reloads while managing your locations.

### 🌟 Why Choose Redoy Map Pin Directory?

**Redoy Map Pin Directory uses custom database tables**, ensuring your site stays fast even with many map markers. Furthermore, it uses OpenStreetMap and Leaflet.js by default, meaning **no complicated API keys are required** to get started!

### 🚀 Core Free Features

*   **Beautiful Split-View Frontend:** Provide visitors with a modern interface featuring an interactive map on one side and a scrollable results list on the other.
*   **Live AJAX Search:** Visitors can search by location name or address, and the map markers and list will update instantly—no page reloads required!
*   **React Admin Dashboard:** Manage categories, locations, maps, and settings in a single-page application inside your WP admin.
*   **No API Keys Required:** Works out of the box using OpenStreetMap tiles.
*   **Drag-and-Drop Pinning:** Visually place and adjust map markers when adding locations in the admin dashboard.
*   **Category Management:** Organize your locations by category (e.g., Restaurants, Hotels, Parks).
*   **Visual Map Builder:** Easily customize default map zoom levels and coordinates with a live preview right in the dashboard.
*   **Shortcode Ready:** Simply drop `[redoy_mpd_map]` anywhere on your site to render your custom map.
*   **Gutenberg & Elementor Compatible:** Works inside modern page builders.

### 💎 Upgrade to Pro for Ultimate Power!

Unlock the full potential of your directory with **Redoy Map Pin Directory Pro**. Perfect for agencies, growing directories, and advanced site builders.

*   **Unlimited Maps & Locations:** Create as many unique map shortcodes as you need.
*   **Custom Image Markers:** Upload custom PNG or SVG marker icons for specific categories to make your map visually unique.
*   **Advanced Filtering:** Unlock radius/distance search sliders and advanced category filtering for your users.
*   **Custom Map Themes:** Unlock dozens of premium map styles (Dark Mode, Satellite, Terrain, Minimalist, etc.).
*   **Import / Export Data:** Easily bulk import thousands of locations via CSV.
*   **White Label Ready:** Hide plugin branding for client sites (Agency License).
*   **Premium Developer Support:** Get priority assistance directly from the plugin creator.

### 📖 How to Use

1. Navigate to **Map Pin Directory -> Categories** and create your first category.
2. Go to **Locations** and click "Add New Location". Enter the details and place the pin on the map.
3. Go to **Maps**, click "Create New Map", configure your settings, and save.
4. Copy the generated shortcode (e.g., `[redoy_mpd_map id="1"]`) and paste it into any Post, Page, or Widget.

== Installation ==

1. Upload the `redoy-map-pin-directory` folder to the `/wp-content/plugins/` directory, or install directly through the WordPress plugins screen.
2. Activate the plugin through the 'Plugins' menu in WordPress.
3. Navigate to the new "Map Pin Directory" menu in your WordPress admin sidebar.
4. Click "Add New Location" to create your first map pin.
5. Place the shortcode `[redoy_mpd_map]` on any page or post to display the map!

== External services ==

This plugin uses external services to provide maps and geocoding:

* **Nominatim (OpenStreetMap)**: Used for address geocoding when searching or saving locations.
  - Usage: User addresses and search queries are sent to Nominatim to retrieve map coordinates.
  - [Terms of Use](https://operations.osmfoundation.org/policies/nominatim/)
  - [Privacy Policy](https://wiki.osmfoundation.org/wiki/Privacy_Policy)

* **CARTO Basemaps**: Used to display the map tile layers (voyager) in the frontend.
  - Usage: Your visitor's IP address may be exposed to CARTO when fetching map tiles to display the map.
  - [Terms of Service](https://carto.com/terms)
  - [Privacy Policy](https://carto.com/privacy/)

== Frequently Asked Questions ==

= Do I need a Google Maps API Key? =
No! Redoy Map Pin Directory uses OpenStreetMap and Leaflet.js by default, meaning you get high-quality maps completely free with zero API key configuration required.

= Will this slow down my site? =
Absolutely not. We prioritize performance. Map assets (CSS/JS) are loaded *only* on the pages where the map shortcode is placed. Furthermore, location data is stored in highly-optimized custom database tables, preventing `wp_posts` and `postmeta` table bloat.

= Does it work with Elementor or Divi? =
Yes! Because maps are rendered via a standard WordPress shortcode `[redoy_mpd_map]`, it is compatible with Elementor, Divi, Beaver Builder, Gutenberg, and all other major page builders.

= Is the plugin translation ready? =
Yes, the plugin is fully localized and ready to be translated into any language.

= How do I upgrade to Pro? =
You can view pricing and upgrade directly from the "Pricing" tab inside the Map Pin Directory admin dashboard.

== Screenshots ==

1. **Dashboard** - A modern React admin dashboard that doesn't feel like traditional WordPress.
2. **Map Builder** - Configure your map settings with a live preview before embedding it.
3. **Location Management** - Easily add locations with a drag-and-drop coordinate picker.
4. **Frontend Map** - The split-view interactive map that your website visitors will use.

== Changelog ==

= 1.0.0 =
* Initial Release.
* Added: Locations CRUD operations with custom database tables.
* Added: Split-View Frontend Map with OpenStreetMap.
* Added: React Admin Dashboard.
* Added: Visual Map Builder.
* Added: 'Slug' and 'Date Added' columns to the Categories list for better data management.
* Added: In-dashboard Documentation and Help guide.
* Added: Direct "Edit Profile" modal within the React dashboard for seamless user management.
* Update: Improved styling for the Reviews tab.
* Update: Pricing table responsiveness fixes.
* UI/UX Enhancements: Completely redesigned the Settings and Pricing pages.
* Fix: Addressed styling conflicts with global WordPress admin CSS.
* Optimized: React asset build size and performance.
