/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ShieldAlert, Settings, Laptop, Menu, X } from 'lucide-react';
import Home from './pages/Home';
import About from './pages/About';
import Vision from './Vision';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Gallery from './pages/Gallery';
import WhatsAppButton from './components/WhatsAppButton';

import { SiteProvider } from './context/SiteContext';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'vision' | 'about' | 'contact' | 'admin' | 'gallery'>(() => {
    const path = window.location.pathname.replace(/\/$/, "");
    if (path === '/admin') return 'admin';
    if (path === '/vision') return 'vision';
    if (path === '/about') return 'about';
    if (path === '/contact') return 'contact';
    return 'home';
  });
  const [selectedGalleryId, setSelectedGalleryId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sync URL when page changes
  useEffect(() => {
    const path = currentPage === 'home' ? '/' : `/${currentPage}`;
    // Don't sync URL for gallery yet since it requires params
    if (currentPage !== 'gallery' && window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
  }, [currentPage]);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/\/$/, "");
      if (path === '/admin') setCurrentPage('admin');
      else if (path === '/vision') setCurrentPage('vision');
      else if (path === '/about') setCurrentPage('about');
      else if (path === '/contact') setCurrentPage('contact');
      else setCurrentPage('home');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigateToGallery = (categoryId: string) => {
    setSelectedGalleryId(categoryId);
    setCurrentPage('gallery');
    window.scrollTo(0, 0);
  };

  const navigateTo = (page: 'home' | 'vision' | 'about' | 'contact' | 'admin') => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
  };

  const NavLinks = ({ mobile }: { mobile?: boolean }) => {
    const btnClass = `group font-medium transition-colors focus:outline-none ${mobile ? 'py-3 text-lg w-full text-left flex items-center' : 'whitespace-nowrap flex items-center justify-center'}`;
    
    const linkStyle = (page: string) => {
      const isActive = currentPage === page;
      if (mobile) {
        return `transition-all border-b-2 pb-0.5 ${isActive ? 'text-sky-600 border-sky-600' : 'text-slate-600 border-transparent group-hover:text-sky-600'}`;
      }
      return `transition-all border-b-2 pb-1 ${isActive ? 'text-white border-white' : 'text-sky-100 border-transparent group-hover:text-white group-hover:border-white/50'}`;
    };

    return (
      <>
        <button onClick={() => navigateTo('home')} className={btnClass}>
          <span className={linkStyle('home')}>Home</span>
        </button>
        <button onClick={() => navigateTo('vision')} className={btnClass}>
          <span className={linkStyle('vision')}>Vision</span>
        </button>
        <button onClick={() => navigateTo('about')} className={btnClass}>
          <span className={linkStyle('about')}>About Us</span>
        </button>
        <button onClick={() => navigateTo('contact')} className={btnClass}>
          <span className={linkStyle('contact')}>Contact Form</span>
        </button>
        <button onClick={() => navigateTo('admin')} className={btnClass} title="Admin Settings">
          <span className={`${linkStyle('admin')} flex items-center gap-2`}>
            {mobile ? 'Admin Settings' : <Settings size={20} />}
          </span>
        </button>
      </>
    );
  };

  return (
    <SiteProvider>
      <div className="min-h-screen flex flex-col w-full relative bg-white">
        <header className="w-full bg-sky-500 shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-auto min-h-[4.5rem] flex items-center justify-between py-3 relative">
          <div 
            className="flex items-center gap-3 cursor-pointer group flex-1 md:flex-initial" 
            onClick={() => setCurrentPage('home')}
          >
            <div className="w-10 h-10 bg-white text-sky-500 rounded font-black flex items-center justify-center text-xl shadow-sm group-hover:scale-105 transition-transform shrink-0">
              <Laptop size={22} strokeWidth={2.5} />
            </div>
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase truncate pr-4">
              Ositechnology
            </span>
          </div>

          <nav className="hidden md:flex items-center justify-center gap-5 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
            <NavLinks />
          </nav>
          
          <div className="hidden md:block flex-1"></div>

          <button 
            className="md:hidden text-white p-2 rounded-lg hover:bg-sky-600 transition focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t border-slate-100 flex flex-col px-6 py-4 z-50">
            <NavLinks mobile />
          </div>
        )}
      </header>

      <main className="flex-1 w-full flex flex-col">
        {currentPage === 'home' && <Home onNavigateToGallery={handleNavigateToGallery} />}
        {currentPage === 'vision' && <Vision />}
        {currentPage === 'about' && <About />}
        {currentPage === 'contact' && <Contact />}
        {currentPage === 'admin' && <Admin />}
        {currentPage === 'gallery' && selectedGalleryId && (
          <Gallery categoryId={selectedGalleryId} onBack={() => { setCurrentPage('home'); window.scrollTo(0, 0); }} />
        )}
      </main>

      <footer className="w-full bg-slate-50 border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-3 mb-6 md:mb-0 grayscale opacity-80">
            <div className="w-8 h-8 bg-slate-800 text-white rounded font-bold flex items-center justify-center text-lg">
              O
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800 uppercase">
              Ositechnology
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Facebook icon */}
            <a href="#" className="text-slate-400 hover:text-sky-600 transition-colors" aria-label="Facebook">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"/>
              </svg>
            </a>
            {/* Instagram icon */}
            <a href="https://www.instagram.com/ositakingsley11" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-pink-600 transition-colors" aria-label="Instagram">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"/>
              </svg>
            </a>
            {/* TikTok icon */}
            <a href="#" className="text-slate-400 hover:text-black transition-colors" aria-label="TikTok">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.23-1.11 4.41-2.91 5.76-1.67 1.26-3.87 1.69-5.91 1.25-2.18-.46-4.08-1.84-5.07-3.84-.96-1.92-1.07-4.2-.3-6.21.75-1.96 2.39-3.41 4.42-3.99.11-.03.22-.05.33-.08V13.8c-1.34.25-2.58.97-3.35 2.05-.8 1.11-1.05 2.58-.65 3.89.37 1.25 1.28 2.31 2.44 2.87 1.49.72 3.34.62 4.74-.29 1.28-.82 2.06-2.27 2.11-3.82.07-3.92.05-7.85.04-11.78.01-.22.02-.45.02-.67-.01-.01-.01-.01-.01-.02z"/>
              </svg>
            </a>
            {/* Email icon */}
            <a href="mailto:ositakingsley69@gmail.com" className="text-slate-400 hover:text-red-500 transition-colors" aria-label="Email">
              <svg fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="w-6 h-6">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </a>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} OSITECHNOLOGY. All rights reserved.
        </div>
      </footer>

        <WhatsAppButton />
      </div>
    </SiteProvider>
  );
}
