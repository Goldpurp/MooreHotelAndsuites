import React, { useState } from 'react';

const HelpCenter: React.FC = () => {
  const [search, setSearch] = useState('');

  const faqs = [
    {
      category: "Reservations",
      questions: [
        { q: "How do I modify a confirmed booking?", a: "You can modify your details via the 'Stay History' tab in your Profile, or by contacting your dedicated Lifestyle Manager directly." },
        { q: "What is the check-in and check-out policy?", a: "Standard arrival is at 14:00, and departure is at 12:00. Gold Circle members enjoy flexible check-in times subject to availability." }
      ]
    },
    {
      category: "The Moore Experience",
      questions: [
        { q: "Are pets permitted in the sanctuaries?", a: "We provide bespoke pet sanctuaries for small breeds. Please notify your concierge 48 hours in advance." },
        { q: "Is the spa open to non-residents?", a: "The Spa at Moore is exclusive to hotel residents and Moore Circle members to ensure absolute tranquility." }
      ]
    },
    {
      category: "Billing & Security",
      questions: [
        { q: "Which payment methods are accepted?", a: "We accept all major global credit cards, bank transfers, and Paystack for regional transactions." },
        { q: "How is my biometric data used?", a: "Your biometrics are encrypted and stored locally within our secure vault to facilitate keyless entry and authorized access." }
      ]
    }
  ];

  const filteredFaqs = faqs.map(cat => ({
    ...cat,
    questions: cat.questions.filter(f => 
      f.q.toLowerCase().includes(search.toLowerCase()) || 
      f.a.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(cat => cat.questions.length > 0);

  return (
    <div className="bg-background-dark pt-32 pb-32 min-h-screen">
      {/* Hero Search */}
      <section className="max-w-[1800px] mx-auto px-10 mb-32 text-center space-y-12">
        <div className="space-y-6">
          <p className="text-primary text-[10px] font-black uppercase tracking-[0.7em] animate-pulse">GUIDANCE & SUPPORT</p>
          <h1 className="serif-font text-7xl md:text-[10rem] text-white italic leading-none">Help Center</h1>
        </div>
        
        <div className="max-w-3xl mx-auto relative group pt-10">
          <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-transparent blur opacity-0 group-focus-within:opacity-100 transition duration-1000"></div>
          <div className="relative flex items-center bg-surface-dark border border-white/10 rounded-sm p-4 focus-within:border-primary/50 transition-all shadow-2xl">
            <span className="material-symbols-outlined px-6 text-primary text-3xl">search</span>
            <input 
              type="text" 
              placeholder="How can we assist your journey today?"
              className="bg-transparent border-none w-full py-6 text-xl text-white placeholder:text-gray-600 focus:ring-0 outline-none font-light italic"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Main FAQ Content */}
      <section className="max-w-[1800px] mx-auto px-10 space-y-32">
        {filteredFaqs.length > 0 ? filteredFaqs.map(cat => (
          <div key={cat.category} className="space-y-16">
             <div className="flex items-center gap-10">
                <h2 className="serif-font text-5xl md:text-7xl text-primary italic shrink-0 leading-none">{cat.category}</h2>
                <div className="h-px w-full bg-white/5 opacity-50"></div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
               {cat.questions.map((faq, i) => (
                 <div key={i} className="space-y-6 group">
                    <h4 className="text-white font-medium text-2xl lg:text-3xl group-hover:text-primary transition-colors leading-tight italic">{faq.q}</h4>
                    <p className="text-gray-500 font-light leading-relaxed text-lg lg:text-xl opacity-80">{faq.a}</p>
                 </div>
               ))}
             </div>
          </div>
        )) : (
          <div className="py-40 text-center space-y-10">
            <div className="w-24 h-24 bg-white/[0.02] rounded-full flex items-center justify-center text-gray-800 mx-auto">
              <span className="material-symbols-outlined text-6xl">contact_support</span>
            </div>
            <p className="text-gray-500 italic text-2xl font-light">No matches found for your query. Our concierge is ready to assist.</p>
            <button 
              onClick={() => setSearch('')}
              className="text-primary text-[12px] font-black uppercase tracking-widest underline underline-offset-8"
            >
              Clear Search
            </button>
          </div>
        )}
      </section>

      {/* Contact Channels */}
      <section className="max-w-[1800px] mx-auto px-10 mt-40">
        <div className="bg-surface-dark/40 border border-white/5 p-16 md:p-24 rounded-sm grid md:grid-cols-3 gap-20 text-center shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
           
           <div className="space-y-8 group">
             <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center text-primary mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-700">
               <span className="material-symbols-outlined text-4xl">chat</span>
             </div>
             <h3 className="serif-font text-4xl text-white italic">Live Concierge</h3>
             <p className="text-base text-gray-500 leading-relaxed font-light">Instant assistance via our secure resident portal for all immediate needs.</p>
             <button className="text-[11px] font-black uppercase tracking-[0.4em] text-primary hover:text-white transition-colors border-b border-primary/20 pb-1">START CHAT</button>
           </div>

           <div className="space-y-8 group">
             <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center text-primary mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-700">
               <span className="material-symbols-outlined text-4xl">mail</span>
             </div>
             <h3 className="serif-font text-4xl text-white italic">Email Relations</h3>
             <p className="text-base text-gray-500 leading-relaxed font-light">Detailed inquiries handled with absolute precision by our specialist team.</p>
             <button className="text-[11px] font-black uppercase tracking-[0.4em] text-primary hover:text-white transition-colors border-b border-primary/20 pb-1">SEND MESSAGE</button>
           </div>

           <div className="space-y-8 group">
             <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center text-primary mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-700">
               <span className="material-symbols-outlined text-4xl">call</span>
             </div>
             <h3 className="serif-font text-4xl text-white italic">Direct Line</h3>
             <p className="text-base text-gray-500 leading-relaxed font-light">Urgent matters resolved via priority voice communication on our dedicated lines.</p>
             <button className="text-[11px] font-black uppercase tracking-[0.4em] text-primary hover:text-white transition-colors border-b border-primary/20 pb-1">+234 1 000 0000</button>
           </div>
        </div>
      </section>
    </div>
  );
};

export default HelpCenter;