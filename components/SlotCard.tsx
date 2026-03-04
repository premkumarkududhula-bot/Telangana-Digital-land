
import React from 'react';
import { LandSlot } from '../types';
import { ADMIN_NAME } from '../constants';

interface SlotCardProps {
  slot: LandSlot;
  onClick: (slot: LandSlot) => void;
}

export const SlotCard: React.FC<SlotCardProps> = ({ slot, onClick }) => {
  const isOwnedByUser = slot.ownerName !== ADMIN_NAME;
  const displayName = slot.ownerName;

  return (
    <div 
      onClick={() => onClick(slot)}
      className="group relative overflow-hidden rounded-[2rem] bg-[#0f172a] border border-white/10 transition-all duration-500 cursor-pointer hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-500/40 flex flex-col h-[350px] sm:h-[450px]"
    >
      {/* Top half: Name Display Area */}
      <div className="relative h-2/5 w-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#1e293b] to-[#070b14] border-b border-white/5">
        {isOwnedByUser ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
            <div className="absolute top-0 left-0 w-full h-full opacity-5 land-grid-pattern pointer-events-none" />
            
            {/* ELEGANT MEDIUM NAME SIZE */}
            <h4 className="text-base sm:text-lg font-black text-emerald-400 tracking-tight uppercase leading-snug break-words max-w-full drop-shadow-[0_0_10px_rgba(16,185,129,0.2)] px-4">
              {displayName}
            </h4>
            
            <div className="mt-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <span className="text-[7px] sm:text-[8px] text-emerald-400 font-black uppercase tracking-[0.2em]">Verified Asset</span>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/50 flex items-center justify-center text-slate-700 mb-3 border border-white/5 shadow-inner">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
            </div>
            <span className="text-[7px] sm:text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">Registry Open</span>
          </div>
        )}

        {/* Updated: Only #ID and smaller size */}
        <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-md text-[5px] sm:text-[6px] font-black text-slate-500 uppercase tracking-widest z-10">
          #{slot.id.toString().padStart(2, '0')}
        </div>
      </div>

      <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between bg-[#0f172a]">
        <div className="space-y-1">
          <p className="text-[7px] sm:text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em]">Asset District</p>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-none group-hover:text-emerald-400 transition-colors">
            {slot.districtName}
          </h3>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end border-b border-white/5 pb-4">
            <div>
              <p className="text-[7px] sm:text-[8px] text-slate-500 font-black uppercase tracking-widest mb-1">Valuation</p>
              <span className="text-xl sm:text-2xl font-black text-white">₹{slot.currentPrice.toLocaleString()}</span>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-emerald-500 mb-1 justify-end">
                <span className="text-[7px] sm:text-[8px] font-black uppercase">{slot.currentPrice >= 128000 ? 'Max Value' : 'Growth'}</span>
              </div>
              <span className="text-[9px] sm:text-xs font-bold text-slate-500">
                {slot.currentPrice >= 128000 ? 'Ready to Expand' : `Next: ₹${(slot.currentPrice * 2).toLocaleString()}`}
              </span>
            </div>
          </div>

          <button className={`w-full py-3.5 sm:py-4 rounded-xl font-black text-[9px] sm:text-[10px] uppercase tracking-[0.3em] transition-all transform active:scale-[0.96] shadow-md ${
            slot.currentPrice >= 128000 || slot.isExpanded
            ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/20'
            : isOwnedByUser 
            ? 'bg-slate-800 text-slate-400 border border-white/5' 
            : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-500/10'
          }`}>
            {slot.isExpanded ? 'View Sub-Plots' : slot.currentPrice >= 128000 ? 'Expand Plot' : isOwnedByUser ? 'View Asset' : 'Acquire Plot'}
          </button>
        </div>
      </div>
    </div>
  );
};
