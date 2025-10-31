
import React from 'react';
import { IconPencil, IconKey, IconTrash, IconLogout, IconChevronRight } from './Icons';

interface SettingsPageProps {
    onLogout: () => void;
}

const SettingsItem: React.FC<{ icon: React.ReactNode, label: string, isDestructive?: boolean, onClick?: () => void }> = ({ icon, label, isDestructive = false, onClick }) => (
    <button onClick={onClick} className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors ${isDestructive ? 'hover:bg-red-500/20' : 'hover:bg-white/10'}`}>
        <div className="flex items-center">
            <div className={isDestructive ? 'text-red-400' : 'text-gray-200'}>{icon}</div>
            <span className={`ml-4 font-medium ${isDestructive ? 'text-red-400' : 'text-gray-100'}`}>{label}</span>
        </div>
        {!isDestructive && <IconChevronRight className="h-5 w-5 text-gray-400" />}
    </button>
);

const SettingsPage: React.FC<SettingsPageProps> = ({ onLogout }) => {
    return (
        <div className="p-4">
            <div className="w-full max-w-md mx-auto space-y-6">
                {/* Account Section */}
                <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-2">
                     <h2 className="text-xs font-bold uppercase text-gray-400 px-4 pt-2">Account</h2>
                     <div className="mt-2 space-y-1">
                        <SettingsItem icon={<IconPencil className="h-6 w-6" />} label="Edit Profile" />
                        <SettingsItem icon={<IconKey className="h-6 w-6" />} label="Change Password" />
                     </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-red-900/20 backdrop-blur-lg rounded-xl border border-red-500/30 p-2">
                     <h2 className="text-xs font-bold uppercase text-red-400 px-4 pt-2">Danger Zone</h2>
                     <div className="mt-2 space-y-1">
                        <SettingsItem icon={<IconTrash className="h-6 w-6" />} label="Delete Account" isDestructive />
                     </div>
                </div>
                
                {/* Logout */}
                <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-2">
                    <SettingsItem icon={<IconLogout className="h-6 w-6" />} label="Log Out" onClick={onLogout} />
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;