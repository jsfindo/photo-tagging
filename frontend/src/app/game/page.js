"use client";

import React, { useState } from 'react';

export default function GamePage() {
  // Coordinates and visibility for the active selection menu (Temporary Red Circle)
  const [menuPosition, setMenuPosition] = useState(null); 
  
  // Permanent collection of successfully cleared characters (Permanent Green Circles)
  const [foundCharacters, setFoundCharacters] = useState([]);

  const handleImageClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    const containerWidth = rect.width;
    const containerHeight = rect.height;

    const menuWidth = 112; 
    const menuHeight = 120; 

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

  const handleSelectCharacter = async (characterName) => {
    if (!menuPosition) return;

    // Check if this character has already been found to prevent duplicate hits
    if (foundCharacters.some(char => char.name === characterName)) {
      alert(`You already found Letter ${characterName}!`);
      setMenuPosition(null);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/validate', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterName: characterName,
          clickedX: menuPosition.x,
          clickedY: menuPosition.y
        })
      });

      const data = await response.json();

      if (data.found) {
        alert(`🎉 Awesome job! You found Letter ${characterName}!`);
        
        // Save to permanent array so the circle stays and displays green
        setFoundCharacters((prev) => [
          ...prev,
          { name: characterName, x: menuPosition.x, y: menuPosition.y }
        ]);
      } else {
        alert(`❌ Not quite! That isn't where Letter ${characterName} is hidden.`);
      }

    } catch (err) {
      console.error("Failed to validate target coordinate hit:", err);
    }

    // Dismiss the temporary red marker and dropdown menu panel
    setMenuPosition(null);
  };

  return (
    <main className="min-h-screen bg-slate-100 flex flex-col items-center p-6 relative">
      <header className="w-full max-w-4xl bg-white border p-4 rounded-xl shadow-sm mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Alphabet Target Search</h2>
          <p className="text-sm text-slate-500">Find W and O. Found targets will lock green on screen!</p>
        </div>
        <div className="flex gap-2">
          {['W', 'Y'].map((char) => {
            const isFound = foundCharacters.some(c => c.name === char);
            return (
              <span 
                key={char} 
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  isFound ? 'bg-green-100 text-green-700 line-through' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {char} {isFound ? '✓' : '?' }
              </span>
            );
          })}
        </div>
      </header>

      {/* Picture Display Board Frame */}
      <div className="w-full max-w-4xl border-4 border-white shadow-2xl rounded-xl overflow-hidden bg-slate-300 relative">
        <img
          src="https://images.unsplash.com/photo-1509335329374-47bce994ca52?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Alphabet Find Target Map"
          onClick={handleImageClick}
          className="cursor-crosshair block select-none w-full h-auto object-cover"
        />

        {/* 🟢 Render Permanent Green Circles for Found Characters */}
        {foundCharacters.map((char, index) => (
          <div 
            key={index}
            className="absolute border-4 border-green-500 bg-green-500/20 rounded-full pointer-events-none shadow-md z-30 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-green-700 text-[10px] font-black"
            style={{ 
              top: `${char.y}px`, 
              left: `${char.x}px`,
              width: '42px',
              height: '42px'
            }}
          >
            {char.name}
          </div>
        ))}

        {/* 🔴 Temporary Selection UI (Only displays when choosing an item) */}
        {menuPosition && (
          <>
            <div 
              className="absolute border-4 border-red-500 bg-red-500/20 rounded-full pointer-events-none shadow-md z-40 transform -translate-x-1/2 -translate-y-1/2"
              style={{ 
                top: `${menuPosition.y}px`, 
                left: `${menuPosition.x}px`,
                width: '40px',
                height: '40px'
              }}
            />

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
