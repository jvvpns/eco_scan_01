
import React from 'react';
import { IconMenu } from './Icons';

interface HeaderProps {
    onMenuClick: () => void;
    title: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, title }) => {
    return (
        <header className="fixed top-0 left-0 right-0 bg-black/20 backdrop-blur-lg border-b border-white/20 z-30 h-16 flex items-center px-4">
            <button onClick={onMenuClick} className="p-2 -ml-2">
                <IconMenu className="h-6 w-6 text-white" />
            </button>
            <h1 className="text-xl font-bold text-white ml-4">{title}</h1>
        </header>
    );
};

export default Header;