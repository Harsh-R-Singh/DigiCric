import React from "react";

export default function Avatar() {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <div className="w-[320px] h-[320px] rounded-full border-4 border-primary flex items-center justify-center bg-gradient-to-br from-primary via-[#2b1c17] to-background-dark shadow-2xl animate-avatar-float">
          <svg width="200" height="200" viewBox="0 0 200 200">
            {/* Outer ring in theme cream */}
            <circle cx="100" cy="100" r="90" stroke="#f8ddd4" strokeWidth="6" fill="none" opacity="0.9" />
            
            {/* Head circle in theme dark brown with primary orange border */}
            <circle cx="100" cy="100" r="70" fill="#221610" stroke="#ec5b13" strokeWidth="4" />
            
            {/* Cheek details in primary orange */}
            <ellipse cx="70" cy="110" rx="12" ry="18" fill="#ec5b13" />
            <ellipse cx="130" cy="110" rx="12" ry="18" fill="#ec5b13" />
            
            {/* Pupils */}
            <circle cx="80" cy="100" r="8" fill="#fff" />
            <circle cx="120" cy="100" r="8" fill="#fff" />
            
            {/* Smile */}
            <path d="M85 130 Q100 145 115 130" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" />
            
            {/* Headphones in primary orange with cream borders */}
            <ellipse cx="40" cy="100" rx="15" ry="20" fill="#ec5b13" stroke="#f8ddd4" strokeWidth="3" opacity="0.95" />
            <ellipse cx="160" cy="100" rx="15" ry="20" fill="#ec5b13" stroke="#f8ddd4" strokeWidth="3" opacity="0.95" />
          </svg>
        </div>
      </div>
    </div>
  );
}
