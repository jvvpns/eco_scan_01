import React from 'react';
// FIX: Import icons for use in tier definitions. The path is relative to the root directory.
import { IconLeaf, IconUserCircle, IconRecycle, IconShieldCheck, IconStar } from './components/Icons';

export interface Tier {
  name: string;
  points: number;
  color: string;
  // FIX: Add icon property to the Tier interface.
  icon: React.ReactElement;
}

// FIX: Add an icon to each tier object.
// FIX: Replaced JSX syntax with React.createElement to avoid parsing errors in this .ts file.
export const TIERS: Tier[] = [
  { name: 'Newbie', points: 0, color: 'text-lime-400', icon: React.createElement(IconLeaf) },
  { name: 'Eco-Explorer', points: 100, color: 'text-orange-400', icon: React.createElement(IconUserCircle) },
  { name: 'Recycle Ranger', points: 250, color: 'text-slate-300', icon: React.createElement(IconRecycle) },
  { name: 'Green Guardian', points: 500, color: 'text-amber-400', icon: React.createElement(IconShieldCheck) },
  { name: 'Eco-Champion', points: 1000, color: 'text-yellow-300', icon: React.createElement(IconStar) },
];

export const getTierInfo = (score: number): Tier => {
  // Find the highest tier the user has achieved by checking from highest to lowest.
  return TIERS.slice().reverse().find(tier => score >= tier.points) || TIERS[0];
};
