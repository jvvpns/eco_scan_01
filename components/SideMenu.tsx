
import React from 'react';
import { Page } from '../types';
import { IconSettings, IconUserCircle, IconDashboard, IconStar } from './Icons';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: Page) => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose, onNavigate }) => {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div className={`fixed top-0 left-0 h-full w-72 bg-gray-900/80 backdrop-blur-lg border-r border-white/20 shadow-xl z-50 transform transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
           <h2 className="text-2xl font-bold text-green-400">EcoScan</h2>
        </div>
        <nav className="mt-6">
            <MenuItem icon={<IconDashboard className="h-6 w-6" />} label="Dashboard" onClick={() => onNavigate(Page.DASHBOARD)} />
            <MenuItem icon={<IconStar className="h-6 w-6" />} label="Tiers" onClick={() => onNavigate(Page.TIER)} />
            <MenuItem icon={<IconUserCircle className="h-6 w-6" />} label="Profile" onClick={() => onNavigate(Page.PROFILE)} />
            <MenuItem icon={<IconSettings className="h-6 w-6" />} label="Settings" onClick={() => onNavigate(Page.SETTINGS)} />
        </nav>
      </div>
    </>
  );
};

interface MenuItemProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="w-full flex items-center px-6 py-4 text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
        <div className="text-gray-400">{icon}</div>
        <span className="ml-4 text-lg font-medium">{label}</span>
    </button>
);


export default SideMenu;