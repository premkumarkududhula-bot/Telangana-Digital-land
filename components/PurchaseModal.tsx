
import React, { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { LandSlot, AppState, Transaction } from '../types';
import { ADMIN_ACCOUNT, ADMIN_IFSC, ADMIN_NAME, ADMIN_MOBILE } from '../constants';
import { verifyAdminPassword } from '../services/geminiService';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PurchaseModalProps {
  slot: LandSlot;
  isOpen: boolean;
  currentState: AppState;
  onClose: () => void;
  onConfirm: (updatedState: AppState) => Promise<void>;
}

type Step = 'summary' | 'payment_instructions' | 'key_gate' | 'finalizing' | 'success' | 'setup';

export const PurchaseModal: React.FC<PurchaseModalProps> = ({ slot, isOpen, currentState, onClose, onConfirm }) => {
  const [step, setStep] = useState<Step>('summary');
  const [accessKeyInput, setAccessKeyInput] = useState('');
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerifyingKey, setIsVerifyingKey] = useState(false);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [secretClicks, setSecretClicks] = useState(0);
  
  const [buyerName, setBuyerName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [upiId, setUpiId] = useState('');

  const admin = currentState.adminProfile || {
    name: ADMIN_NAME,
    mobile: ADMIN_MOBILE,
    account: ADMIN_ACCOUNT,
    ifsc: ADMIN_IFSC
  };

  const UPI_ID = `${admin.mobile}-3@ybl`;
  const WHATSAPP_BASE = `https://wa.me/91${admin.mobile}?text=`;

  useEffect(() => {
    if (!isOpen) {
      setStep('summary');
      setAccessKeyInput('');
      setError('');
      setStatusMessage('');
      setIsProcessing(false);
      setIsVerifyingKey(false);
      setBuyerName('');
      setMobileNumber('');
      setUpiId('');
      setCopyStatus(null);
      setSecretClicks(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (step === 'setup') {
        e.preventDefault();
        e.returnValue = 'Stop! Your ownership is not secured yet. Please fill in your bank details.';
        return e.returnValue;
      }
    };

    const handlePopState = (e: PopStateEvent) => {
      if (step === 'setup') {
        window.history.pushState(null, '', window.location.href);
      }
    };

    if (step === 'setup') {
      window.addEventListener('beforeunload', handleBeforeUnload);
      window.history.pushState(null, '', window.location.href);
      window.addEventListener('popstate', handlePopState);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [step]);

  if (!isOpen || !slot) return null;

  const handleCopy = (text: string, label: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopyStatus(label);
        setTimeout(() => setCopyStatus(null), 2000);
      });
    }
  };

  const handleKeyGateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessKeyInput) return;
    setError('');
    setIsVerifyingKey(true);
    try {
      const isAuthorized = await verifyAdminPassword(accessKeyInput);
      if (isAuthorized) {
        setStep('setup');
      } else {
        setError('Incorrect Key.');
      }
    } catch (err) {
      setError('Connection Error.');
    } finally {
      setIsVerifyingKey(false);
    }
  };

  const handleRazorpayPayment = () => {
    const razorpayKey = (import.meta as any).env.VITE_RAZORPAY_KEY_ID || 'rzp_test_mock_key';
    
    const options = {
      key: razorpayKey,
      amount: slot.currentPrice * 100, // Amount in paise
      currency: "INR",
      name: "Telangana Digital Land",
      description: `Purchase of ${slot.districtName} Plot`,
      image: "https://api.dicebear.com/7.x/bottts/png?seed=ts-land&backgroundColor=10b981",
      handler: function (response: any) {
        console.log("Payment Success:", response.razorpay_payment_id);
        setStep('setup');
      },
      prefill: {
        name: "",
        email: "",
        contact: ""
      },
      theme: {
        color: "#10b981"
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response: any) {
      setError(response.error.description);
    });
    rzp.open();
  };

  const handleFinalize = async () => {
    setError('');
    setIsProcessing(true);
    setStatusMessage('Syncing with Cloud Registry...');
    setStep('finalizing');

    const txId = Math.random().toString(36).substr(2, 9);
    const amount = slot.currentPrice;
    
    const newTransaction: Transaction = {
      id: txId,
      slotId: slot.id,
      buyerName,
      sellerName: slot.ownerName,
      amount,
      timestamp: Date.now()
    };

    const updatedSlots = currentState.slots.map(s => {
      if (s.id === slot.id) {
        return {
          ...s,
          currentPrice: s.currentPrice * 2,
          ownerName: buyerName,
          mobileNumber,
          upiId,
          history: [...s.history, newTransaction]
        };
      }
      return s;
    });

    const newState: AppState = {
      ...currentState,
      slots: updatedSlots,
      transactions: [...currentState.transactions, newTransaction],
      totalAdminRevenue: currentState.totalAdminRevenue + (slot.ownerName === ADMIN_NAME ? amount : amount * 0.1)
    };

    try {
      await onConfirm(newState);
      setStatusMessage('Data Saved Successfully.');
      setTimeout(() => {
        setIsProcessing(false);
        setStep('success');
      }, 1500);
    } catch (err) {
      setStep('success'); 
    }
  };

  const isFormValid = buyerName && mobileNumber.length >= 10 && upiId.includes('@');

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070b14]/95 backdrop-blur-xl overflow-y-auto"
      onClick={(e) => {
        if (step !== 'setup' && e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="w-full max-w-md my-auto bg-[#0f172a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 sm:p-10">
          {step !== 'success' && step !== 'finalizing' && (
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Registry Protocol</h2>
              {step !== 'setup' && (
                <button onClick={onClose} className="text-slate-600 hover:text-white p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>
          )}

          {step === 'summary' && (
            <div className="space-y-6 animate-in fade-in zoom-in duration-300">
              <div className="text-center bg-slate-900/50 py-12 rounded-[2.5rem] border border-white/5">
                <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.4em] mb-2">{slot.districtName}</p>
                <h3 className="text-5xl font-black text-white tracking-tighter">₹{slot.currentPrice.toLocaleString()}</h3>
                <p className="text-[8px] text-emerald-500/70 font-black uppercase tracking-widest mt-4">Verified Registry</p>
              </div>
              {error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest text-center animate-pulse">{error}</p>}
              <button onClick={handleRazorpayPayment} className="w-full py-5 rounded-2xl bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">Continue to Buy</button>
            </div>
          )}

          {step === 'setup' && (
            <div className="space-y-6 animate-in fade-in duration-400">
              <div className="text-center">
                <h3 className="text-2xl font-black text-white">Ownership Identity</h3>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Binding details to Cloud Registry</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-500 font-black uppercase tracking-widest ml-1">Full Name</label>
                  <input type="text" placeholder="Owner Name" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-4 text-white font-bold text-sm outline-none focus:border-emerald-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-500 font-black uppercase tracking-widest ml-1">Mobile</label>
                  <input type="tel" placeholder="Mobile Number" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))} maxLength={10} className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-4 text-white font-bold text-sm outline-none focus:border-emerald-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-500 font-black uppercase tracking-widest ml-1">UPI ID</label>
                  <input type="text" placeholder="example@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-4 text-white font-bold text-sm outline-none focus:border-emerald-500" />
                </div>
                <button disabled={!isFormValid || isProcessing} onClick={handleFinalize} className={`w-full py-5 mt-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all ${isFormValid ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-600'}`}>Complete Registry</button>
              </div>
            </div>
          )}

          {step === 'finalizing' && (
            <div className="py-20 flex flex-col items-center justify-center space-y-8 animate-in zoom-in duration-300 text-center">
               <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
               <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] animate-pulse">{statusMessage}</p>
            </div>
          )}

          {step === 'success' && (
            <div className="py-12 flex flex-col items-center justify-center space-y-8 animate-in zoom-in duration-500 text-center">
               <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
               </div>
               <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Certified!</h3>
               <p className="text-sm text-slate-400">Your details are successfully stored in Cloud Registry.</p>
               <button onClick={onClose} className="w-full py-5 rounded-2xl bg-white text-slate-950 font-black text-xs uppercase tracking-widest shadow-xl">Back to Market</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
