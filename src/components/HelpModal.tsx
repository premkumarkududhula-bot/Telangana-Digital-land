
import React, { useState } from 'react';
import { X, HelpCircle } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Language = 'en' | 'te';

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const [lang, setLang] = useState<Language>('te');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#070b14]/95 backdrop-blur-xl overflow-y-auto">
      <div className="w-full max-w-2xl my-auto bg-[#0f172a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl relative animate-in zoom-in duration-300">
        <div className="p-8 sm:p-12">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-emerald-500" />
              <h2 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">
                {lang === 'en' ? 'Help & Information' : 'సహాయం & సమాచారం'}
              </h2>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-2">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex gap-4 mb-8 border-b border-white/5 pb-4">
            <button 
              onClick={() => setLang('te')}
              className={`text-[10px] font-black uppercase tracking-widest transition-all ${lang === 'te' ? 'text-emerald-500 border-b-2 border-emerald-500 pb-1' : 'text-slate-500'}`}
            >
              Telugu
            </button>
            <button 
              onClick={() => setLang('en')}
              className={`text-[10px] font-black uppercase tracking-widest transition-all ${lang === 'en' ? 'text-emerald-500 border-b-2 border-emerald-500 pb-1' : 'text-slate-500'}`}
            >
              English
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar text-slate-300 space-y-8 scroll-smooth">
            {lang === 'te' ? (
              <div className="space-y-8 animate-in fade-in duration-300">
                <section className="space-y-4">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight border-b border-white/5 pb-2">1. About Us (మా గురించి)</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    మా యాప్ ఒక వినూత్నమైన డిజిటల్ ప్లాట్ ట్రేడింగ్ ప్లాట్ఫామ్. ఇక్కడ వినియోగదారులు డిజిటల్ ప్లాట్లను తక్కువ ధరకు కొనుగోలు చేసి, అవి నిర్దేశించిన స్థాయికి చేరుకున్నప్పుడు లాభాలను పొందే అవకాశం ఉంటుంది. పారదర్శకత మరియు నమ్మకమే మా పునాది. కేవలం ₹1,000 తో మీ డిజిటల్ ఆస్తి ప్రయాణాన్ని ప్రారంభించే సౌకర్యాన్ని మేము కల్పిస్తున్నాము.
                  </p>
                </section>

                <section className="space-y-4">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight border-b border-white/5 pb-2">2. Contact Us (మమ్మల్ని సంప్రదించండి)</h3>
                  <div className="space-y-2 text-sm text-slate-400">
                    <p><span className="text-emerald-500 font-bold">యజమాని పేరు:</span> ప్రేమ్ కుమార్</p>
                    <p><span className="text-emerald-500 font-bold">ఈమెయిల్:</span> premkumarkududhula@gmail.com</p>
                    <p><span className="text-emerald-500 font-bold">చిరునామా:</span> తెలంగాణ, భారతదేశం.</p>
                    <p><span className="text-emerald-500 font-bold">పనివేళలు:</span> ఉదయం 10:00 నుండి సాయంత్రం 6:00 వరకు.</p>
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight border-b border-white/5 pb-2">3. Refund Policy (రీఫండ్ పాలసీ)</h3>
                  <div className="space-y-3 text-sm text-slate-400 leading-relaxed">
                    <p><span className="text-emerald-500 font-bold">రీఫండ్:</span> ఒకసారి ప్లాట్ కొనుగోలు చేసిన తర్వాత, ఆ అమౌంట్ రీఫండ్ చేయబడదు. ఎందుకంటే ఆ పేమెంట్లో 90% వెంటనే పాత యజమానికి బదిలీ చేయబడుతుంది.</p>
                    <p><span className="text-emerald-500 font-bold">లావాదేవీ ఫెయిల్ అయితే:</span> ఒకవేళ మీ అకౌంట్ నుండి డబ్బులు కట్ అయ్యి, ప్లాట్ రాకపోతే.. 5 నుండి 7 పని దినాలలో ఆ మొత్తం మీ ఒరిజినల్ పేమెంట్ సోర్స్కి రీఫండ్ చేయబడుతుంది.</p>
                    <p><span className="text-emerald-500 font-bold">వివాదాలు:</span> ఏవైనా పేమెంట్ సమస్యలు ఉంటే 24 గంటల లోపు మా సపోర్ట్ టీమ్ను సంప్రదించాలి.</p>
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight border-b border-white/5 pb-2">4. Terms & Conditions (నియమ నిబంధనలు)</h3>
                  <ul className="space-y-2 text-sm text-slate-400 list-disc pl-5">
                    <li>ప్రతి ప్లాట్ ధర కొనుగోలు జరిగిన ప్రతిసారీ రెట్టింపు (Double) అవుతుంది.</li>
                    <li>ప్లాట్ ధర ₹64,000 కి చేరుకున్నప్పుడు, అది ఆటోమేటిక్గా 10 సబ్-ప్లాట్లుగా విడిపోతుంది.</li>
                    <li>ప్రతి సేల్ అమౌంట్ నుండి 90% పాత యజమానికి, 10% ప్లాట్ఫామ్ నిర్వహణ రుసుము (Admin Fee) కింద తీసుకోబడుతుంది.</li>
                  </ul>
                </section>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in duration-300">
                <section className="space-y-4">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight border-b border-white/5 pb-2">1. About Us</h3>
                  <div className="space-y-3 text-sm text-slate-400 leading-relaxed">
                    <p className="font-bold text-white">Welcome to Our Digital Property Platform</p>
                    <p>Our app is a revolutionary digital plot trading platform designed for everyone. We provide a transparent and secure environment where users can purchase digital plots at affordable prices. As these plots reach designated price milestones, owners benefit from the value appreciation. Built on the pillars of trust and transparency, we empower you to start your digital asset journey with as little as ₹1,000.</p>
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight border-b border-white/5 pb-2">2. Contact Us</h3>
                  <div className="space-y-2 text-sm text-slate-400">
                    <p><span className="text-emerald-500 font-bold">Owner Name:</span> Prem Kumar</p>
                    <p><span className="text-emerald-500 font-bold">Email:</span> premkumarkududhula@gmail.com</p>
                    <p><span className="text-emerald-500 font-bold">Address:</span> Telangana, India.</p>
                    <p><span className="text-emerald-500 font-bold">Business Hours:</span> 10:00 AM to 06:00 PM (Monday to Saturday)</p>
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight border-b border-white/5 pb-2">3. Refund Policy</h3>
                  <div className="space-y-3 text-sm text-slate-400 leading-relaxed">
                    <p><span className="text-emerald-500 font-bold">No Refund:</span> Once a plot is successfully purchased, the amount is non-refundable. This is because 90% of the payment is instantly allocated/transferred to the previous owner as part of the trading cycle.</p>
                    <p><span className="text-emerald-500 font-bold">Failed Transactions:</span> In case your account is debited but the plot is not allocated due to a technical error, the amount will be automatically refunded to your original payment source within 5 to 7 working days.</p>
                    <p><span className="text-emerald-500 font-bold">Disputes:</span> Any payment-related discrepancies must be reported to our support team within 24 hours of the transaction.</p>
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight border-b border-white/5 pb-2">4. Terms & Conditions</h3>
                  <ul className="space-y-2 text-sm text-slate-400 list-disc pl-5">
                    <li><span className="text-emerald-500 font-bold">Price Doubling:</span> The price of each digital plot doubles automatically after every successful purchase/cycle.</li>
                    <li><span className="text-emerald-500 font-bold">Plot Expansion (Split):</span> When a plot price reaches the milestone of ₹64,000, it will automatically split into 10 sub-plots, each starting at a new base price of ₹16,000.</li>
                    <li><span className="text-emerald-500 font-bold">Revenue Sharing:</span> Out of every successful sale, 90% of the transaction value goes to the previous owner, and 10% is retained by the platform as an Administrative & Maintenance fee.</li>
                    <li><span className="text-emerald-500 font-bold">User Responsibility:</span> Users are responsible for providing accurate bank details for payouts. The platform is not liable for transfers made to incorrect account details provided by the user.</li>
                  </ul>
                </section>
              </div>
            )}
          </div>

          <button 
            onClick={onClose}
            className="w-full mt-10 py-5 bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-[0.4em] rounded-2xl hover:bg-emerald-400 active:scale-95 transition-all shadow-xl shadow-emerald-500/20"
          >
            {lang === 'en' ? 'Close Information' : 'ముగించు'}
          </button>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.5);
        }
      `}</style>
    </div>
  );
};
