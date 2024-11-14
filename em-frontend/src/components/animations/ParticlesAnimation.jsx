import React, { useEffect } from 'react';

export default function ParticlesAnimation() {
  useEffect(() => {
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.left = `${Math.random() * 100}vw`;
      particle.style.animationDuration = `${Math.random() * 2 + 3}s`;
      const size = Math.random() * 15 + 5;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.backgroundColor = [
        'var(--primary-color)',
        'var(--primary-color-2)',
        'var(--primary-color-3)',
        'var(--primary-color-4)',
        'var(--secondary-color)',
      ][Math.floor(Math.random() * 5)];
      document.querySelector('.animation-container').appendChild(particle);

      particle.addEventListener('animationend', () => {
        particle.remove();
      });
    };

    const intervalId = setInterval(createParticle, 300);

    return () => clearInterval(intervalId);
  }, []);

  return <div className="animation-container" />;
}
