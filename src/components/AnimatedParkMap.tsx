import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export default function AnimatedParkMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const carsRef = useRef<(HTMLDivElement | null)[]>([]);
  const coasterRef = useRef<SVGGElement>(null);

  useGSAP(() => {
    // Ferris Wheel main rotation
    gsap.to(wheelRef.current, {
      rotation: 360,
      duration: 12,
      repeat: -1,
      ease: "none",
      transformOrigin: "center center"
    });

    // Cars counter-rotation to stay upright
    gsap.to(carsRef.current, {
      rotation: -360, // Counter-rotate so they don't tip over
      duration: 12,
      repeat: -1,
      ease: "none",
      transformOrigin: "center top"
    });

    // Roller Coaster motion (mapped to the SVG viewBox 0 0 200 100)
    // Coaster SVG coordinates matches track Q curve points.
    const tl = gsap.timeline({ repeat: -1 });
    // Offset Y by 4 to place wheels on the track line
    tl.set(coasterRef.current, { x: 0, y: 76, rotation: 0 })
      .to(coasterRef.current, { x: 80, y: 16, rotation: -35, ease: "sine.inOut", duration: 1.2 })
      .to(coasterRef.current, { x: 150, y: 46, rotation: 25, ease: "sine.inOut", duration: 1.2 })
      .to(coasterRef.current, { x: 200, y: 76, rotation: 0, ease: "sine.inOut", duration: 0.8 })
      .to(coasterRef.current, { x: 250, y: 76, duration: 1 }); // drive off screen, delay before repeat

    // Clouds
    gsap.to('.cloud-layer', {
      x: '100vw',
      duration: 35,
      repeat: -1,
      ease: "none"
    });

  }, { scope: containerRef });

  // Add parallax effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const xPos = (clientX / innerWidth - 0.5) * 2;
    const yPos = (clientY / innerHeight - 0.5) * 2;

    gsap.to('.parallax-bg', { x: xPos * -20, y: yPos * -10, duration: 0.5, ease: "power2.out" });
    gsap.to('.parallax-mg', { x: xPos * -5, y: yPos * -5, duration: 0.5, ease: "power2.out" });
    gsap.to('.parallax-fg', { x: xPos * 15, y: yPos * 10, duration: 0.5, ease: "power2.out" });
  };
  
  const handleMouseLeave = () => {
    gsap.to('.parallax-bg, .parallax-mg, .parallax-fg', { x: 0, y: 0, duration: 1, ease: 'power3.out' });
  };

  const ferrisCars = Array.from({ length: 8 });

  return (
    <div 
      ref={containerRef}
      className="relative h-48 md:h-64 mb-6 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gradient-to-b from-sky-300 to-green-200"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
      
      {/* Background (Clouds) */}
      <div className="parallax-bg absolute inset-0 text-5xl opacity-70">
        <div className="cloud-layer absolute top-4 -left-32 tracking-[10rem]">☁️  ☁️</div>
        <div className="cloud-layer absolute top-12 -left-64 tracking-[15rem]" style={{ animationDelay: '-15s' }}>☁️</div>
      </div>

      {/* Midground (Landscape/Decoration) */}
      <div className="parallax-mg absolute inset-0 flex items-end justify-center pointer-events-none">
         {/* Simple CSS hills to give depth */}
         <div className="w-[150%] h-32 bg-gradient-to-t from-green-500/80 to-green-400 rounded-[50%] absolute -bottom-16 blur-[1px]"></div>
         <div className="w-[120%] h-24 bg-gradient-to-t from-green-400 to-green-300 rounded-[50%] absolute -bottom-8"></div>
      </div>

      {/* Foreground (Rides) */}
      <div className="parallax-fg absolute inset-0 pointer-events-none">
        
        {/* CSS Ferris Wheel */}
        <div className="absolute left-[15%] top-1/2 -translate-y-1/2 w-32 h-32 md:w-40 md:h-40">
          {/* Base Stand */}
          <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[80px] border-b-slate-400 drop-shadow-md z-0" />
          <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-1.5 bg-slate-300 h-[80px] z-0" />
          
          {/* Wheel */}
          <div ref={wheelRef} className="absolute inset-0 rounded-full border-4 border-amber-300 drop-shadow-xl z-10 flex items-center justify-center">
            {/* Spokes */}
            <div className="absolute w-full h-1 bg-amber-200/50" />
            <div className="absolute w-full h-1 bg-amber-200/50 rotate-45" />
            <div className="absolute w-full h-1 bg-amber-200/50 rotate-90" />
            <div className="absolute w-full h-1 bg-amber-200/50 -rotate-45" />
            <div className="absolute w-full h-full border-2 border-amber-200/50 rounded-full scale-50" />
            
            {/* Center Hub */}
            <div className="w-5 h-5 rounded-full bg-red-500 z-20 shadow-inner border-2 border-white flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-yellow-300 rounded-full"></div>
            </div>
            
            {/* Cars */}
            {ferrisCars.map((_, i) => {
              const angle = (i / ferrisCars.length) * Math.PI * 2;
              const radius = 50; // percentage
              return (
                <div 
                  key={i}
                  className="absolute w-6 h-6 z-30 pointer-events-none"
                  style={{
                    top: `${50 + Math.sin(angle) * radius}%`,
                    left: `${50 + Math.cos(angle) * radius}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div 
                    ref={el => carsRef.current[i] = el}
                    className="w-full h-full bg-gradient-to-b from-pink-400 to-purple-500 rounded-b-xl border border-white/50 shadow-md origin-top overflow-hidden"
                  >
                     <div className="w-full h-1/2 bg-white/30 backdrop-blur-sm" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CSS/SVG Roller Coaster */}
        <div className="absolute right-[5%] bottom-[10%] w-[200px] h-[100px] md:w-[250px] md:h-[120px]">
          <svg className="absolute inset-0 w-full h-full overflow-visible drop-shadow-xl" viewBox="0 0 200 100" preserveAspectRatio="none">
            {/* Shadow track */}
            <path d="M 0 80 Q 50 80, 80 20 T 150 50 T 200 80" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="8" strokeLinecap="round" transform="translate(0, 5)" />
            
            {/* Main track lines */}
            <path d="M 0 80 Q 50 80, 80 20 T 150 50 T 200 80" fill="none" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
            <path d="M 0 80 Q 50 80, 80 20 T 150 50 T 200 80" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" />
            
            {/* Supports */}
            <line x1="80" y1="20" x2="80" y2="100" stroke="#cbd5e1" strokeWidth="4" />
            <line x1="150" y1="50" x2="150" y2="100" stroke="#cbd5e1" strokeWidth="4" />
            <line x1="40" y1="70" x2="40" y2="100" stroke="#cbd5e1" strokeWidth="4" />
            <line x1="115" y1="35" x2="115" y2="100" stroke="#cbd5e1" strokeWidth="4" />

            {/* Coaster train animated as SVG group */}
            <g ref={coasterRef}>
              <rect x="-10" y="-6" width="20" height="10" rx="3" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" />
              {/* Wheels */}
              <circle cx="-5" cy="4" r="2" fill="#333" />
              <circle cx="5" cy="4" r="2" fill="#333" />
              {/* Highlight */}
              <rect x="-8" y="-4" width="6" height="3" rx="1" fill="#fca5a5" />
            </g>
          </svg>
        </div>

        {/* Hot Air Balloon (extra touch) */}
        <div className="absolute left-[45%] top-[10%] text-3xl drop-shadow-md animate-bounce">
          🎈
        </div>

      </div>
      
      <div className="absolute bottom-2 left-4 text-[10px] md:text-xs font-bold text-white/90 bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-md shadow-inner pointer-events-none">
        ✨ Hover to explore 3D view
      </div>
    </div>
  );
}
