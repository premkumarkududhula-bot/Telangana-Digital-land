
import React, { useState, useEffect, useCallback } from 'react';
import { AppState, LandSlot, Transaction, AdminProfile } from './types';
import { INITIAL_SLOT_PRICE, ADMIN_NAME, DISTRICTS, ADMIN_MOBILE, ADMIN_ACCOUNT, ADMIN_IFSC } from './constants';
import { SlotCard } from './components/SlotCard';
import { PurchaseModal } from './components/PurchaseModal';
import { AdminController } from './components/AdminController';
import { TermsModal } from './components/TermsModal';
import { HowToBuyModal } from './components/HowToBuyModal';
import { HelpModal } from './components/HelpModal';

// SheetDB Configuration
const getEnv = (key: string): string | undefined => {
  // In Vite, environment variables are on import.meta.env
  // We check both the direct key and the VITE_ prefixed version
  const env = (import.meta as any).env || {};
  const value = env[key] || env[`VITE_${key}`] || (window as any)._env_?.[key] || (window as any)._env_?.[`VITE_${key}`];
  return value;
};

const SHEETDB_ID = getEnv('SHEETDB_URL') || getEnv('VITE_SHEETDB_URL');
const SHEETDB_API_KEY = getEnv('SHEETDB_API_KEY') || getEnv('VITE_SHEETDB_API_KEY');

const SHEETDB_URL = SHEETDB_ID?.startsWith('http') ? SHEETDB_ID : `https://sheetdb.io/api/v1/${SHEETDB_ID}`;
// const STORAGE_KEY = 'telangana_digital_land_v16_sheetdb';

console.log("SheetDB: Config initialized", { 
  hasId: !!SHEETDB_ID, 
  hasKey: !!SHEETDB_API_KEY,
  url: SHEETDB_URL 
});

// Helper for Headers (With Auth)
const getAuthHeaders = (extraHeaders: Record<string, string> = {}) => {
  const headers: Record<string, string> = { ...extraHeaders };
  
  const key = SHEETDB_API_KEY?.trim();
  if (key && key !== 'undefined' && key.length > 0) {
    // User specifically requested Authorization: Bearer format
    headers['Authorization'] = `Bearer ${key}`;
    
    // Also keeping X-Api-Key as it's often more reliable with SheetDB
    headers['X-Api-Key'] = key;
  }
  return headers;
};

