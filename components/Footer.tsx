import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-white/5 pt-16 pb-8 px-6">
      <div className="max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-4 text-white group">
            <div className="w-10 h-10 bg-primary rounded flex items-center justify-center text-black font-bold text-lg shadow-lg shadow-primary/10 transition-all animate-luxury-logo group-hover:animate-luxury-spin">M</div>
            <span className="accent-font tracking-widest text-2xl font-bold group-hover:text-primary transition-colors">MOORE</span>
          </Link>
          <p className="text-xs leading-relaxed text-gray-500 max-w-xs">
            Redefining luxury hospitality. Experience the epitome of modern elegance in the heart of the world's most vibrant cities at Moore Hotel & Suites.
          </p>
        </div>

        <div>
          <h5 className="text-white text-[11px] uppercase tracking-[0.2em] font-bold mb-6">Explore</h5>
          <ul className="space-y-4 text-xs font-medium text-gray-500">
            <li><Link to="/rooms" className="hover:text-primary transition-colors">Rooms & Suites</Link></li>
            <li><Link to="/dining" className="hover:text-primary transition-colors">Fine Dining</Link></li>
            <li><Link to="/amenities" className="hover:text-primary transition-colors">Spa & Wellness</Link></li>
            <li><Link to="/about" className="hover:text-primary transition-colors">Our Story</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="text-white text-[11px] uppercase tracking-[0.2em] font-bold mb-6">Concierge</h5>
          <ul className="space-y-4 text-xs font-medium text-gray-500">
            <li className="flex gap-4">
              <span className="material-symbols-outlined text-primary text-lg">location_on</span>
              <span>Victory Island,<br />Lagos, Nigeria</span>
            </li>
            <li className="flex gap-4">
              <span className="material-symbols-outlined text-primary text-lg">phone</span>
              <span>+234 123 456 7890</span>
            </li>
            <li className="flex gap-4">
              <span className="material-symbols-outlined text-primary text-lg">mail</span>
              <span>reservations@moorehotel.com</span>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="text-white text-[11px] uppercase tracking-[0.2em] font-bold mb-6">Stay Updated</h5>
          <p className="text-xs text-gray-500 mb-6">Receive exclusive invitations to private events and seasonal previews.</p>
          <form className="space-y-3" onSubmit={e => e.preventDefault()}>
            <input 
              className="w-full bg-white/5 border-none text-white placeholder:text-gray-600 text-xs p-4 rounded focus:ring-1 focus:ring-primary" 
              placeholder="Email Address" 
              type="email" 
            />
            <button className="w-full bg-primary text-black py-4 text-[10px] uppercase tracking-widest font-black hover:bg-yellow-500 transition-colors rounded shadow-lg">
              Join Moore Circle
            </button>
          </form>
        </div>
      </div>
      <div className="max-w-[1800px] mx-auto pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest text-gray-600">
        <p>© 2024 MOORE HOTEL & SUITES. A SANCTUARY GROUP MEMBER.</p>
        <div className="flex gap-8">
          <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-primary transition-colors">Terms of Use</Link>
          <Link to="/help" className="hover:text-primary transition-colors">Help Center</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;