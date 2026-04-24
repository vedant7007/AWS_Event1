import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBarChart2, FiLayout, FiArrowLeft } from 'react-icons/fi';
import { useGameStore } from '../utils/store';
import Button from './Button';

const Header = ({ title, showLeaderboard = true, showBackButton = false }) => {
  const navigate = useNavigate();
  const { isLoggedIn, teamId } = useGameStore();
  const isAdmin = teamId === 'ADMIN-EVENT-2026';

  return (
    <header className="bg-[#0B0F14] border-b border-[#1F2937] sticky top-0 z-[100] transition-all duration-300">
      <div className="max-w-[1200px] w-full mx-auto px-[24px] py-[16px] flex justify-between items-center h-[76px]">
        <div className="flex items-center gap-[16px]">
          {showBackButton && (
            <button 
              onClick={() => navigate(-1)}
              className="text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors p-[8px] -ml-[8px]"
            >
              <FiArrowLeft size={20} />
            </button>
          )}
          <div 
              className="flex items-center cursor-pointer group" 
              onClick={() => navigate('/')}
          >
            <div className="flex flex-col">
              <h1 className="text-[24px] font-semibold text-[#F9FAFB] tracking-tight leading-none group-hover:opacity-80 transition-opacity">
                  AWS Tycoon
              </h1>
              {title && !showBackButton && (
                  <div className="flex items-center gap-[8px] mt-[4px]">
                      <div className="h-[4px] w-[4px] rounded-full bg-[#7C3AED]"></div>
                      <p className="text-[#9CA3AF] text-[14px] font-medium tracking-wide">{title}</p>
                  </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-[24px]">
          {showLeaderboard && (
            <button 
              onClick={() => navigate('/leaderboard')}
              className="text-[#9CA3AF] hover:text-[#F9FAFB] transition-all flex items-center gap-[8px] text-[14px] font-medium"
            >
              <FiBarChart2 size={16} />
              <span>Rankings</span>
            </button>
          )}

          {isLoggedIn ? (
            <Button 
                variant="primary"
                onClick={() => navigate(isAdmin ? '/admin' : '/profile')}
            >
              <FiLayout size={16} />
              Dashboard
            </Button>
          ) : (
            <div className="flex items-center gap-[16px]">
              <Button 
                variant="ghost"
                onClick={() => navigate('/login')}
              >
                Log in
              </Button>
              
              <Button 
                variant="primary"
                onClick={() => navigate('/register')}
              >
                Sign up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
