
import React, { useState, useEffect } from 'react';
import { AppState, LandSlot, AdminProfile } from '../types';
import { verifyAdminPassword } from '../services/geminiService';

interface AdminControllerProps {
  isOpen: boolean;
  onClose: () => void;
  state: AppState;
  onUpdateState: (newState: AppState) => void;
}

export const AdminController: React.FC<AdminControllerProps> = ({ isOpen, onClose, state, onUpdateState }) => {
  const [step, setStep] = useState<'biometric' | 'password' | 'dashboard'>('biometric');
  const [isScanning, setIsScanning] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [editingSlot, setEditingSlot] = useState<LandSlot | null>(null);
  
  const [localAdminProfile, setLocalAdminProfile] = useState<AdminProfile>(() => state.adminProfile || {
    name: 'Platform Admin',
    mobile: '7095377577',
    account: '50200110457286',
    ifsc: 'HDFC0006243'
  });

  useEffect(() => {
    if (!isOpen) {
      setStep('biometric');
      setError('');
      setPassword('');
      setIsScanning(false);
    } else if (state.adminProfile) {
      setLocalAdminProfile(state.adminProfile);
    }
  }, [isOpen, state.adminProfile]);

  const triggerBiometric = async () => {
    setIsScanning(true);
    setError('');
    await new Promise(r => setTimeout(r, 2000));
    setStep('password');
    setIsScanning(false);
  };

  const handlePasswordVerify = async () => {
    if (!password) return;
    setIsVerifying(true);
    setError('');
    try {
      const isAuthorized = await verifyAdminPassword(password);
      if (isAuthorized) {
        setStep('dashboard');
        setPassword('');
      } else {
        setError('ACCESS DENIED: Key mismatch.');
      }
    } catch (err) {
      setError('Sync interrupted.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSaveAdminProfile = () => {
    onUpdateState({ ...state, adminProfile: localAdminProfile });
    alert("Profile Secured to Cloud.");
  };

  const updateSlotManual = (slotId: number, updates: Partial<LandSlot>) => {
    const newSlots = state.slots.map(s => s.id === slotId ? { ...s, ...updates } : s);
    onUpdateState({ ...state, slots: newSlots });
    setEditingSlot(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#050810] border border-emerald-500/20 rounded-[3rem] shadow-[0_0_150px_rgba(16,185,129,0.1)] overflow-hidden relative">
        <div className="p-8 sm:p-12">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-slate-950 font-black text-xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <div>
                <h2 className="text-white font-black uppercase tracking-[0.2em] text-sm">Control Panel</h2>
                <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-[0.4em]">Auth Level 3</p>
              </div>
            </div>
            <button onClick={onClose} className="text-slate-600 hover:text-white transition-colors p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {step === 'biometric' && (
            <div className="flex flex-col items-center text-center space-y-12 py-10">
              <div 
                onClick={triggerBiometric}
                className="w-40 h-40 rounded-full border-4 border-slate-800 flex items-center justify-center hover:border-emerald-500 transition-all cursor-pointer group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-slate-700 group-hover:text-emerald-500/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 3c1.223 0 2.389.22 3.468.618M15.75 12c0 1.258-.479 2.405-1.268 3.264m-3.535 0A4.981 4.981 0 0110.5 12c0-1.258.479-2.405 1.268-3.264m3.535 0A4.981 4.981 0 0113.5 12c0 1.258-.479 2.405-1.268 3.264" /></svg>
              </div>
              <h3 className="text-3xl font-black text-white tracking-tighter uppercase">Auth Required</h3>
            </div>
          )}

          {step === 'password' && (
            <div className="flex flex-col items-center text-center space-y-10 py-6">
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Neural Key" className="w-full bg-black/50 border-2 border-emerald-500/10 rounded-[1.5rem] py-6 px-10 text-center text-xl font-bold text-emerald-400 focus:border-emerald-500 outline-none" autoFocus />
              {error && <p className="text-red-500 text-[11px] font-black uppercase tracking-widest">{error}</p>}
              <button disabled={isVerifying} onClick={handlePasswordVerify} className="w-full py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-[0.4em] bg-emerald-600 text-slate-950">Authenticate</button>
            </div>
          )}

          {step === 'dashboard' && (
            <div className="space-y-8 max-h-[70vh] overflow-y-auto pr-2">
              <section className="space-y-6 bg-slate-900/30 p-6 rounded-[2rem] border border-white/5">
                <div className="flex items-center justify-between">
                   <h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Identity Setup</h4>
                   <button onClick={handleSaveAdminProfile} className="px-4 py-2 bg-emerald-500 text-slate-950 text-[9px] font-black uppercase rounded-lg">Save Profile</button>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <input type="text" value={localAdminProfile.name} onChange={(e) => setLocalAdminProfile({...localAdminProfile, name: e.target.value})} placeholder="Name" className="bg-slate-900/50 border border-white/5 rounded-xl px-5 py-4 text-xs text-white" />
                  <input type="text" value={localAdminProfile.mobile} onChange={(e) => setLocalAdminProfile({...localAdminProfile, mobile: e.target.value})} placeholder="Mobile" className="bg-slate-900/50 border border-white/5 rounded-xl px-5 py-4 text-xs text-white" />
                  <input type="text" value={localAdminProfile.account} onChange={(e) => setLocalAdminProfile({...localAdminProfile, account: e.target.value})} placeholder="Account" className="bg-slate-900/50 border border-white/5 rounded-xl px-5 py-4 text-xs text-white" />
                  <input type="text" value={localAdminProfile.ifsc} onChange={(e) => setLocalAdminProfile({...localAdminProfile, ifsc: e.target.value})} placeholder="IFSC" className="bg-slate-900/50 border border-white/5 rounded-xl px-5 py-4 text-xs text-white" />
                </div>
              </section>

              <section className="space-y-3">
                {state.slots.map(slot => (
                  <div key={slot.id} className="bg-slate-900/40 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-white font-black">{slot.districtName}</p>
                      <p className="text-[8px] text-slate-500">Owner: {slot.ownerName}</p>
                    </div>
                    <button onClick={() => setEditingSlot(slot)} className="px-4 py-2 bg-white/5 text-[9px] font-black text-white uppercase rounded-lg">Edit</button>
                  </div>
                ))}
              </section>

              {editingSlot && (
                <div className="p-6 bg-slate-800 rounded-[2rem] border-2 border-emerald-500/20 space-y-4">
                  <div>
                    <label className="text-[8px] text-slate-500 font-black uppercase tracking-widest ml-1">Owner Name</label>
                    <input type="text" className="w-full bg-slate-900 rounded-xl px-4 py-3 text-xs text-white" value={editingSlot.ownerName} onChange={(e) => setEditingSlot({...editingSlot, ownerName: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[8px] text-slate-500 font-black uppercase tracking-widest ml-1">Mobile Number</label>
                    <input type="text" className="w-full bg-slate-900 rounded-xl px-4 py-3 text-xs text-white" value={editingSlot.mobileNumber || ''} onChange={(e) => setEditingSlot({...editingSlot, mobileNumber: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[8px] text-slate-500 font-black uppercase tracking-widest ml-1">UPI ID</label>
                    <input type="text" className="w-full bg-slate-900 rounded-xl px-4 py-3 text-xs text-white" value={editingSlot.upiId || ''} onChange={(e) => setEditingSlot({...editingSlot, upiId: e.target.value})} />
                  </div>
                  <button onClick={() => updateSlotManual(editingSlot.id, editingSlot)} className="w-full py-4 bg-emerald-500 text-slate-950 font-black text-[10px] uppercase rounded-xl">Update Slot Data</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
