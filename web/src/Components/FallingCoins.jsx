import React, { useEffect, useState } from 'react';

const FallingCoins = ({ coinImages }) => {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    let isActive = true;
    let nextBatchTimeout = null;

    const dropBatch = () => {
      if (!isActive) return;

      const batchSize = 8;

      for (let i = 0; i < batchSize; i++) {
        setTimeout(() => {
          if (!isActive) return;

          const id = Date.now() + Math.random() + i;
          const left = Math.random() * 100;
          const delay = i * 0.3;
          const duration = 12 + Math.random() * 6;
          const size = 50 + Math.random() * 60;
          const rotationDirection = Math.random() > 0.5 ? 1 : -1;
          const img = coinImages[Math.floor(Math.random() * coinImages.length)];

          const newCoin = { 
            id, 
            left, 
            delay, 
            duration, 
            size, 
            rotationDirection, 
            img 
          };

          setCoins(prev => [...prev, newCoin]);

          setTimeout(() => {
            if (!isActive) return;
            setCoins(prev => prev.filter(c => c.id !== id));
          }, (duration + delay + 2) * 1000);
        }, i * 600);
      }

      if (isActive) {
        nextBatchTimeout = setTimeout(dropBatch, 18000 + Math.random() * 6000);
      }
    };

    setTimeout(dropBatch, 200 + Math.random() * 600);

    return () => {
      isActive = false;
      if (nextBatchTimeout) clearTimeout(nextBatchTimeout);
    };
  }, [coinImages]);

  return (
    <div className="falling-coins">
      {coins.map(coin => (
        <img
          key={coin.id}
          src={coin.img}
          alt="gold coin"
          className="falling-coins__coin"
          style={{
            left: `${coin.left}vw`,
            width: `${coin.size}px`,
            height: 'auto',
            animationDelay: `${coin.delay}s`,
            animationDuration: `${coin.duration}s`,
            animationDirection: coin.rotationDirection > 0 ? 'normal' : 'reverse'
          }}
        />
      ))}
    </div>
  );
};

export default FallingCoins;