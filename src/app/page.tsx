'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import Lenis from 'lenis';
import { ShieldPlus, QrCode, HeartPulse, Activity, ChevronRight, PhoneCall, Stethoscope, ArrowDown } from 'lucide-react';

export default function LandingPage() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return (
    <div className="bg-sky-50 font-sans text-slate-900 relative selection:bg-blue-200 selection:text-blue-900 overflow-hidden">
      
      {/* Background abstract elements that span the whole page */}
      <div className="fixed top-0 inset-x-0 h-screen pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-sky-200 rounded-full mix-blend-multiply filter blur-[120px] opacity-80 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] bg-blue-200 rounded-full mix-blend-multiply filter blur-[150px] opacity-70"></div>
      </div>

      {/* --- HERO SECTION (100vh) --- */}
      <section className="relative z-10 min-h-screen flex flex-col relative bg-gradient-to-b from-sky-300/40 via-sky-100/50 to-transparent">
        {/* Navigation */}
        <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2 text-white rounded-xl shadow-lg shadow-blue-500/20">
              <HeartPulse size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-blue-950 drop-shadow-sm">S.O.S</h1>
              <p className="text-[10px] sm:text-xs font-bold text-blue-500 tracking-[0.2em] uppercase leading-none mt-1">
                Save Our Souls
              </p>
            </div>
          </div>
          <div>
            <Link href="/register" className="group flex items-center gap-2 bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-blue-700 font-bold py-2 sm:py-2.5 px-6 rounded-full shadow-md transition-all hover:scale-105">
              Create Profile <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="flex-1 flex flex-col justify-center items-center text-center px-6 -mt-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-sky-300 bg-white/70 backdrop-blur-sm text-sky-800 font-bold text-sm mb-8 shadow-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
            </span>
            Protecting Lives Instantly
          </div>
          
          <h2 className="text-5xl md:text-8xl font-black text-slate-800 tracking-tight leading-[1.1] max-w-5xl mb-6 drop-shadow-sm">
            Your Life-Saving Digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">Identity</span>
          </h2>
          
          <p className="text-lg md:text-2xl text-slate-700 max-w-2xl mb-12 leading-relaxed font-medium drop-shadow-sm">
            Secure your critical medical information behind a highly-visible dynamic QR code. Instantly accessible when you need it most.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center">
            <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-4 px-10 rounded-full shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-1">
              Get Your QR Code
            </Link>
            <a href="#features" className="text-slate-600 hover:text-blue-700 font-semibold text-lg py-4 px-8 border border-transparent hover:border-slate-300 hover:bg-white rounded-full transition-all">
              See How It Works
            </a>
          </div>

          {/* Value Prop & Security in Hero */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl text-left relative z-20">
             <div className="bg-white/80 p-5 rounded-2xl shadow border border-slate-200/60 backdrop-blur-md hover:-translate-y-1 transition-transform">
               <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2"><ShieldPlus size={20} className="text-sky-500"/> Secure & Private</h4>
               <p className="text-sm text-slate-600 font-medium">Your health data is securely stored. Used only for emergency first responders.</p>
             </div>
             <div className="bg-white/80 p-5 rounded-2xl shadow border border-slate-200/60 backdrop-blur-md hover:-translate-y-1 transition-transform">
               <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2"><Activity size={20} className="text-sky-500"/> Why S.O.S?</h4>
               <p className="text-sm text-slate-600 font-medium">Knowing allergies & blood type instantly saves critical minutes during emergencies.</p>
             </div>
             <div className="bg-white/80 p-5 rounded-2xl shadow border border-slate-200/60 backdrop-blur-md hover:-translate-y-1 transition-transform">
               <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2"><HeartPulse size={20} className="text-red-500"/> Peace of Mind</h4>
               <p className="text-sm text-slate-600 font-medium">Carry your medical identity anywhere. Accessible immediately when scanned.</p>
             </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-sky-500 animate-bounce bg-white/50 p-3 rounded-full shadow-sm backdrop-blur-md">
          <ArrowDown size={32} />
        </div>
      </section>

      {/* --- FEATURES SECTION (Blending Gradient) --- */}
      <section id="features" className="relative z-10 py-32 px-6 bg-gradient-to-b from-transparent via-blue-50/80 to-sky-100/60 backdrop-blur-3xl border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h3 className="text-3xl md:text-5xl font-black mb-6 text-slate-900 drop-shadow-sm">Why Carry an S.O.S Profile?</h3>
            <p className="text-slate-600 text-xl max-w-3xl mx-auto font-light leading-relaxed">
              Every second counts in a medical emergency. Empower first responders by keeping your vital history immediately accessible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/80 p-10 rounded-[2.5rem] backdrop-blur-md border border-slate-200/60 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 group">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-400 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-500">
                <QrCode size={32} className="text-white" />
              </div>
              <h4 className="text-2xl font-bold mb-4 text-slate-800">Unique Yellow QR</h4>
              <p className="text-slate-600 leading-relaxed font-light text-lg">
                High-contrast dynamic code built to instantly grab attention. Fully scannable from any smartphone with zero extra apps required.
              </p>
            </div>
            
            <div className="bg-white/80 p-10 rounded-[2.5rem] backdrop-blur-md border border-slate-200/60 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 group">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-400 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-500">
                <ShieldPlus size={32} className="text-white" />
              </div>
              <h4 className="text-2xl font-bold mb-4 text-slate-800">Comprehensive Data</h4>
              <p className="text-slate-600 leading-relaxed font-light text-lg">
                Securely store critical history: blood group, drug and food allergies, ongoing conditions, and essential insurance details.
              </p>
            </div>

            <div className="bg-white/80 p-10 rounded-[2.5rem] backdrop-blur-md border border-slate-200/60 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 group">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-400 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-500">
                <PhoneCall size={32} className="text-white" />
              </div>
              <h4 className="text-2xl font-bold mb-4 text-slate-800">1-Click Emergency</h4>
              <p className="text-slate-600 leading-relaxed font-light text-lg">
                Responders can instantly dial family, friends, or national emergency numbers right from the scanned profile dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS (Blending Gradient) --- */}
      <section className="relative z-10 py-32 px-6 bg-gradient-to-b from-sky-100/60 via-blue-50/30 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24">
            <h3 className="text-sm font-bold tracking-[0.3em] text-blue-600 uppercase mb-4">Simple Process</h3>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900">How It Works in Seconds</h2>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center relative gap-12 md:gap-0">
            {/* Connection Line Desktop */}
            <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+2rem)] w-[70%] h-0.5 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>

            {/* Step 1 */}
            <div className="w-full md:w-1/3 flex flex-col items-center text-center relative z-10">
              <div className="w-24 h-24 rounded-full bg-white border-4 border-slate-200 flex items-center justify-center mb-8 shadow-lg text-blue-500">
                <Activity size={40} />
              </div>
              <h4 className="text-2xl font-bold text-slate-800 mb-3">1. Setup Profile</h4>
              <p className="text-slate-600 text-lg max-w-xs font-light">Input your vital statistics, allergies, and emergency contacts into our secure portal.</p>
            </div>

            {/* Step 2 */}
            <div className="w-full md:w-1/3 flex flex-col items-center text-center relative z-10">
              <div className="w-24 h-24 rounded-full bg-blue-600 border-4 border-blue-200 flex items-center justify-center mb-8 shadow-xl text-white scale-110">
                <QrCode size={40} />
              </div>
              <h4 className="text-2xl font-bold text-slate-800 mb-3">2. Get Your QR</h4>
              <p className="text-slate-600 text-lg max-w-xs font-light">Instantly receive your custom generated Yellow QR code built for maximum visual impact.</p>
            </div>

            {/* Step 3 */}
            <div className="w-full md:w-1/3 flex flex-col items-center text-center relative z-10">
              <div className="w-24 h-24 rounded-full bg-white border-4 border-slate-200 flex items-center justify-center mb-8 shadow-lg text-red-500">
                <Stethoscope size={40} />
              </div>
              <h4 className="text-2xl font-bold text-slate-800 mb-3">3. Rapid Output</h4>
              <p className="text-slate-600 text-lg max-w-xs font-light">Scanned by responders—all your life-saving data appears immediately on a single screen.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER CTA SECTION (Seamless blend to end) --- */}
      <footer className="relative z-10 bg-gradient-to-b from-white to-blue-50 py-32 px-6 text-center border-t border-slate-200">
        <div className="max-w-3xl mx-auto space-y-10">
          <HeartPulse size={64} className="text-blue-500 mx-auto opacity-80" />
          <h2 className="text-5xl font-black text-slate-900 leading-tight">Don&apos;t wait for an emergency.</h2>
          <p className="text-xl text-slate-600 font-light max-w-2xl mx-auto">
            Setup your S.O.S identity today. It takes just a few minutes, is completely free, and could be the difference between life and death.
          </p>
          <div className="pt-8">
            <Link href="/register" className="inline-flex items-center gap-3 bg-blue-600 text-white hover:bg-blue-700 font-bold text-xl py-5 px-12 rounded-full shadow-lg transition-all hover:scale-105">
              Create My Profile Now <ChevronRight size={24} />
            </Link>
          </div>
          <p className="text-slate-500 font-medium text-sm mt-16">&copy; {new Date().getFullYear()} S.O.S Web Service. Dedicated to saving lives.</p>
        </div>
      </footer>
    </div>
  );
}
