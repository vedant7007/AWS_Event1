import React from 'react';

const Header = ({ title, showLeaderboard = true }) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">☁️ Cloud-Tycoon</h1>
          {title && <p className="text-blue-100 mt-1">{title}</p>}
        </div>
        {showLeaderboard && (
          <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition">
            📊 Leaderboard
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
