
import React from 'react';
import { TIERS, getTierInfo } from '../tiers';
import { IconLockClosed } from './Icons';

interface TierPageProps {
    totalScore: number;
}

const TierPage: React.FC<TierPageProps> = ({ totalScore }) => {
    const currentTier = getTierInfo(totalScore);
    const currentTierIndex = TIERS.findIndex(t => t.name === currentTier.name);
    const nextTier = TIERS[currentTierIndex + 1];

    let progress = 0;
    let pointsForNext = 0;
    
    if (nextTier) {
        const pointsInCurrentTier = totalScore - currentTier.points;
        const pointsNeededForNextTier = nextTier.points - currentTier.points;
        if(pointsNeededForNextTier > 0) {
            progress = Math.min((pointsInCurrentTier / pointsNeededForNextTier) * 100, 100);
        } else {
            progress = 100;
        }
        pointsForNext = Math.max(0, nextTier.points - totalScore);
    } else {
        // User is at the highest tier
        progress = 100;
    }


    return (
        <div className="p-4">
            <div className="w-full max-w-md mx-auto space-y-4">
                 <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-white">Your Tier Progress</h1>
                    <p className="text-gray-300 mt-1">Scan more items to unlock new tiers!</p>
                </div>

                {TIERS.map((tier, index) => {
                    const isUnlocked = totalScore >= tier.points;
                    const isCurrent = tier.name === currentTier.name;
                    const cardClasses = `
                        bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 transition-all duration-300
                        ${isCurrent ? 'border-green-400 shadow-lg' : ''}
                        ${!isUnlocked ? 'opacity-60' : ''}
                    `;

                    return (
                        <div key={tier.name} className={cardClasses}>
                            <div className="flex items-center space-x-4">
                                <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center bg-white/10 ${isUnlocked ? tier.color : 'text-gray-400'}`}>
                                    {React.cloneElement(tier.icon, { className: 'w-9 h-9' })}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <h2 className={`font-bold text-lg ${isUnlocked ? 'text-white' : 'text-gray-300'}`}>{tier.name}</h2>
                                        {!isUnlocked && <IconLockClosed className="h-5 w-5 text-gray-400" />}
                                    </div>
                                    <p className="text-sm text-gray-300">{tier.points.toLocaleString()} Points</p>
                                </div>
                            </div>
                            
                            {isCurrent && nextTier && (
                                <div className="mt-4">
                                    <div className="flex justify-between text-xs font-medium text-gray-300 mb-1">
                                        <span>Progress to {nextTier.name}</span>
                                        <span>{pointsForNext.toLocaleString()} pts to go</span>
                                    </div>
                                    <div className="w-full bg-white/10 rounded-full h-2.5">
                                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TierPage;
