import  { useEffect, useState } from 'react';
import FallingCoins from './FallingCoins';

const HeroSlider = ({ slides, handleSmoothScroll, coinImages }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = slides.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4000);

    return () => clearInterval(interval);
  }, [totalSlides]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="hero__slider-container">
      <FallingCoins coinImages={coinImages} />
      
      <div className="slider">
        <div className="slider__wrapper">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`slider__slide ${slide.className} ${currentSlide === index ? 'active' : ''}`}
              style={{
                backgroundImage: slide.bgImage ? `url(${slide.bgImage})` : 'none'
              }}
            >
              <div className="slider__content">
                <div className="slider__text">
                  <h2 className="slider__title">{slide.title}</h2>
                  <p className="slider__subtitle">{slide.subtitle}</p>
                  {slide.description && (
                    <p className="slider__description">{slide.description}</p>
                  )}
                  <button 
                    className="slider__button"
                    onClick={(e) => handleSmoothScroll(e, slide.buttonLink)}
                  >
                    {slide.buttonText}
                  </button>
                </div>

                <div className="slider__image-wrapper">
                  <img 
                    src={slide.image} 
                    alt={slide.title}
                    className="slider__image"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="slider__dots">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`slider__dot ${currentSlide === index ? 'slider__dot--active' : ''}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;