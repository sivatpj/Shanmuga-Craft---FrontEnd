import React, { useEffect, useState } from 'react';
import Navigation from './Components/Navigation';
import HeroSlider from './Components/HeroSlider';
import ContactForm from './Components/ContactForm';
import Accordion from './Components/Accordion';
import GoldPrice  from './Components/GoldPriceTable';
import SilverPrice from './Components/SilverPriceTable';
import './styles/base.css';
import './darkmode.css';
import './styles/navigation.css';
import './styles/components.css';
import './styles/sections.css';
import './styles/why-us.css'; 
import './styles/aboutus.css'; 
import './styles/products.css';
import './styles/contact.css';
import coin from './images/coin.png';
import shanmugacraftlogo from './images/shanmugacraftlogblue.png'
import goldmake from './images/goldmake.jpeg';
import statue from './images/statue.jpg';
import techchaselogo from './images/techchaselogo.png';
import goldcoin from './images/goldcoin.png';
import silvercoin from './images/silvercoin.png';
import goldbg from './images/goldbg.jpg';
import silverbg from './images/silverbg.jpg';
import coinsize from './images/coinsize.png';
import sizebg from './images/sizebg.jpg';
import goldchain from './images/goldchain.png';
import goldring from './images/goldring.png';
import logo from './images/logo.png';

