import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShoppingBag, Menu, X, ChevronRight, Play, Zap, 
  Activity, Flame, Crosshair, ArrowRight, Instagram, 
  Twitter, Youtube, Facebook, Star
} from 'lucide-react';

// --- MOCK DATA ---
const PRODUCTS = [
  { id: 1, name: 'Kinetic Original', category: 'Original', price: 2.99, rating: 4.9, image: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', color: 'bg-red-600', shadow: 'shadow-red-600/50' },
  { id: 2, name: 'Kinetic Zero', category: 'Sugar-Free', price: 2.99, rating: 4.8, image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', color: 'bg-cyan-500', shadow: 'shadow-cyan-500/50' },
  { id: 3, name: 'Kinetic Tropical', category: 'Editions', price: 3.49, rating: 4.7, image: 'https://images.unsplash.com/photo-1589227365533-cee630bd59bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', color: 'bg-yellow-500', shadow: 'shadow-yellow-500/50' },
  { id: 4, name: 'Kinetic Midnight', category: 'Editions', price: 3.49, rating: 4.9, image: 'https://images.unsplash.com/photo-1550837368-6538b8eb4db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', color: 'bg-purple-600', shadow: 'shadow-purple-600/50' },
];

const LIFESTYLE_CONTENT = [
  { id: 1, title: 'Extreme FMX', category: 'Sports', img: 'https://images.unsplash.com/photo-1518605368461-1e1252281a54?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', span: 'col-span-1 md:col-span-2 row-span-2' },
  { id: 2, title: 'Underground Stages', category: 'Music', img: 'https://images.unsplash.com/photo-1470229722913-7c090be5c520?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', span: 'col-span-1 row-span-1' },
  { id: 3, title: 'Pro League Finals', category: 'Gaming', img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', span: 'col-span-1 row-span-1' },
  { id: 4, title: 'Urban Parkour', category: 'Sports', img: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', span: 'col-span-1 md:col-span-2 row-span-1' },
];

const ATHLETES = [
  { id: 1, name: 'Alex Ryder', sport: 'Snowboarding', img: 'https://images.unsplash.com/photo-1469090680655-2766ec3c690a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
  { id: 2, name: 'Marcus "Veno" Lin', sport: 'Esports Pro', img: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
  { id: 3, name: 'Sarah Jenkins', sport: 'BMX Freestyle', img: 'https://images.unsplash.com/photo-1517056037043-41f87ab2d385?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
];

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [timeLeft, setTimeLeft] = useState(259200); // 3 days in seconds
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [hasShownPopup, setHasShownPopup] = useState(false);

  // Scroll handler for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Exit Intent Logic
  useEffect(() => {
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 && !hasShownPopup) {
        setShowExitPopup(true);
        setHasShownPopup(true);
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasShownPopup]);

  // Countdown timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return { d, h, m, s };
  };

  const timer = formatTime(timeLeft);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setCartOpen(true);
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const filteredProducts = activeCategory === 'All' ? PRODUCTS : PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-red-600 selection:text-white overflow-x-hidden">
      {/* Custom Styles for Glows & Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;700;900&family=Inter:wght@400;500;700&display=swap');
        
        body { font-family: 'Inter', sans-serif; }
        h1, h2, h3, h4, .font-display { font-family: 'Oswald', sans-serif; text-transform: uppercase; }
        
        .glow-red { box-shadow: 0 0 20px rgba(255, 0, 0, 0.6); }
        .glow-blue { box-shadow: 0 0 20px rgba(0, 212, 255, 0.6); }
        .text-glow-red { text-shadow: 0 0 10px rgba(255, 0, 0, 0.8); }
        .text-glow-blue { text-shadow: 0 0 10px rgba(0, 212, 255, 0.8); }
        
        .clip-slant { clip-path: polygon(0 0, 100% 0, 95% 100%, 5% 100%); }
        .clip-btn { clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%); }

        @keyframes energyWave {
          0% { transform: scale(1) translate(0, 0) rotate(0deg); opacity: 0.3; }
          50% { transform: scale(1.1) translate(2%, 2%) rotate(2deg); opacity: 0.5; }
          100% { transform: scale(1) translate(0, 0) rotate(0deg); opacity: 0.3; }
        }
        .energy-bg {
          background: radial-gradient(circle at 50% 50%, rgba(255,0,0,0.15) 0%, rgba(0,0,0,1) 60%);
          animation: energyWave 8s ease-in-out infinite;
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #FF0000; }
      `}} />

      {/* --- NAVIGATION --- */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/90 backdrop-blur-md py-3 border-b border-white/10' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="#" className="text-3xl font-display font-black tracking-tighter flex items-center gap-1">
              <Zap className="text-red-600 fill-red-600 h-8 w-8" />
              KINETIC
            </a>
            <div className="hidden md:flex items-center gap-6 font-display text-sm tracking-wider">
              <a href="#products" className="hover:text-red-500 transition-colors">Products</a>
              <a href="#culture" className="hover:text-red-500 transition-colors">Culture</a>
              <a href="#athletes" className="hover:text-red-500 transition-colors">Athletes</a>
              <a href="#events" className="hover:text-red-500 transition-colors">Events</a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCartOpen(true)}
              className="relative p-2 hover:text-red-500 transition-colors"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 font-display text-2xl pt-20">
          <a href="#products" onClick={() => setMobileMenuOpen(false)} className="hover:text-red-500">Products</a>
          <a href="#culture" onClick={() => setMobileMenuOpen(false)} className="hover:text-red-500">Culture</a>
          <a href="#athletes" onClick={() => setMobileMenuOpen(false)} className="hover:text-red-500">Athletes</a>
          <a href="#events" onClick={() => setMobileMenuOpen(false)} className="hover:text-red-500">Events</a>
        </div>
      )}

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 z-0 bg-black">
          <img 
            src="https://images.unsplash.com/photo-1541252260730-0412e8e2108e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Action Background" 
            className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10"></div>
          <div className="absolute inset-0 energy-bg z-10 pointer-events-none"></div>
        </div>

        <div className="container relative z-20 mx-auto px-6 text-center mt-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/20 border border-red-600/50 text-red-500 font-bold text-sm mb-6 uppercase tracking-widest backdrop-blur-sm animate-pulse">
            <Activity className="w-4 h-4" /> New Formula Available
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-black tracking-tighter leading-none mb-6">
            UNLOCK YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-cyan-500 text-glow-red">ENERGY</span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-300 max-w-2xl mx-auto mb-10 font-medium">
            Maximum performance. Zero compromise. Fuel your lifestyle with the ultimate adrenaline catalyst.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="clip-btn bg-red-600 hover:bg-red-500 text-white font-display text-lg px-10 py-4 uppercase tracking-wider transition-all duration-300 glow-red flex items-center gap-2 group">
              Shop Now 
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="clip-btn bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-display text-lg px-10 py-4 uppercase tracking-wider transition-all duration-300 flex items-center gap-2 group">
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform fill-white" />
              Watch Anthem
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-bounce opacity-50">
          <span className="text-xs uppercase tracking-widest font-display">Scroll</span>
          <div className="w-[1px] h-8 bg-white"></div>
        </div>
      </section>

      {/* --- PRODUCT SHOWCASE --- */}
      <section id="products" className="py-24 bg-black relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-4xl md:text-6xl font-display font-black tracking-tighter mb-4">THE ARSENAL</h2>
              <p className="text-gray-400 max-w-md">Choose your fuel. Every can is engineered for specific performance needs.</p>
            </div>
            
            <div className="flex gap-2 bg-white/5 p-1 rounded-lg backdrop-blur-sm border border-white/10">
              {['All', 'Original', 'Sugar-Free', 'Editions'].map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 font-display text-sm tracking-wider uppercase rounded transition-all ${
                    activeCategory === cat ? 'bg-white text-black font-bold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div 
                key={product.id} 
                className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-500 flex flex-col"
              >
                {/* Product Image Area */}
                <div className="relative h-80 p-6 flex items-center justify-center overflow-hidden bg-gradient-to-b from-transparent to-black/50">
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${product.color}`}></div>
                  {/* Simulated Can Image */}
                  <div className={`relative z-10 w-24 h-56 rounded-xl border-2 border-white/20 bg-gradient-to-br from-gray-800 to-black flex items-center justify-center transform group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 ${product.shadow}`}>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 rounded-xl"></div>
                    <div className={`w-full h-2/3 ${product.color} opacity-80 absolute bottom-0 rounded-b-xl mix-blend-overlay`}></div>
                    <Zap className="w-10 h-10 text-white fill-white z-20" />
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-6 flex-1 flex flex-col justify-end relative z-20 backdrop-blur-md border-t border-white/5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-xs text-red-500 font-bold tracking-widest uppercase block mb-1">{product.category}</span>
                      <h3 className="text-xl font-display font-bold uppercase">{product.name}</h3>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-yellow-500" />
                      <span className="text-sm font-bold text-white">{product.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-6">
                    <span className="text-2xl font-bold">${product.price}</span>
                    <button 
                      onClick={() => addToCart(product)}
                      className="bg-white text-black p-3 rounded-full hover:bg-red-600 hover:text-white transition-colors glow-on-hover"
                    >
                      <ShoppingBag className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- BENEFITS STRIP --- */}
      <section className="border-y border-white/10 bg-black py-10 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="flex flex-col items-center gap-3 p-4">
              <Zap className="w-10 h-10 text-cyan-400" />
              <h4 className="font-display text-xl uppercase tracking-wider">Instant Energy</h4>
              <p className="text-sm text-gray-400">Formulated for rapid absorption and immediate focus.</p>
            </div>
            <div className="flex flex-col items-center gap-3 p-4">
              <Crosshair className="w-10 h-10 text-red-600" />
              <h4 className="font-display text-xl uppercase tracking-wider">Laser Focus</h4>
              <p className="text-sm text-gray-400">Nootropic blend for enhanced cognitive performance.</p>
            </div>
            <div className="flex flex-col items-center gap-3 p-4">
              <Activity className="w-10 h-10 text-yellow-500" />
              <h4 className="font-display text-xl uppercase tracking-wider">Zero Crash</h4>
              <p className="text-sm text-gray-400">Sustained release matrix prevents the mid-day slump.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- LIFESTYLE / CONTENT GRID --- */}
      <section id="culture" className="py-24 bg-zinc-950">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl md:text-6xl font-display font-black tracking-tighter">THE CULTURE</h2>
            <a href="#" className="hidden md:flex items-center gap-2 text-red-500 font-bold hover:text-red-400 transition-colors uppercase tracking-wider text-sm">
              View All Content <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[300px]">
            {LIFESTYLE_CONTENT.map((item) => (
              <div key={item.id} className={`group relative rounded-xl overflow-hidden cursor-pointer ${item.span}`}>
                <img 
                  src={item.img} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                  <span className="bg-red-600 text-white text-xs font-bold uppercase tracking-widest px-2 py-1 rounded w-max mb-2">
                    {item.category}
                  </span>
                  <h3 className="text-2xl font-display font-bold uppercase group-hover:text-red-500 transition-colors">
                    {item.title}
                  </h3>
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50">
                      <Play className="w-6 h-6 fill-white ml-1" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- EVENTS / CAMPAIGN BANNER --- */}
      <section id="events" className="relative py-24 bg-red-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
        
        <div className="container relative z-10 mx-auto px-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-red-200 font-bold mb-4 uppercase tracking-widest text-sm">
              <Flame className="w-4 h-4" /> Global Tournament
            </div>
            <h2 className="text-5xl md:text-7xl font-display font-black tracking-tighter mb-6 uppercase text-glow-red">
              Apex Rivals 2026
            </h2>
            <p className="text-lg md:text-xl text-gray-200 mb-8 font-medium">
              The ultimate showdown in extreme sports and esports. Watch the world's best compete for the Kinetic Crown.
            </p>
            
            {/* Countdown */}
            <div className="flex gap-4 mb-8">
              {Object.entries(timer).map(([unit, value]) => (
                <div key={unit} className="flex flex-col items-center">
                  <div className="bg-black/50 backdrop-blur-sm border border-white/20 w-16 h-16 md:w-20 md:h-20 rounded-lg flex items-center justify-center text-2xl md:text-4xl font-display font-bold">
                    {value.toString().padStart(2, '0')}
                  </div>
                  <span className="text-xs uppercase tracking-widest mt-2 font-bold text-red-200">{unit}</span>
                </div>
              ))}
            </div>

            <button className="bg-white text-black hover:bg-black hover:text-white font-display text-lg px-8 py-3 uppercase tracking-wider transition-all duration-300 rounded">
              Get Tickets
            </button>
          </div>
        </div>
      </section>

      {/* --- ATHLETES SECTION --- */}
      <section id="athletes" className="py-24 bg-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-display font-black tracking-tighter mb-4">THE TEAM</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Fueled by Kinetic. Meet the athletes pushing the boundaries of human potential.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ATHLETES.map(athlete => (
              <div key={athlete.id} className="group relative overflow-hidden rounded-xl aspect-[3/4] cursor-pointer">
                <img 
                  src={athlete.img} 
                  alt={athlete.name} 
                  className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-red-500 font-bold uppercase tracking-widest text-sm mb-2 block">
                    {athlete.sport}
                  </span>
                  <h3 className="text-3xl font-display font-bold uppercase mb-4">{athlete.name}</h3>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 text-sm font-bold uppercase tracking-wider border-b-2 border-red-600 pb-1">
                    View Profile <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SOCIAL PROOF / IG GRID --- */}
      <section className="py-2 border-y border-white/10 overflow-hidden bg-black flex whitespace-nowrap">
         {/* Marquee effect */}
         <div className="animate-[marquee_20s_linear_infinite] flex items-center gap-8 text-2xl font-display font-black text-white/20 uppercase tracking-widest">
            <span>#KineticEnergy</span> <Zap className="w-6 h-6 inline" />
            <span>#UnlockYourPotential</span> <Zap className="w-6 h-6 inline" />
            <span>#FuelTheFire</span> <Zap className="w-6 h-6 inline" />
            <span>#KineticEnergy</span> <Zap className="w-6 h-6 inline" />
            <span>#UnlockYourPotential</span> <Zap className="w-6 h-6 inline" />
            <span>#FuelTheFire</span> <Zap className="w-6 h-6 inline" />
         </div>
      </section>

      {/* --- EMAIL CAPTURE --- */}
      <section className="py-24 bg-zinc-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="container mx-auto px-6 relative z-10 text-center max-w-3xl">
          <Zap className="w-16 h-16 text-white mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-display font-black tracking-tighter mb-4 uppercase">Join The Movement</h2>
          <p className="text-gray-400 mb-8 text-lg">
            Sign up for exclusive drops, early event access, and secret flavor releases.
          </p>
          
          <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="ENTER YOUR EMAIL" 
              className="flex-1 bg-black border border-white/20 rounded px-6 py-4 text-white focus:outline-none focus:border-red-600 focus:glow-red transition-all font-display tracking-wider"
              required
            />
            <button type="submit" className="bg-white text-black hover:bg-red-600 hover:text-white font-display font-bold px-8 py-4 uppercase tracking-wider rounded transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </form>
          <p className="text-xs text-gray-600 mt-4">By subscribing, you agree to our terms and conditions.</p>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-black pt-20 pb-10 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <a href="#" className="text-3xl font-display font-black tracking-tighter flex items-center gap-1 mb-6">
                <Zap className="text-red-600 fill-red-600 h-8 w-8" />
                KINETIC
              </a>
              <p className="text-gray-400 text-sm mb-6">
                Fueling the bold. Kinetic Energy is designed for those who push past the limit and redefine what's possible.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-600 transition-colors"><Instagram className="w-5 h-5" /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-600 transition-colors"><Twitter className="w-5 h-5" /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-600 transition-colors"><Youtube className="w-5 h-5" /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-600 transition-colors"><Facebook className="w-5 h-5" /></a>
              </div>
            </div>
            
            <div>
              <h4 className="font-display font-bold uppercase tracking-wider mb-6">Products</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Original Energy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sugar-Free Zero</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Limited Editions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Apparel & Gear</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-display font-bold uppercase tracking-wider mb-6">Company</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Athletes</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-display font-bold uppercase tracking-wider mb-6">Support</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shipping & Returns</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Store Locator</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Wholesale</a></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 text-xs text-gray-500">
            <p>&copy; 2026 Kinetic Energy Drink. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* --- CART DRAWER OVERLAY --- */}
      {cartOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCartOpen(false)}></div>
          <div className="relative w-full max-w-md bg-zinc-950 h-full shadow-2xl flex flex-col border-l border-white/10 transform transition-transform duration-300">
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black">
              <h2 className="text-2xl font-display font-black uppercase flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-red-600" /> Your Cart
              </h2>
              <button onClick={() => setCartOpen(false)} className="p-2 hover:text-red-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {cartItems.length === 0 ? (
                <div className="text-center text-gray-500 mt-20 flex flex-col items-center">
                  <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
                  <p className="font-display text-xl uppercase tracking-wider">Your cart is empty</p>
                  <button onClick={() => setCartOpen(false)} className="mt-6 text-red-600 hover:text-red-500 underline uppercase text-sm font-bold tracking-wider">
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 bg-white/5 p-4 rounded-xl border border-white/5 relative group">
                    <button 
                      onClick={() => setCartItems(prev => prev.filter(i => i.id !== item.id))}
                      className="absolute top-2 right-2 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className={`w-20 h-24 rounded-lg flex items-center justify-center ${item.color} bg-opacity-20`}>
                      <Zap className={`w-8 h-8 ${item.color.replace('bg-', 'text-')} fill-current`} />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-gray-500">{item.category}</span>
                        <h4 className="font-display font-bold uppercase leading-tight">{item.name}</h4>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold">${item.price}</span>
                        <div className="flex items-center gap-3 bg-black rounded-full px-3 py-1 border border-white/10">
                          <button 
                            onClick={() => setCartItems(prev => prev.map(i => i.id === item.id ? { ...i, qty: Math.max(1, i.qty - 1) } : i))}
                            className="text-gray-400 hover:text-white"
                          >-</button>
                          <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                          <button 
                            onClick={() => setCartItems(prev => prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i))}
                            className="text-gray-400 hover:text-white"
                          >+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Upsell inside cart */}
              {cartItems.length > 0 && cartTotal < 15 && (
                 <div className="p-4 bg-red-600/10 border border-red-600/30 rounded-xl mt-8">
                    <p className="text-sm text-red-200 mb-2">🔥 Add <span className="font-bold text-white">${(15 - cartTotal).toFixed(2)}</span> more to unlock <strong>FREE SHIPPING</strong>!</p>
                    <div className="w-full bg-black h-2 rounded-full overflow-hidden">
                       <div className="bg-red-600 h-full transition-all duration-500" style={{ width: `${(cartTotal / 15) * 100}%`}}></div>
                    </div>
                 </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-6 bg-black border-t border-white/10">
                <div className="flex justify-between items-center mb-4 text-lg">
                  <span className="text-gray-400 uppercase tracking-wider font-display text-sm">Subtotal</span>
                  <span className="font-display font-bold text-2xl">${cartTotal.toFixed(2)}</span>
                </div>
                <button className="w-full bg-red-600 hover:bg-red-500 text-white font-display font-bold text-lg py-4 rounded uppercase tracking-widest transition-colors glow-red flex justify-center items-center gap-2">
                  Checkout <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- EXIT INTENT POPUP --- */}
      {showExitPopup && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowExitPopup(false)}></div>
          <div className="relative bg-zinc-950 border border-white/20 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/20 transform scale-100 animate-[bounce_0.5s_ease-out]">
            <button 
              onClick={() => setShowExitPopup(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="h-40 bg-[url('https://images.unsplash.com/photo-1550837368-6538b8eb4db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center relative">
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent"></div>
            </div>
            <div className="p-8 text-center -mt-10 relative z-10">
              <span className="inline-block bg-cyan-500 text-black font-black uppercase text-xs tracking-widest px-3 py-1 rounded-full mb-4">
                Wait! Don't Miss Out
              </span>
              <h3 className="text-3xl font-display font-black uppercase mb-2">Claim Your 15% Off</h3>
              <p className="text-gray-400 mb-6">First time trying Kinetic? Use code <strong className="text-white">ENERGY15</strong> at checkout for 15% off your entire first order.</p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => { setShowExitPopup(false); setCartOpen(true); }}
                  className="w-full bg-white text-black font-display font-bold py-4 uppercase tracking-wider rounded hover:bg-cyan-400 transition-colors"
                >
                  Apply Discount & Shop
                </button>
                <button 
                  onClick={() => setShowExitPopup(false)}
                  className="text-gray-500 hover:text-white text-sm uppercase tracking-wider mt-2"
                >
                  No thanks, I prefer paying full price
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}} />
    </div>
  );
}
