
import React, { useState, useEffect } from 'react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Language = 'en' | 'te';

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  const [lang, setLang] = useState<Language>('te');

  // Reset to Telugu whenever the modal opens
  useEffect(() => {
    if (isOpen) setLang('te');
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#070b14]/95 backdrop-blur-xl overflow-y-auto">
      <div className="w-full max-w-2xl my-auto bg-[#0f172a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)] relative animate-in zoom-in duration-300">
        <div className="p-8 sm:p-12">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">
                {lang === 'en' ? 'Protocol Agreement' : 'నిబంధనలు & ఒప్పందం'}
              </h2>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar text-slate-300 space-y-8 scroll-smooth">
            {lang === 'en' ? (
              <div className="space-y-8 animate-in fade-in duration-300">
                <section className="space-y-4">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight border-b border-white/5 pb-2">1. Amount & Profit</h3>
                  <div className="space-y-3 text-sm text-slate-400 leading-relaxed">
                    <p><span className="text-emerald-500 font-bold">1.1 Instant Doubling:</span> Once the user purchases the land, the amount will be doubled (2x) in their account immediately.</p>
                    <p><span className="text-emerald-500 font-bold">1.2 Service Charges:</span> A 10% admin/service charge will be deducted from the total doubled amount.</p>
                    <p><span className="text-emerald-500 font-bold">1.3 Net Profit:</span> The remaining 90% of the amount (after the 10% deduction) will be sent to the user's bank account.</p>
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight border-b border-white/5 pb-2">2. Withdrawal & Re-sale</h3>
                  <div className="space-y-3 text-sm text-slate-400 leading-relaxed">
                    <p><span className="text-emerald-500 font-bold">2.1 Next Buyer Requirement:</span> Although the amount doubles instantly, the user must wait until another user purchases their land to withdraw the funds.</p>
                    <p><span className="text-emerald-500 font-bold">2.2 Queue System:</span> All withdrawals are processed on a 'First Come, First Served' basis. Payments will only be processed when the next sale occurs.</p>
                    <p><span className="text-emerald-500 font-bold">2.3 Refund Policy:</span> Once the land is purchased, it cannot be cancelled or refunded in the middle of the process. The user must wait until the sale cycle is completed as per the system.</p>
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight border-b border-white/5 pb-2">3. User Information</h3>
                  <div className="space-y-3 text-sm text-slate-400 leading-relaxed">
                    <p><span className="text-emerald-500 font-bold">3.1 Bank Details:</span> Users must be extremely careful while providing their Name, Mobile Number, and UPI ID. The app is not responsible if the amount is credited to a wrong account due to incorrect details.</p>
                    <p><span className="text-emerald-500 font-bold">3.2 Mobile Number:</span> Users must provide a valid and active mobile number for communication purposes.</p>
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight border-b border-white/5 pb-2">4. App Management & Security</h3>
                  <div className="space-y-3 text-sm text-slate-400 leading-relaxed">
                    <p><span className="text-emerald-500 font-bold">4.1 Government Affiliation:</span> This app is not affiliated with any government organization. It is a private platform designed for digital land trading.</p>
                    <p><span className="text-emerald-500 font-bold">4.2 Data Security:</span> Your personal information will be stored securely in our database and will not be shared with anyone.</p>
                    <p><span className="text-emerald-500 font-bold">4.3 Ownership Transfer:</span> Upon purchasing the land and filling your details, the land records will be instantly updated/transferred to your name.</p>
                    <p><span className="text-emerald-500 font-bold">4.4 Technical Issues:</span> Users are requested to cooperate in case of any delays in data updates due to internet or server-related technical issues.</p>
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight border-b border-white/5 pb-2">5. Plot Expansion Rules</h3>
                  <div className="space-y-3 text-sm text-slate-400 leading-relaxed">
                    <p><span className="text-emerald-500 font-bold">5.1 Price Milestone:</span> When any plot reaches the price of ₹64,000 and is purchased, it does not stay as a single unit. Instead, the plot (valued at ₹1,28,000) automatically splits into 10 new sub-plots.</p>
                    <p><span className="text-emerald-500 font-bold">5.2 Sequential Naming:</span> These new sub-plots are assigned the original name followed by a sequence number (e.g., [Plot Name] #1, #2, #3... up to #10).</p>
                    <p><span className="text-emerald-500 font-bold">5.3 Profitable Starting Price:</span> Each of these 10 new sub-plots enters the market with a starting price of ₹16,000.</p>
                    <p><span className="text-emerald-500 font-bold">5.4 Full Ownership:</span> The user who invested ₹64,000 becomes the 100% owner of all 10 sub-plots (resulting in an asset value of ₹1,60,000 for a ₹64,000 investment).</p>
                    <p><span className="text-emerald-500 font-bold">5.5 Continuous Cycle:</span> This is a recurring process. Every sub-plot will follow the same logic—expanding into 10 more plots every time it hits the ₹64,000 milestone.</p>
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight border-b border-white/5 pb-2">6. Consent</h3>
                  <div className="space-y-3 text-sm text-slate-400 leading-relaxed italic">
                    <p><span className="text-emerald-500 font-bold">6.1 Agreement:</span> By submitting your details in this app, it is considered that you have fully read and agreed to all the terms and conditions mentioned above.</p>
                  </div>
                </section>

                <div className="pt-8 text-center border-t border-white/5">
                  <button 
                    onClick={() => setLang('te')}
                    className="text-emerald-500 font-black text-xs uppercase tracking-widest hover:text-emerald-400 transition-colors"
                  >
                    Read in Telugu
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in duration-300 font-medium">
                <section className="space-y-4">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight border-b border-white/5 pb-2">1. అమౌంట్ మరియు లాభం</h3>
                  <div className="space-y-3 text-sm text-slate-400 leading-relaxed">
                    <p><span className="text-emerald-500 font-bold">1.1 ఇన్‌స్టంట్ డబ్లింగ్:</span> వినియోగదారుడు ల్యాండ్ పర్చేస్ చేసిన వెంటనే, వారి అకౌంట్‌లో అమౌంట్ రెట్టింపు (2x) చేయబడుతుంది.</p>
                    <p><span className="text-emerald-500 font-bold">1.2 సర్వీస్ ఛార్జీలు:</span> డబుల్ అయిన మొత్తం అమౌంట్ నుండి 10% అడ్మిన్/సర్వీస్ ఛార్జీలుగా తీసివేయబడతాయి.</p>
                    <p><span className="text-emerald-500 font-bold">1.3 నికర లాభం:</span> 10% ఛార్జీలు పోగా మిగిలిన 90% మొత్తం మాత్రమే వినియోగదారుని బ్యాంక్ అకౌంట్‌కు పంపబడుతుంది.</p>
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight border-b border-white/5 pb-2">2. విత్‌డ్రాయల్ మరియు రీ-సేల్</h3>
                  <div className="space-y-3 text-sm text-slate-400 leading-relaxed">
                    <p><span className="text-emerald-500 font-bold">2.1 తదుపరి కొనుగోలుదారు:</span> అమౌంట్ వెంటనే డబుల్ అయినప్పటికీ, ఆ మొత్తాన్ని విత్‌డ్రా చేసుకోవడానికి మీ ల్యాండ్‌ను మరొక వినియోగదారుడు కొనే వరకు వేచి ఉండాలి.</p>
                    <p><span className="text-emerald-500 font-bold">2.2 వరుస క్రమం (Queue System):</span> విత్‌డ్రాయల్స్ అన్నీ 'మొదట వచ్చిన వారికి మొదటి ప్రాధాన్యత' (First Come First Serve) పద్ధతిలో, తదుపరి సేల్ జరిగినప్పుడు మాత్రమే ప్రాసెస్ చేయబడతాయి.</p>
                    <p><span className="text-emerald-500 font-bold">2.3 రీఫండ్ విధానం:</span> ఒక్కసారి ల్యాండ్ కొన్న తర్వాత "మాకొద్దు, అమౌంట్ వెనక్కి ఇచ్చేయండి" అని మధ్యలో రద్దు చేయడం కుదరదు. సిస్టమ్ ప్రకారం సేల్ పూర్తయ్యే వరకు ఆగాల్సిందే.</p>
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight border-b border-white/5 pb-2">3. యూజర్ సమాచారం</h3>
                  <div className="space-y-3 text-sm text-slate-400 leading-relaxed">
                    <p><span className="text-emerald-500 font-bold">3.1 బ్యాంక్ వివరాలు:</span> వినియోగదారుడు తన పేరు, mobile నంబర్ మరియు upi కోడ్ ఇచ్చేటప్పుడు అత్యంత జాగ్రత్తగా ఉండాలి. తప్పుడు వివరాలు ఇస్తే అమౌంట్ తప్పు అకౌంట్‌కు వెళ్లే అవకాశం ఉంది, దీనికి యాప్ బాధ్యత వహించదు.</p>
                    <p><span className="text-emerald-500 font-bold">3.2 మొబైల్ నంబర్:</span> కమ్యూనికేషన్ కోసం కచ్చితంగా పని చేసే మొబైల్ నంబర్‌ను మాత్రమే ఇవ్వాలి.</p>
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight border-b border-white/5 pb-2">4. యాప్ నిర్వహణ మరియు భద్రత</h3>
                  <div className="space-y-3 text-sm text-slate-400 leading-relaxed">
                    <p><span className="text-emerald-500 font-bold">4.1 ప్రభుత్వ సంబంధం:</span> ఈ యాప్ ఎటువంటి ప్రభుత్వ సంస్థకు సంబంధించింది కాదు. ఇది కేవలం డిజిటల్ ల్యాండ్ ట్రేడింగ్ కోసం రూపొందించబడిన ఒక ప్రైవేట్ వేదిక.</p>
                    <p><span className="text-emerald-500 font-bold">4.2 డేటా భద్రత:</span> మీ వ్యక్తిగత వివరాలు మా డేటాబేస్ లో భద్రంగా ఉంటాయి మరియు ఎవరికీ షేర్ చేయబడవు.</p>
                    <p><span className="text-emerald-500 font-bold">4.2 ఓనర్ షిప్ ట్రాన్స్‌ఫర్ :</span> మీరు ల్యాండ్ పర్చేస్ చేసి మీ details fill చేసిన వెంటనే ఆ ల్యాండ్ రికార్డ్స్ మీ పేరు మీదకు మార్చబడతాయి.</p>
                    <p><span className="text-emerald-500 font-bold">4.3 సాంకేతిక సమస్యలు:</span> ఇంటర్నెట్ లేదా సర్వర్ సమస్యల వల్ల డేటా అప్‌డేట్ అవ్వడంలో ఆలస్యం జరిగితే, యూజర్లు సహకరించాలి.</p>
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight border-b border-white/5 pb-2">5. ప్లాట్ విస్తరణ నిబంధనలు (Plot Expansion Rules)</h3>
                  <div className="space-y-3 text-sm text-slate-400 leading-relaxed">
                    <p><span className="text-emerald-500 font-bold">5.1 ధర పెరుగుదల:</span> ఏదైనా ప్లాట్ ధర ₹64,000 కి చేరుకుని అమ్మడైనప్పుడు, ₹1,28,000 ఉండాల్సిన ప్లాట్ ఆటోమేటిక్గా 10 కొత్త సబ్-ప్లాట్లుగా విడిపోతుంది.</p>
                    <p><span className="text-emerald-500 font-bold">5.2 వరుస పేర్లు:</span> ఈ కొత్త ప్లాట్లకు పాత పేరుతో పాటు వరుసగా #1, #2, #3... నుండి #10 వరకు నంబర్లు కేటాయించబడతాయి.</p>
                    <p><span className="text-emerald-500 font-bold">5.3 లాభదాయకమైన ప్రారంభ ధర:</span> కొత్తగా ఏర్పడిన ఈ 10 ప్లాట్లు ఒక్కొక్కటి ₹16,000 ప్రారంభ ధరతో మార్కెట్లోకి వస్తాయి.</p>
                    <p><span className="text-emerald-500 font-bold">5.4 పూర్తి యాజమాన్యం:</span> ₹64,000 పెట్టి కొన్న యజమానికే ఈ 10 ప్లాట్లు సొంతం అవుతాయి (అంటే ₹64,000 పెట్టుబడికి ₹1,60,000 విలువైన ఆస్తి లభిస్తుంది).</p>
                    <p><span className="text-emerald-500 font-bold">5.5 నిరంతర సైకిల్:</span> ప్రతి సబ్-ప్లాట్ కూడా ₹64,000 కి చేరిన ప్రతిసారీ ఇదే విధంగా మళ్ళీ 10 ప్లాట్లుగా విస్తరిస్తూనే ఉంటుంది.</p>
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight border-b border-white/5 pb-2">6. అంగీకారం</h3>
                  <div className="space-y-3 text-sm text-slate-400 leading-relaxed italic">
                    <p><span className="text-emerald-500 font-bold">6.1 అంగీకార పత్రం:</span> ఈ యాప్‌లో వివరాలు సబ్మిట్ చేయడం ద్వారా పైన పేర్కొన్న అన్ని నిబంధనలకు మీరు పూర్తి మనసుతో అంగీకరిస్తున్నట్లు పరిగణించబడుతుంది.</p>
                  </div>
                </section>

                <div className="pt-8 text-center border-t border-white/5">
                  <button 
                    onClick={() => setLang('en')}
                    className="text-emerald-500 font-black text-xs uppercase tracking-widest hover:text-emerald-400 transition-colors"
                  >
                    Read in English
                  </button>
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={onClose}
            className="w-full mt-10 py-5 bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-[0.4em] rounded-2xl hover:bg-emerald-400 active:scale-95 transition-all shadow-xl shadow-emerald-500/20"
          >
            {lang === 'en' ? 'Acknowledge Protocol' : 'అంగీకరిస్తున్నాను'}
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
