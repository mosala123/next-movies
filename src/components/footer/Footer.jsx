'use client'
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Link from 'next/link';
import { IoArrowUp } from "react-icons/io5";
import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import './Footer.css';

const FooterPages = () => {
  const [email, setEmail] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const currentYear = new Date().getFullYear();

  const companyLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
    { name: 'Blog', href: '/blog' },
  ];

  const helpLinks = [
    { name: 'Customer Support', href: '/support' },
    { name: 'Delivery Details', href: '/delivery' },
    { name: 'Terms & Conditions', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
  ];

  const faqLinks = [
    { name: 'Account', href: '/account' },
    { name: 'Manage Orders', href: '/orders' },
    { name: 'Returns', href: '/returns' },
    { name: 'Payments', href: '/payments' },
  ];

  const resourceLinks = [
    { name: 'Free eBooks', href: '/ebooks' },
    { name: 'Style Guide', href: '/style-guide' },
    { name: 'Size Chart', href: '/size-chart' },
    { name: 'Gift Cards', href: '/gift-cards' },
  ];

  const paymentMethods = ['VISA', 'MC', 'AMEX', 'PP', 'GP'];

  return (
    <footer className="footer-wrapper">
      {/* Newsletter Section */}
      <div className="newsletter-section">
        <div className="newsletter-card">
          <div className="newsletter-content">
            <h2>Stay in the Loop</h2>
            <p>Subscribe to get special offers , free giveaways , and exclusive deals.</p>
          </div>
          
          <div className="newsletter-form">
            <form onSubmit={handleSubscribe}>
              <div className="form-group">
                <input
                  type="email"
                  className="newsletter-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="newsletter-btn">
                  <FiMail /> Subscribe
                </button>
              </div>
              {subscribed && (
                <div className="success-message" style={{color: '#10b981', marginTop: '10px'}}>
                  ✓ Thanks for subscribing!
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="main-footer">
        <div className="footer-container">
          <div className="footer-grid">
            {/* Brand Section */}
            <div className="brand-section">
              <Link href="/" className="footer-logo">
                <Image src="/logo.svg" alt="Shop.co" width={120} height={40} />
              </Link>
              
              <p className="brand-description">
                We have clothes that suits your style and which you're proud to wear. 
                From women to men, we've got everything you need for every occasion.
              </p>

              <div className="social-links">
                <a href="#" className="social-link" aria-label="Facebook">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                  </svg>
                </a>
                <a href="#" className="social-link" aria-label="Instagram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                  </svg>
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22 5.892a8.178 8.178 0 01-2.355.635 4.074 4.074 0 001.8-2.235 8.343 8.343 0 01-2.605.98A4.12 4.12 0 0015.85 4a4.068 4.068 0 00-4.1 4.038c0 .31.035.618.105.919A11.705 11.705 0 013.4 4.734a4.006 4.006 0 00-.547 2.022c0 1.396.724 2.632 1.824 3.356a4.152 4.152 0 01-1.856-.498v.05a4.057 4.057 0 003.276 3.977 4.108 4.108 0 01-1.846.068c.53 1.621 2.036 2.8 3.825 2.834A8.275 8.275 0 012 18.598a11.66 11.66 0 006.29 1.792c7.547 0 11.674-6.112 11.674-11.413 0-.174-.003-.347-.015-.517.8-.567 1.5-1.27 2.051-2.07z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Links Section */}
            <div className="links-grid">
              <div className="links-column">
                <h3>COMPANY</h3>
                <ul>
                  {companyLinks.map(link => (
                    <li key={link.name}>
                      <Link href={link.href}>{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="links-column">
                <h3>HELP</h3>
                <ul>
                  {helpLinks.map(link => (
                    <li key={link.name}>
                      <Link href={link.href}>{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="links-column">
                <h3>FAQ</h3>
                <ul>
                  {faqLinks.map(link => (
                    <li key={link.name}>
                      <Link href={link.href}>{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="links-column">
                <h3>RESOURCES</h3>
                <ul>
                  {resourceLinks.map(link => (
                    <li key={link.name}>
                      <Link href={link.href}>{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom">
            <div className="copyright">
              <span>© {currentYear} Shop.co</span> - All Rights Reserved
            </div>
            
            <div className="payment-methods">
              {paymentMethods.map(method => (
                <span key={method} className="payment-icon">{method}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button 
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <IoArrowUp />
      </button>
    </footer>
  );
};

export default FooterPages;