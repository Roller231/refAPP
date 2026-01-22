import React from 'react';
import './LoadingScreen.css';

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="loading-bg">
        <div className="loading-particles">
          {[...Array(30)].map((_, i) => (
            <div 
              key={i} 
              className="loading-particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${4 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
        
        <div className="loading-hexagons">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i} 
              className="loading-hex"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
                animationDelay: `${Math.random() * 2}s`,
                transform: `scale(${0.5 + Math.random() * 0.8})`
              }}
            />
          ))}
        </div>

        <div className="loading-glow loading-glow--1" />
        <div className="loading-glow loading-glow--2" />
        <div className="loading-glow loading-glow--3" />
      </div>

      <div className="loading-content">
        <div className="loading-logo">
          <div className="bee-container">
            <span className="bee-icon-large">🐝</span>
            <div className="bee-shine" />
          </div>
        </div>

        <div className="loading-brand">
          <h1 className="loading-title">BeaSmart</h1>
          <p className="loading-tagline">Build Value</p>
        </div>

        <div className="loading-bar-container">
          <div className="loading-bar">
            <div className="loading-bar-fill" />
            <div className="loading-bar-glow" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
