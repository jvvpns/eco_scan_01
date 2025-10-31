
import React from 'react';

interface User {
    userId: string;
    name: string;
    username: string;
    email: string;
    image: string;
}

interface ProfilePageProps {
    user: User;
}

const ProfileInfoRow: React.FC<{ label: string, value: string, isMono?: boolean }> = ({ label, value, isMono = false }) => (
    <div className="flex justify-between items-center py-3">
        <span className="text-sm font-medium text-gray-300">{label}</span>
        <span className={`text-sm text-white ${isMono ? 'font-mono' : ''}`}>{value}</span>
    </div>
);


const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
    return (
        <div className="p-6 pt-16 flex flex-col items-center">
            <div className="bg-white/10 backdrop-blur-lg w-full max-w-md rounded-2xl shadow-lg p-8 relative border border-white/20">
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                     <img
                        className="w-24 h-24 rounded-full mx-auto border-4 border-white/30 shadow-md"
                        src={user.image}
                        alt="User profile avatar"
                    />
                </div>
                <div className="mt-10 text-center">
                    <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                    <p className="text-gray-300 mt-1">@{user.username}</p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/20">
                    <div className="divide-y divide-white/20">
                        <ProfileInfoRow label="User ID" value={user.userId} isMono />
                        <ProfileInfoRow label="Email" value={user.email} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;