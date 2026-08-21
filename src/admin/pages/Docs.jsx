import React from 'react';
import { BookOpen, MapPin, Layers, Map, Code, HelpCircle, Settings as SettingsIcon } from 'lucide-react';

export default function Docs() {
  return (
    <div className="w-full pb-12 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Documentation & Help</h1>
        <p className="text-gray-600 text-lg">Learn how to configure and use Map Pin Directory on your website.</p>
      </div>

      <div className="grid gap-6">
        
        {/* Step 1 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <Layers size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">1. Create Categories</h2>
            <p className="text-gray-600 mb-4">Before adding locations, it is highly recommended to create categories (e.g., Restaurants, Hotels, Parks) so you can easily filter them on the map.</p>
            <ul className="list-disc list-inside text-sm text-gray-500 space-y-1">
              <li>Navigate to the <strong>Categories</strong> tab.</li>
              <li>Click <strong>Add Category</strong>.</li>
              <li>Give it a name and assign a color theme.</li>
            </ul>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex gap-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
            <MapPin size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">2. Add Locations</h2>
            <p className="text-gray-600 mb-4">Now, start adding the actual places you want to display on your maps.</p>
            <ul className="list-disc list-inside text-sm text-gray-500 space-y-1">
              <li>Navigate to the <strong>Locations</strong> tab.</li>
              <li>Click <strong>Add New Location</strong>.</li>
              <li>Enter the title, description, and assign it to a category.</li>
              <li>Use the map picker to pinpoint the exact Latitude and Longitude.</li>
            </ul>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex gap-4">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
            <Map size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">3. Build Your Map</h2>
            <p className="text-gray-600 mb-4">Once you have locations in your database, you can generate a custom map.</p>
            <ul className="list-disc list-inside text-sm text-gray-500 space-y-1">
              <li>Navigate to the <strong>Maps</strong> tab.</li>
              <li>Click <strong>Create New Map</strong>.</li>
              <li>Select which categories or specific locations you want this map to display.</li>
              <li>Save the map to generate a unique shortcode.</li>
            </ul>
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex gap-4">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
            <Code size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">4. Display on Frontend</h2>
            <p className="text-gray-600 mb-4">To show the map to your visitors, you need to use the generated shortcode on any WordPress Page or Post.</p>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm mb-4 inline-block">
              [redoy_mpd_map id="1"]
            </div>
            <ul className="list-disc list-inside text-sm text-gray-500 space-y-1">
              <li>Copy the shortcode from the <strong>Maps</strong> list.</li>
              <li>Paste it into the WordPress Gutenberg editor (using a Shortcode block) or Classic Editor.</li>
              <li>Publish the page!</li>
            </ul>
          </div>
        </div>

      </div>

      {/* Step 5 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex gap-4 mt-6">
        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
          <SettingsIcon size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">5. Customize Popups</h2>
          <p className="text-gray-600 mb-4">You can easily change the look and feel of your map marker popups from the settings dashboard.</p>
          <ul className="list-disc list-inside text-sm text-gray-500 space-y-1">
            <li>Navigate to the <strong>Settings</strong> tab, and click on <strong>Popup Design</strong>.</li>
            <li>Select your preferred style: <strong>Original</strong>, <strong>Clean Card (Variant A)</strong>, or <strong>Map Preview (Variant B)</strong>.</li>
            <li>Note: Premium styles are exclusively available in the <strong>Pro Version</strong>.</li>
          </ul>
        </div>
      </div>
      
      {/* Support Box */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-start gap-4 mt-8">
        <HelpCircle size={24} className="text-blue-500 shrink-0 mt-1" />
        <div>
          <h3 className="font-bold text-blue-900 mb-1">Still need help?</h3>
          <p className="text-blue-800 text-sm mb-3">If you are stuck or experiencing a bug, please reach out to our support team or check our extensive online knowledge base.</p>
          <a href="https://wordpress.org/support/plugin/redoy-map-pin-directory/" target="_blank" rel="noreferrer" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm">
            Visit Support Forum
          </a>
        </div>
      </div>

    </div>
  );
}
