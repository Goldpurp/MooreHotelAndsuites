
import React, { useState } from 'react';

const FAQ_DATA = [
  {
    question: "What is the standard check-in and check-out time?",
    answer: "Standard arrival begins at 14:00. We request that guests depart their sanctuary by 12:00. Gold Circle members enjoy extended check-out privileges subject to availability."
  },
  {
    question: "Are airport transfers included in my stay?",
    answer: "Complimentary luxury chauffeur service is provided for all Suite and Executive bookings. Business tier guests may arrange transfers via our concierge for a nominal fee."
  },
  {
    question: "What is the policy regarding children and extra residents?",
    answer: "Our sanctuaries are designed for tranquility. Children are welcome, and we offer bespoke family arrangements in our connected suites. Please contact the concierge for specific requirements."
  },
  {
    question: "How does the Moore Hotels security system function?",
    answer: "We utilize state-of-the-art encrypted biometric access and 24/7 elite security personnel to ensure the absolute safety and privacy of all residents."
  }
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 md:py-48 px-6 bg-black/40">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="text-center space-y-6">
          <p className="text-primary text-[10px] font-black uppercase tracking-[0.6em]">Guidance & Clarity</p>
          <h2 className="serif-font text-5xl md:text-8xl text-white italic">Common Inquiries</h2>
        </div>

        <div className="space-y-4">
          {FAQ_DATA.map((item, index) => (
            <div 
              key={index} 
              className="border-b border-white/5 overflow-hidden"
            >
              <button 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full py-8 flex justify-between items-center text-left group"
              >
                <span className={`serif-font text-xl md:text-2xl italic transition-colors ${openIndex === index ? 'text-primary' : 'text-white hover:text-primary/80'}`}>
                  {item.question}
                </span>
                <span className={`material-symbols-outlined text-primary transition-transform duration-500 ${openIndex === index ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>
              <div 
                className={`transition-all duration-500 ease-in-out ${openIndex === index ? 'max-h-96 pb-8 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <p className="text-gray-400 text-lg font-light leading-relaxed px-1">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
