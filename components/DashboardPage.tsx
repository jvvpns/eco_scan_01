
import React from 'react';
import { ScannedItem, GarbageType } from '../types';
import { IconCamera, IconLeaf, IconTrash, IconBottle } from './Icons';
import { getTierInfo } from '../tiers';

interface DashboardPageProps {
  scannedItems: ScannedItem[];
  totalScore: number;
  onScanClick: () => void;
}

// FIX: Changed JSX.Element to React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
const GarbageTypeConfig: Record<GarbageType, { color: string, icon: React.ReactElement, label: string }> = {
    [GarbageType.BIODEGRADABLE]: { color: '#27ae60', icon: <IconLeaf className="h-5 w-5" />, label: 'Biodegradable' },
    [GarbageType.NON_BIODEGRADABLE]: { color: '#2980b9', icon: <IconBottle className="h-5 w-5" />, label: 'Non-Biodegradable' },
    [GarbageType.SPECIAL]: { color: '#ff5733', icon: <IconTrash className="h-5 w-5" />, label: 'Special' },
    [GarbageType.RESIDUAL]: { color: '#7f8c8d', icon: <IconTrash className="h-5 w-5" />, label: 'Residual' }, 
};

const ScannedItemCard: React.FC<{ item: ScannedItem }> = ({ item }) => {
    const config = GarbageTypeConfig[item.type];
    return (
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-md overflow-hidden flex items-center space-x-4 p-3 transition-transform transform hover:scale-105 hover:shadow-lg">
            <img className="h-20 w-20 object-cover rounded-lg" src={item.image} alt={item.name} />
            <div className="flex-1">
                <p className="font-bold text-white text-lg">{item.name}</p>
                <div className="flex items-center text-sm mt-1" style={{ color: config.color }}>
                    {React.cloneElement(config.icon, { className: "h-5 w-5"})}
                    <span className="ml-2 font-medium text-gray-200">{config.label}</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">{item.timestamp.toLocaleTimeString()}</p>
            </div>
            <div className="text-right">
                <p className="text-2xl font-bold text-green-400">+{item.points}</p>
                <p className="text-xs text-gray-400">points</p>
            </div>
        </div>
    );
};

const DashboardPage: React.FC<DashboardPageProps> = ({ scannedItems, totalScore, onScanClick }) => {
    const { name: tierName, color: tierColor } = getTierInfo(totalScore);

    return (
        <div className="p-4 space-y-6 pb-24">
            <div className="bg-green-500/30 backdrop-blur-lg text-white rounded-2xl p-6 shadow-lg text-center border border-green-400/50">
                <p className="text-sm font-medium opacity-80">Total Points</p>
                <p className="text-5xl font-bold tracking-tight">{totalScore}</p>
                <div className={`mt-4 flex items-center justify-center space-x-2 ${tierColor}`}>
                    <span className="font-bold text-lg">{tierName}</span>
                </div>
            </div>
            
            <div>
                <h2 className="text-xl font-bold text-white mb-3">History</h2>
                {scannedItems.length > 0 ? (
                    <div className="space-y-4">
                        {scannedItems.map(item => <ScannedItemCard key={item.id} item={item} />)}
                    </div>
                ) : (
                    <div className="text-center py-10 px-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-md">
                        <IconTrash className="h-12 w-12 mx-auto text-gray-400" />
                        <h3 className="mt-2 text-lg font-medium text-white">No Scans Yet</h3>
                        <p className="mt-1 text-sm text-gray-300">Click the scan button to get started!</p>
                    </div>
                )}
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent z-10">
                 <button
                    onClick={onScanClick}
                    className="w-full flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-4 rounded-2xl transition-transform transform hover:scale-105 shadow-xl"
                    >
                    <IconCamera className="h-6 w-6 mr-2" />
                    Scan New Garbage
                </button>
            </div>
        </div>
    );
};

export default DashboardPage;