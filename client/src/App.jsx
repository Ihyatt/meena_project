// frontend/src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import your page components
import CheckoutPage from './pages/CheckoutPage';
import ReturnPage from './pages/ReturnPage';
// import HomePage from './pages/HomePage'; // Example if you have a home page

const App = () => {
  return (
    <div className="App">
      <Routes>
        {/* <Route path="/" element={<HomePage />} /> */}
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/return" element={<ReturnPage />} />
        {/* Add more routes for your other application pages */}
      </Routes>
    </div>
  );
};

export default App;