const HomePage = () => {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [selectedGoldCities,   setSelectedGoldCities]   = useState([]);
const [selectedSilverCities, setSelectedSilverCities] = useState([]);

  const sliderData = [
    {
      id: 1,
      className: "slider__slide--hero-main",
      title: "Welcome to the World of Pure Gold & Silver",
      subtitle: "Your Trusted Destination for Premium Gold & Silver Coins",
      buttonText: "Discover Collections",
      buttonLink: "#products",
      image: logo,
      bgImage: sizebg,
    },
    {
      id: 2,
      className: "slider__slide--gold",
      title: "Premium 916 Gold Coins",
      subtitle: "Pure • Certified • Hand-Crafted Elegance",
      description: 'Perfect for gifting, collection & investment.',
      image: goldcoin,
      bgImage: goldbg,
      buttonText: "View Collection",
      buttonLink: "#products"
    },
    {
      id: 3,
      className: "slider__slide--silver",
      title: "Timeless Silver Coins",
      subtitle: "Shiny • Elegant • Affordable Luxury",
      description: "Perfect for festivals, pooja & daily gifting.",
      image: silvercoin,
      bgImage: silverbg,
      buttonText: "Explore Silver",
      buttonLink: "#products"
    },
    {
      id: 4,
      className: "slider__slide--size",
      title: "Coins Available in All Sizes",
      subtitle: "1g, 2g, 4g, 8g, 10g and more",
      description: "Choose from a wide variety of gold and silver coin weights — 1g, 2g, 4g, 8g, 10g and more. Perfect for saving, collecting, and personal preference.",
      image: coinsize,
      bgImage: sizebg,
      buttonText: "Learn More",
      buttonLink: "#contact"
    }
  ];

  const coinImages = [coin];

const whyUsFeatures = [
  {
    icon: "fas fa-gem",
    title: "Exquisite Craftsmanship",
    description: "Each piece is meticulously handcrafted by master artisans with decades of experience",
    colorClass: "amber"
  },
  {
    icon: "fas fa-shield-halved",
    title: "Certified Purity",
    description: "100% authentic gold with hallmark certification and lifetime guarantee",
    colorClass: "blue"
  },
  {
    icon: "fas fa-trophy",
    title: "Award-Winning Designs",
    description: "Recognized nationally for innovation and traditional craftsmanship excellence",
    colorClass: "purple"
  },
  {
    icon: "fas fa-landmark",
    title: "Timeless Heritage",
    description: "Preserving centuries-old techniques while embracing modern aesthetics",
    colorClass: "emerald"
  }
];
  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const element = document.querySelector(targetId);
    if (!element) return;

    const offset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });

    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  return (
    <div className="home-page">
      <Navigation 
        logo={shanmugacraftlogo}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        handleSmoothScroll={handleSmoothScroll}
      />

      <section id="home" className="hero">
        <HeroSlider 
          slides={sliderData}
          handleSmoothScroll={handleSmoothScroll}
          coinImages={coinImages}
        />
      </section>

      {/* Premium Why Us Section */}
      <section id="why-us" className="premium-why-us">
        <div className="premium-why-us__bg-orbs">
          <div className="premium-why-us__orb premium-why-us__orb--1"></div>
          <div className="premium-why-us__orb premium-why-us__orb--2"></div>
          <div className="premium-why-us__orb premium-why-us__orb--3"></div>
        </div>

        <div className="premium-why-us__container">
          {/* Header */}
          <div className="premium-why-us__header">
            <span className="premium-why-us__subtitle">Excellence Redefined</span>
            <h2 style={{fontSize:'45px'}} className="premium-why-us__title">Why Choose Shanmuga Craft?</h2>
            <p style={{fontSize:'17px'}} className="premium-why-us__description">
              Where tradition meets perfection, and every piece tells a story of unparalleled artistry
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="premium-why-us__grid">
            {whyUsFeatures.map((feature, index) => (
              <div
                key={index}
                className={`premium-why-us__card ${activeCard === index ? 'premium-why-us__card--active' : ''}`}
                onMouseEnter={() => setActiveCard(index)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <div className={`premium-why-us__card-gradient premium-why-us__card-gradient--${feature.colorClass}`}></div>
                
                <div className={`why__icon-box why__icon-box--${feature.colorClass}`}>
                  <i className={feature.icon} />
                </div>

                <h3 className="premium-why-us__card-title">{feature.title}</h3>
                <p className="premium-why-us__card-description">{feature.description}</p>

                <div className={`premium-why-us__card-corner premium-why-us__card-corner--${feature.colorClass}`}></div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="premium-why-us__cta">
            <button 
              className="premium-why-us__btn"
              onClick={(e) => handleSmoothScroll(e, '#products')}
            >
              <span className="premium-why-us__btn-text">Explore Our Collection</span>
            </button>
            <p className="premium-why-us__cta-text">
              Join thousands of satisfied customers who trust Shanmuga Craft
            </p>
          </div>

          {/* Stats Bar */}
<div className="premium-why-us__stats">
  <div className="premium-why-us__stat">
    <div className="premium-why-us__stat-number">500+</div>
    <div className="premium-why-us__stat-label">Products Available</div>
  </div>
  <div className="premium-why-us__stat">
    <div className="premium-why-us__stat-number">100%</div>
    <div className="premium-why-us__stat-label">Certified Gold</div>
  </div>
  <div className="premium-why-us__stat">
    <div className="premium-why-us__stat-number">24/7</div>
    <div className="premium-why-us__stat-label">Customer Support</div>
  </div>
</div>
        </div>
      </section>

<section id="products" className="products-premium">
  
  {/* Animated Background */}
  <div className="products-premium__bg">
    <div className="products-premium__bg-orb products-premium__bg-orb--1"></div>
    <div className="products-premium__bg-orb products-premium__bg-orb--2"></div>
    <div className="products-premium__bg-orb products-premium__bg-orb--3"></div>
  </div>

  <div className="products-premium__container">
    
    {/* Section Header */}
    <div className="products-premium__header">
      <span className="products-premium__subtitle">
        <span className="products-premium__subtitle-icon">✦</span>
        Our Collections
        <span className="products-premium__subtitle-icon">✦</span>
      </span>
      <h2 style={{fontSize:'45px'}} className="products-premium__title">
        Premium Gold & Silver Coins
      </h2>
      <p style={{fontSize:'17px'}} className="products-premium__description">
        100% hallmarked pure gold (24K) and silver (999 fine) coins – perfect for investment, 
        gifting, pooja, weddings, or building generational wealth.
      </p>
    </div>

    {/* Products Grid - 4 Cards */}
    <div className="products-premium__grid">
      
      {/* Card 1 - Gold Coins */}
      <div className="products-premium__card">
        <div className="products-premium__card-image-wrapper">
          <img 
            src={goldcoin} 
            alt="24K Pure Gold Coins" 
            className="products-premium__card-image"
          />
  
        </div>
        <div className="products-premium__card-content">
          <h3 className="products-premium__card-title">Gold Coins</h3>
          <p className="products-premium__card-text">
            <strong>916 & 24K Hallmarked</strong> gold coins with certified purity. 
            Perfect for investment and gifting.
          </p>
          <div className="products-premium__card-features">
            <span className="products-premium__feature">✓ Certified</span>
            <span className="products-premium__feature">✓ Investment Grade</span>
          </div>
        </div>
        <div className="products-premium__card-glow products-premium__card-glow--gold"></div>
      </div>

      {/* Card 2 - Silver Coins */}
      <div className="products-premium__card">
        <div className="products-premium__card-image-wrapper">
          <img 
            src={silvercoin} 
            alt="999 Fine Silver Coins" 
            className="products-premium__card-image"
          />

        </div>
        <div className="products-premium__card-content">
          <h3 className="products-premium__card-title">Silver Coins</h3>
          <p className="products-premium__card-text">
            <strong>999 Fine Silver</strong> coins for festivals, pooja, and 
            everyday gifting. Affordable luxury.
          </p>
          <div className="products-premium__card-features">
            <span className="products-premium__feature">✓ Pure Silver</span>
            <span className="products-premium__feature">✓ Festival Ready</span>
          </div>
        </div>
        <div className="products-premium__card-glow products-premium__card-glow--silver"></div>
      </div>

      {/* Card 3 - Mixed Collection */}
      <div className="products-premium__card">
        <div className="products-premium__card-image-wrapper">
          <img 
            src={goldchain} 
            alt="Gold & Silver Collection" 
            className="products-premium__card-image"
          />
        </div>
        <div className="products-premium__card-content">
          <h3 className="products-premium__card-title">Gold Chain</h3>
          <p className="products-premium__card-text">
          This premium gold chain is crafted <strong>with precision using high-quality gold,</strong>  ensuring durability and long-lasting shine.
          </p>
          <div className="products-premium__card-features">
            <span className="products-premium__feature">✓ Gift Ready</span>
            <span className="products-premium__feature">✓ Premium Sets</span>
          </div>
        </div>
        <div className="products-premium__card-glow products-premium__card-glow--mixed"></div>
      </div>

      {/* Card 4 - All Sizes */}
      <div className="products-premium__card">
        <div className="products-premium__card-image-wrapper">
          <img 
            style={{width:'65%' , height:'65%'}}
            src={goldring} 
            alt="All Weight Sizes Available" 
            className="products-premium__card-image"
          />

        </div>
        <div className="products-premium__card-content">
          <h3 className="products-premium__card-title">Gold Ring</h3>
          <p className="products-premium__card-text">
            Crafted with pure gold and polished to perfection, this gold ring <strong>offers exceptional shine and durability.</strong>
         
          </p>
          <div className="products-premium__card-features">
            <span className="products-premium__feature">✓ All Designs</span>
            <span className="products-premium__feature">✓ Flexible Options</span>
          </div>
        </div>
        <div className="products-premium__card-glow products-premium__card-glow--sizes"></div>
      </div>

    </div>

    {/* Bottom CTA Section */}
    <div className="products-premium__cta">
      <div className="products-premium__cta-content">
        <h3 className="products-premium__cta-title">Ready to Start Your Journey?</h3>
        <p className="products-premium__cta-text">
          Explore our exclusive collections with secure packaging, competitive pricing, 
          and full buyback guarantee.
        </p>
        <button 
          className="products-premium__cta-btn"
          onClick={(e) => handleSmoothScroll(e, '#contact')}
        >
          <span>Discover Collections</span>
          <span className="products-premium__cta-btn-icon">
           <i className="fas fa-long-arrow-alt-right"></i>
          </span>
        </button>
      </div>
      
      {/* Trust Badges */}
<div className="products-premium__trust">
  <div className="products-premium__trust-item">
    <span className="products-premium__trust-icon">
      <i className="fas fa-shield-halved" />
    </span>
    <span className="products-premium__trust-text">100% Certified</span>
  </div>
  <div className="products-premium__trust-item">
    <span className="products-premium__trust-icon">
      <i className="fas fa-lock" />
    </span>
    <span className="products-premium__trust-text">Secure Delivery</span>
  </div>
  <div className="products-premium__trust-item">
    <span className="products-premium__trust-icon">
      <i className="fas fa-rotate-left" />
    </span>
    <span className="products-premium__trust-text">Buyback Guarantee</span>
  </div>
</div>
    </div>

  </div>
</section>

{/* ── ABOUT SECTION ──────────────────────────────────────── */}
<section id="about" className="section section--about">
  <div className="about__layout">

    {/* LEFT — Text Content */}
    <div className="about__content">

      <span style={{fontSize:'20px'}} className="about__eyebrow">About Shanmuga Craft</span>

      <h2 className="about__title">
        Crafting <span>Timeless</span> Gold &amp; Silver
      </h2>

      <div className="about__rule" />

      <p className="about__body">
        Shanmuga Craft is a newly established premium destination for pure gold and silver coins,
        proudly launching in <strong>2026</strong>.
      </p>

      <p className="about__body">
        Our mission is to deliver a trusted, transparent, and luxurious shopping experience where
        authenticity and craftsmanship come first. Every coin — whether 24K gold or 999 fine silver
        — is <strong>100% hallmarked, certified</strong>, and meticulously crafted to preserve
        lasting value.
      </p>

      <p className="about__body">
        Inspired by India's rich heritage of metal artistry, we combine traditional techniques with
        modern purity standards to create timeless pieces perfect for investment, gifting, pooja,
        weddings, and generational wealth.
      </p>

      <p className="about__body about__body--italic">
        Join us as we prepare to open our doors in 2026 — bringing you exclusive collections,
        secure delivery, competitive pricing, and a full buyback guarantee.
      </p>

      {/* Stat Pills */}
      <div className="about__stats">
        <div className="about__stat-pill">
          <span className="about__stat-number">500+</span>
          <span className="about__stat-label">Products</span>
        </div>
        <div className="about__stat-pill">
          <span className="about__stat-number">100%</span>
          <span className="about__stat-label">Certified</span>
        </div>
        <div className="about__stat-pill">
          <span className="about__stat-number">24/7</span>
          <span className="about__stat-label">Support</span>
        </div>
        <div className="about__stat-pill">
          <span className="about__stat-number">2026</span>
          <span className="about__stat-label">Launch</span>
        </div>
      </div>
    </div>

    {/* RIGHT — Visual */}
    <div className="about__visual">

      {/* Main Image */}
      <div className="about__image-card">
        <img
          src={goldmake}
          alt="Artisan Crafting Premium Gold & Silver Coins"
          className="about__img"
        />
        <span className="about__image-badge">Premium Craftsmanship</span>
      </div>

      {/* Feature Cards */}
      <div className="about__feature-cards">
        <div className="about__feature-card">
          <span className="about__feature-icon">
            <i className="fas fa-award" />
          </span>
          <span className="about__feature-title">Hallmark Certified</span>
        </div>
        <div className="about__feature-card">
          <span className="about__feature-icon">
            <i className="fas fa-shield-halved" />
          </span>
          <span className="about__feature-title">Secure Delivery</span>
        </div>
        <div className="about__feature-card">
          <span className="about__feature-icon">
            <i className="fas fa-rotate-left" />
          </span>
          <span className="about__feature-title">Buyback Guarantee</span>
        </div>
      </div>

    </div>
  </div>
</section>
      
<section id="goldrate">
  <GoldPrice
    selectedCities={selectedGoldCities}
    onSelectionChange={setSelectedGoldCities}
  />
</section>

<section id="silverrate">
  <SilverPrice
    selectedCities={selectedSilverCities}
    onSelectionChange={setSelectedSilverCities}
  />
</section>

<section id="accordion">
 <Accordion />
</section>

      <section className="section--contact">
  <ContactForm />
</section>

      <footer className="footer">
        <div className="footer__container">
          <div className="footer__copyright">
            <p className="footer__copyright-text">
              &copy; 2026 Shanmuga Craft. All Rights Reserved. Timeless Purity.
            </p>
            <span className="footer__copyright-subtitle">Trusted Craftsmanship.</span>
          </div>
          
          <div className="footer__credits">
            <div>
              <p className="footer__credits-text">Created with precision by</p>
            <p className="footer__credits-text">
  <a href="https://techchasesoftware.com/" target="_blank" rel="noopener noreferrer">
    TechChase Software Solutions
  </a>
</p>
            </div>
            <img 
              src={techchaselogo} 
              alt="TechChase Logo" 
              className="footer__logo" 
            />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;