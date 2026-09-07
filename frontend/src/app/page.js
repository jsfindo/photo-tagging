"use client";

import React, { useState } from 'react';

export default function GamePage() {
  const [menuPosition, setMenuPosition] = useState(null); 

  const handleImageClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    const containerWidth = rect.width;
    const containerHeight = rect.height;

    const menuWidth = 112; 
    const menuHeight = 120; // Shorter height now since we only have 2 options

    let leftPos = x;
    if (x + menuWidth > containerWidth) {
      leftPos = x - menuWidth;
    }

    let topPos = y + 25; 
    if (y + 25 + menuHeight > containerHeight) {
      topPos = y - menuHeight - 10; 
    }

    setMenuPosition({ 
      x, 
      y, 
      renderLeft: leftPos, 
      renderTop: topPos 
    });
  };

  const handleSelectCharacter = (characterName) => {
    if (!menuPosition) return;
    
    // Logs the exact pixel coordinates you clicked to your browser console (F12) 
    // to help you easily find and save the true positions in your Prisma database!
    console.log(`DEV CHECK -> Character: ${characterName}, X: ${menuPosition.x}, Y: ${menuPosition.y}`);
    alert(`Selected: "${characterName}" at X: ${menuPosition.x}, Y: ${menuPosition.y}`);
    
    setMenuPosition(null);
  };

  return (
    <main className="min-h-screen bg-slate-100 flex flex-col items-center p-6 relative">
      <header className="w-full max-w-4xl bg-white border p-4 rounded-xl shadow-sm mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Alphabet Target Search</h2>
          <p className="text-sm text-slate-500">Click a letter to get its X/Y coordinates in the pop-up or console.</p>
        </div>
      </header>

      {/* Picture Display Board Frame */}
      <div className="w-full max-w-4xl border-4 border-white shadow-2xl rounded-xl overflow-hidden bg-slate-300 relative">
        <img
          src="https://unsplash.com"
          alt="Alphabet Find Target Map"
          onClick={handleImageClick}
          className="cursor-crosshair block select-none w-full h-auto object-cover"
        />

        {menuPosition && (
          <>
            {/* 🎯 Transparent Target Selection Ring */}
            <div 
              className="absolute border-4 border-red-500 bg-red-500/20 rounded-full pointer-events-none shadow-md z-40 transform -translate-x-1/2 -translate-y-1/2"
              style={{ 
                top: `${menuPosition.y}px`, 
                left: `${menuPosition.x}px`,
                width: '40px',
                height: '40px'
              }}
            />

            {/* Smart Edge-Aware Menu Selector with just 2 Options */}
            <div 
              className="absolute bg-white border border-slate-200 rounded-lg shadow-2xl py-1 w-28 z-50 animate-in fade-in zoom-in-95 duration-100"
              style={{ 
                top: `${menuPosition.renderTop}px`, 
                left: `${menuPosition.renderLeft}px` 
              }}
            >
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                Which Letter?
              </div>
              
              {/* Reduced array to speed up development loops */}
              {['W', 'Y'].map((char) => (
                <button
                  key={char}
                  onClick={() => handleSelectCharacter(char)}
                  className="w-full text-left px-3 py-1.5 text-sm text-slate-700 hover:bg-red-50 hover:text-red-600 font-semibold transition-colors"
                >
                  Letter {char}
                </button>
              ))}
              
              <button 
                onClick={() => setMenuPosition(null)}
                className="w-full text-left px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-50 border-t border-slate-100"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
