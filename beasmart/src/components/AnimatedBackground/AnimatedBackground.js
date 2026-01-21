import React from 'react';
import './AnimatedBackground.css';

const AnimatedBackground = () => {
  return (
    <div className="animated-bg">
      <div className="particles">
        {[...Array(50)].map((_, i) => (
          <div 
            key={i} 
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 8}s`
            }}
          />
        ))}
      </div>
      
      <div className="hexagons">
        {[...Array(12)].map((_, i) => (
          <div 
            key={i} 
            className="hexagon"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              transform: `scale(${0.5 + Math.random() * 1})`
            }}
          />
        ))}
      </div>

      <div className="glow-orbs">
        <div className="glow-orb glow-orb--1" />
        <div className="glow-orb glow-orb--2" />
        <div className="glow-orb glow-orb--3" />
      </div>

      <div className="sparkles">
        {[...Array(30)].map((_, i) => (
          <div 
            key={i} 
            className="sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${1.5 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="gradient-overlay" />
    </div>
  );
};

export default AnimatedBackground;