const generateInitialSlots = (admin?: AdminProfile): LandSlot[] => {
  return DISTRICTS.map((name, i) => ({
    id: i + 1,
    districtName: name,
    currentPrice: INITIAL_SLOT_PRICE,
    ownerName: admin?.name || ADMIN_NAME,
    mobileNumber: admin?.mobile || ADMIN_MOBILE,
    upiId: `${admin?.mobile || ADMIN_MOBILE}-3@ybl`,
    history: []
  }));
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    slots: generateInitialSlots(),
    transactions: [],
    totalAdminRevenue: 0,
    adminProfile: {
      name: ADMIN_NAME,
      mobile: ADMIN_MOBILE,
      account: ADMIN_ACCOUNT,
      ifsc: ADMIN_IFSC
    }
  });

  const [selectedSlot, setSelectedSlot] = useState<LandSlot | null>(null);
  const [currentParentId, setCurrentParentId] = useState<number | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isHowToBuyOpen, setIsHowToBuyOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [hasInitialSync, setHasInitialSync] = useState(false);

  // 1. Fetch Remote Data - Sync Slots Price/Owner
  const fetchRemoteData = useCallback(async () => {
    if (!SHEETDB_ID) {
      console.warn("SheetDB: VITE_SHEETDB_URL is missing. Sync disabled.");
      setIsSyncing(false);
      setSyncStatus('error');
      return;
    }

    setIsSyncing(true);
    const syncUrl = `${SHEETDB_URL}${SHEETDB_URL.includes('?') ? '&' : '?'}t=${Date.now()}`;
    console.log("SheetDB: Syncing from", syncUrl);
    
    try {
      const response = await fetch(syncUrl, { 
        headers: getAuthHeaders() 
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`SheetDB: Fetch failed (${response.status}):`, errorText);
        setSyncStatus('error');
        return;
      }

      const rows = await response.json();
      console.log("SheetDB: Received rows:", rows.length);

      if (Array.isArray(rows)) {
        // Optimization: Create a lookup map for the latest data per district/sub-plot
        const latestDataMap = new Map<string, any>();
        rows.forEach((row: any) => {
          const rowName = (row.Name || row.name || row.NAME || '').toString();
          const namePart = rowName.split(' - ')[0];
          latestDataMap.set(namePart, row);
        });

        setState(prevState => {
          // We need to handle sub-plots that might be in the sheet but not in initial state
          let currentSlots = [...prevState.slots];
          const existingSlotsMap = new Map(currentSlots.map(s => [s.districtName, s]));
          
          // First, update existing slots
          currentSlots = currentSlots.map(slot => {
            const latestRow = latestDataMap.get(slot.districtName);
            
            if (latestRow) {
              const rowName = (latestRow.Name || latestRow.name || latestRow.NAME || '').toString();
              
              let actualOwnerName = slot.ownerName;
              let remotePrice = slot.currentPrice;

              if (rowName.includes(' - ')) {
                const parts = rowName.split(' - ');
                actualOwnerName = parts[1] || actualOwnerName;
                const pricePart = parts[2] || '';
                const parsedPrice = parseInt(pricePart.replace(/[^\d]/g, ''), 10);
                if (!isNaN(parsedPrice)) remotePrice = parsedPrice;
              }

              const mobile = latestRow.Mobile || latestRow.mobile || latestRow.MOBILE || 
                             latestRow['Mobile Number'] || latestRow.Phone || latestRow.phone;
              
              const upi = latestRow['Upi id'] || latestRow['UPI ID'] || latestRow.UPI || 
                          latestRow.upi || latestRow.UPI_ID || latestRow.upi_id || 
                          latestRow.UPIId || latestRow.upiId;
              
              const updatedSlot = {
                ...slot,
                ownerName: actualOwnerName,
                currentPrice: remotePrice,
                mobileNumber: mobile || slot.mobileNumber,
                upiId: upi || slot.upiId,
                isExpanded: remotePrice >= 128000
              };
              existingSlotsMap.set(slot.districtName, updatedSlot);
              return updatedSlot;
            }
            return slot;
          });

          // Second, discover sub-plots from the sheet that aren't in state
          // Sort by length to ensure parents are processed before children
          const sortedNames = Array.from(latestDataMap.keys()).sort((a, b) => a.length - b.length);

          sortedNames.forEach(name => {
            const row = latestDataMap.get(name);
            if (name.includes(' #')) {
              if (!existingSlotsMap.has(name)) {
                const parentName = name.substring(0, name.lastIndexOf(' #'));
                const parent = existingSlotsMap.get(parentName);
                
                if (parent) {
                  const rowName = (row.Name || row.name || row.NAME || '').toString();
                  const parts = rowName.split(' - ');
                  const pricePart = parts[2] || '';
                  const remotePrice = parseInt(pricePart.replace(/[^\d]/g, ''), 10) || 16000;
                  
                  const mobile = row.Mobile || row.mobile || row.MOBILE || 
                                 row['Mobile Number'] || row.Phone || row.phone;
                  
                  const upi = row['Upi id'] || row['UPI ID'] || row.UPI || 
                              row.upi || row.UPI_ID || row.upi_id || 
                              row.UPIId || row.upiId;

                  const newSlot = {
                    id: Math.random() * 1000000, // Temporary ID
                    parentId: parent.id,
                    districtName: name,
                    currentPrice: remotePrice,
                    ownerName: parts[1] || parent.ownerName,
                    mobileNumber: mobile || parent.mobileNumber,
                    upiId: upi || parent.upiId,
                    history: [],
                    isExpanded: remotePrice >= 128000
                  };
                  currentSlots.push(newSlot);
                  existingSlotsMap.set(name, newSlot);
                }
              }
            }
          });
          
          return { ...prevState, slots: currentSlots };
        });

        console.log("SheetDB: Sync complete. Optimized lookup used.");
        setSyncStatus('success');
        setHasInitialSync(true);
      }
    } catch (error) {
      console.error("SheetDB: Critical sync error:", error);
      setSyncStatus('error');
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    fetchRemoteData();
  }, []);

  // 2. Save Logic - POST new row with combined Name (including Price)
  const handleUpdateState = useCallback(async (updatedState: AppState) => {
    const prevState = state;
    setState(updatedState);

    // Determine which slot to save
    let slotToSave: LandSlot | undefined;

    const lastTx = updatedState.transactions[updatedState.transactions.length - 1];
    const prevLastTx = prevState.transactions[prevState.transactions.length - 1];

    if (lastTx && (!prevLastTx || lastTx.id !== prevLastTx.id)) {
      // New transaction case
      slotToSave = updatedState.slots.find(s => s.id === lastTx.slotId);
    } else {
      // Check for manual slot update (Admin)
      updatedState.slots.forEach((slot, idx) => {
        const prevSlot = prevState.slots.find(ps => ps.id === slot.id);
        if (prevSlot && (
          slot.ownerName !== prevSlot.ownerName || 
          slot.mobileNumber !== prevSlot.mobileNumber || 
          slot.upiId !== prevSlot.upiId ||
          slot.currentPrice !== prevSlot.currentPrice
        )) {
          slotToSave = slot;
        }
      });
    }

    if (slotToSave) {
      const slot = slotToSave;
      const combinedName = `${slot.districtName} - ${slot.ownerName} - ₹${slot.currentPrice}`;
      
      try {
        console.log("SheetDB: Saving update for", slot.districtName, { upi: slot.upiId });
        const response = await fetch(SHEETDB_URL, {
          method: 'POST',
          headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
          body: JSON.stringify({ 
            data: [{
              Name: combinedName,
              Mobile: slot.mobileNumber,
              'Upi id': slot.upiId,
              'UPI ID': slot.upiId,
              'UPI': slot.upiId,
              'upi': slot.upiId,
              'UPI_ID': slot.upiId,
              'upi_id': slot.upiId,
              'UPIId': slot.upiId,
              'upiId': slot.upiId
            }]
          })
        });

        if (response.ok) {
          console.log("SheetDB: Save successful");
        } else {
          const errorText = await response.text();
          console.error(`SheetDB: Save failed (${response.status}):`, errorText);
        }
      } catch (e) {
        console.error("SheetDB: Critical save error:", e);
      }
    }
  }, [state]);

  const handleSlotClick = (slot: LandSlot) => {
    // Expansion Logic: If price >= 128,000, expand it
    if (slot.currentPrice >= 128000) {
      // Ensure all 10 sub-plots exist in state
      const subPlotsToGenerate: LandSlot[] = [];
      for (let i = 1; i <= 10; i++) {
        const subName = `${slot.districtName} #${i}`;
        if (!state.slots.find(s => s.districtName === subName)) {
          subPlotsToGenerate.push({
            id: Math.random() * 1000000 + i,
            parentId: slot.id,
            districtName: subName,
            currentPrice: 16000,
            ownerName: slot.ownerName,
            mobileNumber: slot.mobileNumber,
            upiId: slot.upiId,
            history: []
          });
        }
      }
      
      if (subPlotsToGenerate.length > 0) {
        const updatedSlots = state.slots.map(s => 
          s.id === slot.id ? { ...s, isExpanded: true } : s
        );

        setState(prev => ({
          ...prev,
          slots: [...updatedSlots, ...subPlotsToGenerate]
        }));

        // Save sub-plots to SheetDB in bulk
        const dataToSave = subPlotsToGenerate.map(s => ({
          Name: `${s.districtName} - ${s.ownerName} - ₹${s.currentPrice}`,
          Mobile: s.mobileNumber,
          'Upi id': s.upiId,
          'UPI ID': s.upiId,
          'UPI': s.upiId,
          'upi': s.upiId,
          'UPI_ID': s.upiId,
          'upi_id': s.upiId,
          'UPIId': s.upiId,
          'upiId': s.upiId
        }));

        fetch(SHEETDB_URL, {
          method: 'POST',
          headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
          body: JSON.stringify({ data: dataToSave })
        })
        .then(res => res.json())
        .then(data => console.log("SheetDB: Bulk sub-plot save success", data))
        .catch(err => console.error("SheetDB: Bulk sub-plot save error", err));
      } else if (!slot.isExpanded) {
        const updatedSlots = state.slots.map(s => 
          s.id === slot.id ? { ...s, isExpanded: true } : s
        );
        setState(prev => ({ ...prev, slots: updatedSlots }));
      }
      
      setCurrentParentId(slot.id);
    } else {
      // Otherwise, open purchase modal
      setSelectedSlot(slot);
    }
  };

  const handleBack = () => {
    if (currentParentId) {
      const parentSlot = state.slots.find(s => s.id === currentParentId);
      setCurrentParentId(parentSlot?.parentId || null);
    }
  };

  const visibleSlots = state.slots.filter(s => s.parentId === (currentParentId || undefined));
  const currentParent = currentParentId ? state.slots.find(s => s.id === currentParentId) : null;

  const totalValue = state.slots.reduce((acc, s) => s.isExpanded ? acc : acc + s.currentPrice, 0);

  return (
    <div className="min-h-screen pb-12 bg-[#070b14] land-grid-pattern overflow-x-hidden flex flex-col">
      {(!hasInitialSync) && (
        <div className="fixed inset-0 z-[100] bg-[#070b14] flex flex-col items-center justify-center p-6 text-center">
          {syncStatus === 'error' && !isSyncing ? (
            <div className="space-y-6 animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto border border-red-500/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Connection Failed</h2>
                <p className="text-slate-400 text-xs font-medium max-w-xs mx-auto">We couldn't reach the Digital Land Registry. Please check your internet or API configuration.</p>
              </div>
              <button 
                onClick={() => window.location.reload()}
                className="px-8 py-4 bg-white text-black font-black uppercase text-[10px] tracking-[0.3em] rounded-2xl hover:bg-emerald-500 transition-all"
              >
                Retry Connection
              </button>
            </div>
          ) : (
            <div className="space-y-6 flex flex-col items-center">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-emerald-500/20 rounded-full" />
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0" />
              </div>
              <div className="space-y-2">
                <p className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.5em] animate-pulse">Establishing Secure Link...</p>
                <p className="text-slate-500 text-[8px] uppercase tracking-widest">Fetching Ledger from Google Sheets</p>
              </div>
            </div>
          )}
        </div>
      )}

      <header className="sticky top-0 z-40 glass-morphism px-4 sm:px-6 py-4 flex justify-between items-center border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center font-black text-slate-900 shadow-lg shadow-emerald-500/20">
            TS
          </div>
          <div className="flex flex-col">
            <h1 className="text-base font-black text-white uppercase tracking-tight leading-none flex items-center gap-2">
              Digital Land Registry
              <div className={`w-1.5 h-1.5 rounded-full ${syncStatus === 'success' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : syncStatus === 'error' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-slate-500 animate-pulse'}`} />
            </h1>
            <span className="text-[8px] text-emerald-500 font-bold uppercase tracking-widest mt-1">Full Ledger Tracking</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsHowToBuyOpen(true)}
            className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-500 font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500/20 transition-all"
          >
            How to Buy?
          </button>
          <div className="text-right">
            <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Market Cap</p>
            <p className="text-sm font-black text-white">₹{totalValue.toLocaleString()}</p>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 pt-8 sm:pt-12 flex-1 w-full">
        {currentParent && (
          <div className="mb-8 flex items-center gap-4">
            <button 
              onClick={handleBack}
              className="p-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <div>
              <p className="text-[8px] text-emerald-500 font-black uppercase tracking-widest">Sub-Plots of</p>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">{currentParent.districtName}</h2>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 mb-20">
          {[...visibleSlots]
            .sort((a, b) => b.currentPrice - a.currentPrice)
            .map(slot => (
              <SlotCard key={slot.id} slot={slot} onClick={handleSlotClick} />
            ))}
        </div>

        {/* Home page footer links */}
        <div className="w-full flex flex-col items-center justify-center py-10 space-y-4 opacity-40 hover:opacity-100 transition-opacity">
          <button 
            onClick={() => setIsHowToBuyOpen(true)}
            className="text-[10px] sm:text-[12px] text-emerald-500 font-black uppercase tracking-[0.4em] border-b border-emerald-900/30 pb-1 hover:text-emerald-400 transition-colors"
          >
            How to Buy?
          </button>
          <button 
            onClick={() => setIsTermsOpen(true)}
            className="text-[8px] sm:text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] border-b border-slate-800 pb-1 hover:text-slate-400 transition-colors"
          >
            Terms & Conditions
          </button>
          <button 
            onClick={() => setIsHelpOpen(true)}
            className="text-[8px] sm:text-[10px] text-emerald-500/60 font-black uppercase tracking-[0.4em] border-b border-emerald-900/20 pb-1 hover:text-emerald-400 transition-colors"
          >
            Help & Info
          </button>
        </div>
      </main>

      {selectedSlot && (
        <PurchaseModal 
          isOpen={!!selectedSlot} 
          slot={state.slots.find(s => s.id === selectedSlot.id) || selectedSlot} 
          currentState={state}
          onClose={() => setSelectedSlot(null)} 
          onConfirm={handleUpdateState} 
        />
      )}

      <AdminController isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} state={state} onUpdateState={handleUpdateState} />
      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <HowToBuyModal isOpen={isHowToBuyOpen} onClose={() => setIsHowToBuyOpen(false)} />
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
};

export default App;
