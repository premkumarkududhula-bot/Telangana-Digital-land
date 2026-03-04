
import React from 'react';
import { X, Info, ChevronRight } from 'lucide-react';

interface HowToBuyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToBuyModal: React.FC<HowToBuyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-[#070b14]/90 backdrop-blur-xl"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl bg-[#0f172a] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-emerald-500/10 to-transparent">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Info className="w-6 h-6 text-slate-900" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">How to Buy</h2>
              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Step-by-Step Guide</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-10 custom-scrollbar">
          
          {/* Telugu Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-l-4 border-emerald-500 pl-4">
              <h3 className="text-xl font-black text-white">🏗️ ల్యాండ్ కొనుగోలు చేసే విధానం</h3>
            </div>
            
            <div className="grid gap-4">
              {[
                "మొదట మీకు నచ్చిన Asset District లోని ప్లాట్పై క్లిక్ చేయండి.",
                "ప్లాట్ వివరాలు మరియు ధర చూసుకున్నాక \"Continue to Buy\" బటన్ నొక్కండి.",
                "మీ అమౌంట్ను UPI లేదా బ్యాంక్ అకౌంట్ ఉపయోగించి చెల్లించండి.",
                "పేమెంట్ పూర్తయ్యాక, యాప్ ఆటోమేటిక్గా మిమ్మల్ని తదుపరి పేజీకి తీసుకెళ్తుంది.",
                "(ముఖ్యమైన మార్పు): పేమెంట్ సక్సెస్ అవ్వగానే 5 seconds lo Automatic గా మీరు \"Owner Details Page\" కి చేరుకుంటారు. అక్కడ మీ పేరు, Mobile Number, Upi id ఎంటర్ చేయండి.",
                "మీరు వివరాలు సబ్మిట్ చేయగానే, తక్షణమే ఆ ల్యాండ్ రికార్డ్స్ మీ పేరుపై అప్డేట్ అవుతాయి మరియు ప్లాట్ ధర రెట్టింపు అవుతుంది.",
                "మీ తర్వాత మరొక వ్యక్తి ఆ ల్యాండ్ను కొనుగోలు చేయగానే, 10% సర్వీస్ ఛార్జీలు మినహాయించి, 90% మొత్తం 24 గంటల్లోపు నేరుగా మీ అకౌంట్కు పంపబడుతుంది."
              ].map((step, i) => (
                <div key={i} className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-colors group">
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-black text-xs border border-emerald-500/20">
                    {i + 1}
                  </span>
                  <p className="text-sm text-slate-300 leading-relaxed font-medium">
                    <span className="text-emerald-500 font-bold mr-2">Step {i + 1}:</span>
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* English Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-l-4 border-emerald-500 pl-4">
              <h3 className="text-xl font-black text-white">🏗️ Land Purchase Process</h3>
            </div>
            
            <div className="grid gap-4">
              {[
                "Select your preferred plot from the Asset District list.",
                "Review the plot details and price, then click the \"Continue to Buy\" button.",
                "Complete your payment securely using UPI or Bank Transfer.",
                "Once the payment is successful, the app will automatically redirect you to the next page.",
                "(Important): After successful payment, you will be automatically redirected to the \"Owner Details Page\" within 5 seconds. Please enter your Full Name, Mobile Number, and UPI ID to register your ownership.",
                "Upon submitting your details, the land records will be instantly updated in your name, and the plot value will double.",
                "As soon as the next person purchases this land, 90% of the amount (after a 10% service charge) will be credited to your bank account within 24 hours."
              ].map((step, i) => (
                <div key={i} className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-colors group">
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-black text-xs border border-emerald-500/20">
                    {i + 1}
                  </span>
                  <p className="text-sm text-slate-300 leading-relaxed font-medium">
                    <span className="text-emerald-500 font-bold mr-2">Step {i + 1}:</span>
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-900/50 border-t border-white/5 flex justify-center">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-emerald-500 text-slate-950 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
          >
            Got it, Let's Start
          </button>
        </div>
      </div>
    </div>
  );
};
