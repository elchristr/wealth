
import React, { useState, useEffect, useRef } from 'react';
import { MOCK_STATS, MOCK_ASSETS } from './constants';
import AssetCard from './components/AssetCard';
import { getPortfolioAdvice } from './services/geminiService';

const App: React.FC = () => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  
  // Pull to refresh states
  const [refreshing, setRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const touchStartRef = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const formatLargeNum = (val: number) => 
    val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const fetchAdvice = async () => {
    setLoadingAdvice(true);
    const result = await getPortfolioAdvice(MOCK_STATS, MOCK_ASSETS);
    setAdvice(result || "No advice available.");
    setLoadingAdvice(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate data fetch
    await new Promise(resolve => setTimeout(resolve, 1200));
    setRefreshing(false);
    setPullDistance(0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (scrollContainerRef.current?.scrollTop === 0) {
      touchStartRef.current = e.touches[0].clientY;
    } else {
      touchStartRef.current = 0;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartRef.current === 0) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartRef.current;
    
    if (diff > 0) {
      setPullDistance(Math.min(diff * 0.4, 80));
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance > 50) {
      handleRefresh();
    } else {
      setPullDistance(0);
    }
    touchStartRef.current = 0;
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col items-center">
      {/* Mobile-Style Container */}
      <div 
        ref={scrollContainerRef}
        className="w-full max-w-md min-h-screen bg-[#F8F9FB] overflow-y-auto hide-scrollbar flex flex-col relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        
        {/* Pull to Refresh Loader */}
        <div 
          className="absolute left-0 right-0 flex justify-center pointer-events-none transition-all duration-300 z-50 overflow-hidden"
          style={{ height: refreshing ? '60px' : `${pullDistance}px`, opacity: pullDistance > 10 || refreshing ? 1 : 0 }}
        >
          <div className="flex items-center justify-center pt-4">
            <div className={`w-6 h-6 rounded-full border-2 border-[#BEF264] border-t-transparent ${refreshing ? 'animate-spin' : ''}`} />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 transition-transform duration-200" style={{ transform: `translateY(${refreshing ? 60 : pullDistance}px)` }}>
          
          {/* Top Bar - Premium Banking Look */}
          <div className="px-6 pt-12 pb-6 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B0B23] flex items-center justify-center shadow-sm">
                <span className="text-[#BEF264] font-bold text-lg">C</span>
              </div>
              <div>
                <h2 className="text-[#0B0B23] font-bold text-[15px]">Hey, Christopher</h2>
                <p className="text-gray-400 text-[11px] font-medium uppercase tracking-tight">Personal Account</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm border border-gray-100 cursor-pointer active:scale-95 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0B0B23]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
          </div>

          {/* Main Balance Display */}
          <div className="px-6 mb-8">
            <div className="flex items-baseline space-x-0.5">
              <span className="text-[40px] font-bold text-[#0B0B23] tracking-tighter">
                {MOCK_STATS.currency}{Math.floor(MOCK_STATS.totalBalance).toLocaleString()}
              </span>
              <span className="text-2xl font-bold text-[#0B0B23] opacity-30">
                .{MOCK_STATS.totalBalance.toFixed(2).split('.')[1]}
              </span>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <div className="bg-green-100 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-md">
                +4.2%
              </div>
              <p className="text-gray-400 text-[11px] font-semibold">Available: {MOCK_STATS.currency}{formatLargeNum(MOCK_STATS.uninvested)}</p>
            </div>
          </div>

          {/* Action Buttons - Refined Banking Style (Smaller, Rounded-2xl) */}
          <div className="px-6 flex space-x-3 mb-8">
            <button className="flex-1 bg-[#BEF264] hover:bg-[#A9D958] text-[#0B0B23] font-bold py-3.5 rounded-2xl shadow-sm flex flex-col items-center justify-center transition-all active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-[11px] uppercase tracking-wider">Deposit</span>
            </button>
            <button className="flex-1 bg-white border border-gray-200 text-[#0B0B23] font-bold py-3.5 rounded-2xl shadow-sm flex flex-col items-center justify-center transition-all active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19V5m-7 7l7-7 7 7" />
              </svg>
              <span className="text-[11px] uppercase tracking-wider">Withdraw</span>
            </button>
            <button className="flex-1 bg-white border border-gray-200 text-[#0B0B23] font-bold py-3.5 rounded-2xl shadow-sm flex flex-col items-center justify-center transition-all active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <span className="text-[11px] uppercase tracking-wider">Transfer</span>
            </button>
          </div>

          {/* Asset List Area */}
          <div className="bg-white rounded-t-[36px] px-6 pt-8 pb-32 flex-1 shadow-[0_-12px_40px_rgba(0,0,0,0.03)] border-t border-gray-50">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[#0B0B23] font-bold text-lg">Your Assets</h3>
              <button className="text-[11px] font-bold text-gray-400 uppercase tracking-widest hover:text-[#0B0B23] transition-colors">
                View Report
              </button>
            </div>

            <div className="space-y-2">
              {MOCK_ASSETS.map(asset => (
                <AssetCard key={asset.id} asset={asset} />
              ))}
            </div>

            {/* AI Advisor - Banking Edition */}
            <div className="mt-8 bg-[#0B0B23] rounded-[28px] p-6 text-white overflow-hidden relative shadow-xl">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#BEF264]/5 rounded-full -mr-12 -mt-12 blur-2xl"></div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-[#BEF264] p-1.5 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#0B0B23]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="font-bold text-[11px] uppercase tracking-[0.15em] text-[#BEF264]">Wealth Intelligence</h4>
              </div>
              
              {advice ? (
                <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line bg-white/5 rounded-2xl p-4 border border-white/5">
                  {advice}
                  <button onClick={() => setAdvice(null)} className="mt-4 text-[#BEF264] font-bold text-[10px] uppercase tracking-widest block">Dismiss</button>
                </div>
              ) : (
                <div className="flex flex-col space-y-4">
                  <p className="text-gray-400 text-[12px] leading-snug">Review institutional-grade insights for your high-net-worth portfolio.</p>
                  <button 
                    onClick={fetchAdvice}
                    disabled={loadingAdvice}
                    className="w-full bg-[#BEF264] text-[#0B0B23] font-bold py-3 rounded-xl active:scale-95 transition-all disabled:opacity-50 text-[13px]"
                  >
                    {loadingAdvice ? "Analyzing..." : "Generate Insights"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Floating Bottom Navigation */}
        <div className="fixed bottom-8 left-0 right-0 flex justify-center z-50 px-8">
          <nav className="bg-[#0B0B23]/95 backdrop-blur-md rounded-[28px] px-8 py-4 flex justify-between items-center w-full shadow-2xl border border-white/10">
            <button className="text-[#BEF264] active:scale-90 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </button>
            <button className="text-gray-500 hover:text-white active:scale-90 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </button>
            <button className="text-gray-500 hover:text-white active:scale-90 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </button>
            <button className="text-gray-500 hover:text-white active:scale-90 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </nav>
        </div>

      </div>
    </div>
  );
};

export default App;
