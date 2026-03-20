import React from 'react';

const Navigation = ({ 
  logo, 
  isDarkMode,
  setIsDarkMode,
  isMobileMenuOpen, 
  setIsMobileMenuOpen,
  handleSmoothScroll 
}) => {
  const navLinks = [
    { href: '#home',      label: <i className="fas fa-home" aria-hidden="true"></i>, ariaLabel: 'HOME', isCta: true },
    { href: '#why-us',    label: 'WHY US' },
    { href: '#products',  label: 'PRODUCTS' },
    { href: '#about',     label: 'ABOUT' },
    { href: '#contact',   label: 'CONTACT' },
    { href: '#goldrate',  label: "TODAY'S Gold RATE" },
    { href: '#silverrate',  label: "TODAY'S Silver RATE" },
    { href: '#accordion', label: 'FAQ & SUPPORT' },
  ];

  const SunIcon = () => (
    <svg width="24" height="24"  viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1"  x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22"  y1="4.22"  x2="5.64"  y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1"  y1="12" x2="3"  y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36"/>
      <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"/>
    </svg>
  );

  const MoonIcon = () => (
    <svg width="24" height="24"  viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );

  return (
    <nav className="navbar">
      <div className="navbar__container">

        {/* Logo */}
        <a
          href="#home"
          className="navbar__logo"
          onClick={(e) => handleSmoothScroll(e, '#home')}
        >
          <img src={logo} alt="Shanmuga Craft" className="navbar__logo-img" />
          <span className="navbar__logo-text">Shanmuga Craft</span>
        </a>

        {/* Desktop Links */}
        <ul className="navbar__links">
          {navLinks.map((link, index) => (
            <li key={index}>
              <a
                href={link.href}
                className={`navbar__link ${link.isCta ? 'navbar__link--cta' : ''}`}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                aria-label={link.ariaLabel || undefined}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Dark Mode Toggle — desktop only */}
        <button
          className="navbar__theme-toggle"
          onClick={() => setIsDarkMode(prev => !prev)}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
        >
          {isDarkMode ? <SunIcon /> : <MoonIcon />}
        </button>

        {/* Hamburger */}
        <div
          className={`navbar__hamburger ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          role="button"
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span className="navbar__hamburger-line"></span>
          <span className="navbar__hamburger-line"></span>
          <span className="navbar__hamburger-line"></span>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'mobile-menu--open' : ''}`}>
        <ul className="mobile-menu__links">

          {/* Nav Links */}
          {navLinks.map((link, index) => (
            <li key={index} className="mobile-menu__item">
              <a
                href={link.href}
                className={`mobile-menu__link ${link.isCta ? 'mobile-menu__link--cta' : ''}`}
                onClick={(e) => {
                  handleSmoothScroll(e, link.href);
                  setIsMobileMenuOpen(false);
                }}
                aria-label={link.ariaLabel || undefined}
              >
                {link.label}
              </a>
            </li>
          ))}

          {/* ── Gold divider ── */}
          <li className="mobile-menu__divider" role="separator" aria-hidden="true"></li>

          {/* ── Theme Switcher — closes menu after toggle ── */}
          <li className="mobile-menu__item mobile-menu__item--theme">
            <span className="mobile-menu__theme-label">
              <i className="fas fa-palette" aria-hidden="true"></i>
              Appearance
            </span>
            <button
              className={`mobile-menu__theme-switcher ${isDarkMode ? 'is-dark' : 'is-light'}`}
              onClick={() => {
                setIsDarkMode(prev => !prev);
                setIsMobileMenuOpen(false); // ← closes menu after theme switch
              }}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <span className={`theme-option ${!isDarkMode ? 'theme-option--active' : ''}`}>
                <SunIcon />
                <span>Light</span>
              </span>
              <span className={`theme-option ${isDarkMode ? 'theme-option--active' : ''}`}>
                <MoonIcon />
                <span>Dark</span>
              </span>
            </button>
          </li>

        </ul>
      </div>
    </nav>
  );
};

export default Navigation;