import React, { useState } from 'react';
import '../styles/Accordion.css';

const Accordion = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "Are your gold coins 100% pure?",
      answer: "Yes, all our gold coins are 24K (999.9 purity) and come with BIS hallmark certification. We guarantee 100% authenticity with proper certification and lifetime buyback guarantee."
    },
    {
      question: "What is the difference between 22K and 24K gold?",
      answer: "24K gold is 99.9% pure gold, while 22K gold (916) contains 91.6% gold mixed with other metals for added strength. 24K is ideal for coins and investment, while 22K is preferred for jewelry due to its durability."
    },
    {
      question: "Do you offer buyback on gold and silver coins?",
      answer: "Yes, we offer lifetime buyback guarantee on all our hallmarked gold and silver coins at current market rates. Simply bring your coins with the original certificate and invoice."
    },
    {
      question: "How do I verify the purity of my purchase?",
      answer: "Each coin comes with a BIS hallmark certificate and unique serial number. You can verify authenticity through the BIS hallmark, certificate number, and our quality guarantee seal on the packaging."
    },
    {
      question: "What are the delivery charges?",
      answer: "We offer FREE standard delivery (5-7 business days) on all orders. Express delivery (2-3 business days) is available for ₹200. All shipments are fully insured and require signature confirmation."
    },
    {
      question: "Can I customize the weight of the coins?",
      answer: "Yes! We offer coins in various weights: 1g, 2g, 4g, 8g, 10g, and custom weights upon request. Contact us for special requirements and bulk orders."
    },
    {
      question: "What is your return and exchange policy?",
      answer: "We accept returns within 7 days of delivery if the product seal is intact. Exchange is available for different weights or products. Refunds are processed within 5-7 business days after verification."
    },
    {
      question: "How do I track my order?",
      answer: "Once your order is shipped, you'll receive a tracking number via email and SMS. You can track your shipment in real-time through our website or the courier partner's website."
    }
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="accordion-section">
      <div className="accordion-container">
        <div className="accordion-header">
          <h2 style={{fontSize:'40px'}} className="accordion-title">Frequently Asked Questions</h2>
          <p style={{fontSize:'15px'}} className="accordion-subtitle">Everything you need to know about our gold & silver products</p>
        </div>

        <div className="accordion">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`accordion-item ${activeIndex === index ? 'accordion-item--active' : ''}`}
            >
              <button
                className="accordion-question"
                onClick={() => toggleAccordion(index)}
              >
                <span className="accordion-question-text">{faq.question}</span>
                <span className="accordion-icon">
                  {activeIndex === index ? '−' : '+'}
                </span>
              </button>
              
              <div className="accordion-answer">
                <div className="accordion-answer-content">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="accordion-cta">
          <p className="accordion-cta-text">Still have questions?</p>
          <a href="#contact" className="accordion-cta-btn">Contact Us</a>
        </div>
      </div>
    </div>
  );
};
export default Accordion;