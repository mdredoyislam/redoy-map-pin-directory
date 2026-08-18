import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom';
import './index.css';

// Components & Pages
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './pages/Dashboard';
import LocationsList from './pages/LocationsList';
import LocationEditor from './pages/LocationEditor';
import MapsList from './pages/MapsList';
import MapBuilder from './pages/MapBuilder';
import ReviewsList from './pages/ReviewsList';
import CategoriesList from './pages/CategoriesList';
import Settings from './pages/Settings';
import Pricing from './pages/Pricing';
import Docs from './pages/Docs';

import { Toaster } from 'react-hot-toast';

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('mpd-admin-app'));
root.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="locations" element={<LocationsList />} />
          <Route path="locations/new" element={<LocationEditor />} />
          <Route path="locations/:id" element={<LocationEditor />} />
          <Route path="categories" element={<CategoriesList />} />
          <Route path="maps" element={<MapsList />} />
          <Route path="maps/new" element={<MapBuilder />} />
          <Route path="maps/:id" element={<MapBuilder />} />
          <Route path="reviews" element={<ReviewsList />} />
          <Route path="settings" element={<Settings />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="docs" element={<Docs />} />
          {/* Placeholders for future pages */}
          <Route path="*" element={<div className="text-gray-500">Page under construction</div>} />
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
