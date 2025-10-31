
import React, { useState, useCallback, useMemo } from 'react';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import ScanPage from './components/ScanPage';
import ProfilePage from './components/ProfilePage';
import SettingsPage from './components/SettingsPage';
import TierPage from './components/TierPage'; // Import TierPage
import Header from './components/Header';
import SideMenu from './components/SideMenu';
import { Page, ScannedItem } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>(Page.LOGIN);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);

  const user = {
    userId: 'eco-scan-001',
    name: 'Jesse Jot Auman',
    username: 'jessej',
    email: 'jessejot1101@gmail.com',
    image: `https://i.pravatar.cc/150?u=${encodeURIComponent('jessejot1101@gmail.com')}`,
  };

  const navigateTo = useCallback((page: Page) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
  }, []);
  
  const handleLogout = useCallback(() => {
    setScannedItems([]); // Clear state
    navigateTo(Page.LOGIN);
  }, [navigateTo]);

  const addScannedItem = useCallback((item: Omit<ScannedItem, 'id' | 'timestamp'>) => {
    setScannedItems(prevItems => [
      { 
        ...item, 
        id: `item-${Date.now()}`,
        timestamp: new Date()
      }, 
      ...prevItems
    ]);
  }, []);

  const totalScore = useMemo(() => {
    return scannedItems.reduce((total, item) => total + item.points, 0);
  }, [scannedItems]);

  const renderPage = () => {
    switch (currentPage) {
      case Page.LOGIN:
        return <LoginPage onLogin={() => navigateTo(Page.DASHBOARD)} />;
      case Page.DASHBOARD:
        return <DashboardPage scannedItems={scannedItems} totalScore={totalScore} onScanClick={() => navigateTo(Page.SCAN)} />;
      case Page.SCAN:
        return <ScanPage onScanComplete={addScannedItem} onBack={() => navigateTo(Page.DASHBOARD)} />;
      case Page.PROFILE:
        return <ProfilePage user={user} />;
      case Page.SETTINGS:
        return <SettingsPage onLogout={handleLogout} />;
      case Page.TIER: // Add case for TierPage
        return <TierPage totalScore={totalScore} />;
      default:
        return <LoginPage onLogin={() => navigateTo(Page.DASHBOARD)} />;
    }
  };

  const pageTitle = useMemo(() => {
    const titles: { [key in Page]?: string } = {
        [Page.DASHBOARD]: 'Dashboard',
        [Page.SCAN]: 'Scan Garbage',
        [Page.PROFILE]: 'Profile',
        [Page.SETTINGS]: 'Settings',
        [Page.TIER]: 'Tiers', // Add title for TierPage
    };
    return titles[currentPage] || 'EcoScan';
  }, [currentPage]);

  if (currentPage === Page.LOGIN) {
    return <LoginPage onLogin={() => navigateTo(Page.DASHBOARD)} />;
  }

  return (
    <div className="relative min-h-screen w-full font-sans flex flex-col antialiased text-white">
        <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onNavigate={navigateTo} />
        <Header onMenuClick={() => setIsMenuOpen(true)} title={pageTitle} />
        <main className="flex-1 w-full overflow-y-auto pt-16 pb-20">
            {renderPage()}
        </main>
    </div>
  );
}

export default App;