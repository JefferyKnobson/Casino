import { useCallback, useEffect, useState } from 'react';
import ReactConfetti from 'react-confetti';

interface ConfettiExplosionProps {
  active: boolean;
  duration?: number;  // Duration in milliseconds
  particleCount?: number;
  colors?: string[];
  onComplete?: () => void;
}

const ConfettiExplosion = ({
  active,
  duration = 3000,
  particleCount = 200,
  colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'],
  onComplete,
}: ConfettiExplosionProps) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [showConfetti, setShowConfetti] = useState(false);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Control confetti display
  useEffect(() => {
    if (active) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
        if (onComplete) {
          onComplete();
        }
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [active, duration, onComplete]);

  // Handle recycle prop to start/stop confetti
  const recycle = useCallback(() => showConfetti, [showConfetti]);

  if (!showConfetti) return null;

  return (
    <ReactConfetti
      width={windowSize.width}
      height={windowSize.height}
      numberOfPieces={particleCount}
      recycle={recycle()}
      colors={colors}
      gravity={0.25} // Slightly increased gravity for faster fall
      tweenDuration={duration}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000,
        pointerEvents: 'none', // Allow interaction with elements behind the confetti
      }}
    />
  );
};

export default ConfettiExplosion;