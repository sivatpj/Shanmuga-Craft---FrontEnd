import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

const API_URL = import.meta.env.VITE_API_URL;

const INQUIRY_TYPES = [
  { icon: 'fa-solid fa-coins',         label: 'Buy Coins'         },
  { icon: 'fa-solid fa-gift',          label: 'Gift Orders'       },
  { icon: 'fa-solid fa-boxes-stacked', label: 'Bulk / Corporate'  },
  { icon: 'fa-solid fa-chart-line',    label: 'Investment Advice' },
  { icon: 'fa-solid fa-shield-halved', label: 'Purity / Hallmark' },
  { icon: 'fa-solid fa-pen-ruler',     label: 'Custom Design'     },
];

const HOW_IT_WORKS = [
  {
    icon:  'fa-solid fa-coins',
    title: 'Choose Your Coin',
    desc:  'Select metal type (Gold / Silver), purity, weight & quantity from our catalogue.',
  },
  {
    icon:  'fa-solid fa-paper-plane',
    title: 'Send Your Inquiry',
    desc:  'Fill the form or call us. Our expert prepares a personalised quote within 2 hours.',
  },
  {
    icon:  'fa-solid fa-lock',
    title: 'Confirm & Pay',
    desc:  'Confirm your order. Pay via UPI, bank transfer, card or EMI — 100% secure checkout.',
  },
  {
    icon:  'fa-solid fa-magnifying-glass',
    title: 'Quality Verified',
    desc:  'Every coin is BIS hallmark checked and packed with a certificate of authenticity.',
  },
];

const COIN_WEIGHTS = ['0.5g','1g','2g','4g','5g','8g','10g','20g','50g','100g+'];

const ContactForm = () => {
  const formRef = useRef();
  const [showPopup,    setShowPopup]    = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [isError,      setIsError]      = useState(false);
  const [activeInq,    setActiveInq]    = useState(0);
  const [budget,       setBudget]       = useState(10000);
  const [loading,      setLoading]      = useState(false);

  const formatINR = (val) =>
    parseInt(val).toLocaleString('en-IN');

  const sendEmail = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = {
      from_name:    formRef.current.from_name.value,
      from_phone:   formRef.current.from_phone.value,
      from_email:   formRef.current.from_email.value,
      inquiry_type: INQUIRY_TYPES[activeInq].label,
      coin_type:    formRef.current.coin_type.value,
      coin_weight:  formRef.current.coin_weight.value,
      budget:       `₹${formatINR(budget)}`,
      contact_time: formRef.current.contact_time.value,
      message:      formRef.current.message.value,
    };

    try {
      
      const res = await fetch(`${API_URL}/api/contact`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(formData),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Database error');
      }

     
      await emailjs.sendForm(
        'service_80wf7sd',
        'template_k2zldqa',
        formRef.current,
        { publicKey: 'mRGxP3jq4Ro3uSYS8' }
      );

      /* ── STEP 3: Success ── */
      setPopupMessage('Thank you! Your message has been sent successfully. We will get back to you soon.');
      setIsError(false);
      formRef.current.reset();
      setBudget(10000);
      setActiveInq(0);

    } catch (error) {
      console.error('Submit error:', error);
      setPopupMessage('Oops! Something went wrong. Please try again later.');
      setIsError(true);
    } finally {
      setLoading(false);
      setShowPopup(true);
    }
  };

  return (
    <>
      <div id="contact" className="contact__container">

        <div className="contact__info">

          {/* Title */}
          <h3 className="heading-secondary contact__info-title">
            Contact Shanmuga Craft
          </h3>

          {/* Contact details */}
          <div className="contact__details">
            <div className="contact__detail-item">
              <div className="contact__detail-icon">
                <i className="fa-solid fa-envelope"></i>
              </div>
              <div className="contact__detail-text">
                <span className="contact__detail-label">Email</span>
                <a href="mailto:contactus@shanmugacraft.com" className="contact__detail-value">
                  contactus@shanmugacraft.com
                </a>
              </div>
            </div>

            <div className="contact__detail-item">
              <div className="contact__detail-icon">
                <i className="fa-solid fa-phone"></i>
              </div>
              <div className="contact__detail-text">
                <span className="contact__detail-label">Phone</span>
                <a href="tel:+919884985207" className="contact__detail-value">
                  +91 98849 85207
                </a>
              </div>
            </div>

            <div className="contact__detail-item">
              <div className="contact__detail-icon">
                <i className="fa-solid fa-location-dot"></i>
              </div>
              <div className="contact__detail-text">
                <span className="contact__detail-label">Address</span>
                <span className="contact__detail-value">
                  No 88A/7, Shiyams Brindavan Apt, 2nd Floor Flat 2B,
                  Ashok Nagar 4th Ave, Chennai 600083, TN, India.
                </span>
              </div>
            </div>
          </div>

          {/* Response badge */}
          <div className="response-badge">
            <i className="fa-solid fa-bolt"></i>
            Average reply time: under 1 day
          </div>

          {/* How It Works */}
          <div className="hiw">
            <div className="hiw__heading">
              <i className="fa-solid fa-list-ol"></i>
              How It Works
            </div>

            <div className="hiw__steps">
              {HOW_IT_WORKS.map((step, i) => (
                <div className="hiw__step" key={i}>
                  <div className="hiw__num">
                    <i className={step.icon}></i>
                  </div>
                  <div className="hiw__text">
                    <div className="hiw__title">{step.title}</div>
                    <div className="hiw__desc">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>


          </div>

        </div>
        {/* end contact__info */}

        <div className="contact__content">

          {/* Inquiry Type Selector */}
          <div className="inq-section">
            <label className="form__label">
              <i className="fa-solid fa-hand-pointer"></i>
              What are you looking for?
            </label>
            <div className="inq-grid">
              {INQUIRY_TYPES.map((t, i) => (
                <div
                  key={t.label}
                  className={`inq-btn${activeInq === i ? ' inq-btn--active' : ''}`}
                  onClick={() => setActiveInq(i)}
                >
                  <i className={`${t.icon} inq-btn__icon`}></i>
                  <span className="inq-btn__label">{t.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form className="form" ref={formRef} onSubmit={sendEmail}>
            <input type="hidden" name="inquiry_type" value={INQUIRY_TYPES[activeInq].label} />
            <input type="hidden" name="budget"        value={`₹${formatINR(budget)}`} />

            <div className="form__group">

              {/* Name + Phone */}
              <div className="form__row">
                <div className="form__field">
                  <i className="fa-solid fa-user form__field-icon"></i>
                  <input type="text" name="from_name" placeholder="Your Name" className="form__input" required />
                </div>
                <div className="form__field">
                  <i className="fa-solid fa-phone form__field-icon"></i>
                  <input type="tel" name="from_phone" placeholder="Your Phone" className="form__input" />
                </div>
              </div>

              {/* Email */}
              <div className="form__field">
                <i className="fa-solid fa-envelope form__field-icon"></i>
                <input type="email" name="from_email" placeholder="Your Email" className="form__input" required />
              </div>

              {/* Coin Type + Weight */}
              <div className="form__row">
                <div>
                  <label className="form__label">
                    <i className="fa-solid fa-coins"></i> Coin Type
                  </label>
                  <div className="form__field">
                    <i className="fa-solid fa-layer-group form__field-icon"></i>
                    <select name="coin_type" className="form__select">
                      <option value="">Select type…</option>
                      <option>24K Gold Coin</option>
                      <option>22K Gold Coin</option>
                      <option>Silver Coin</option>
                      <option>Commemorative Coin</option>
                      <option>Custom Engraved Coin</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="form__label">
                    <i className="fa-solid fa-weight-hanging"></i> Weight
                  </label>
                  <div className="form__field">
                    <i className="fa-solid fa-scale-balanced form__field-icon"></i>
                    <select name="coin_weight" className="form__select">
                      <option value="">Select weight…</option>
                      {COIN_WEIGHTS.map((w) => <option key={w}>{w}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Budget Slider */}
              <div>
                <label className="form__label">
                  <i className="fa-solid fa-indian-rupee-sign"></i> Estimated Budget
                </label>
                <input
                  type="range" className="form__range"
                  min={1000} max={500000} step={1000}
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
                <div className="form__range-row">
                  <span><i className="fa-solid fa-indian-rupee-sign"></i> 1,000</span>
                  <span className="form__range-val">
                    <i className="fa-solid fa-indian-rupee-sign"></i> {formatINR(budget)}
                  </span>
                  <span><i className="fa-solid fa-indian-rupee-sign"></i> 5,00,000+</span>
                </div>
              </div>

              {/* Preferred Contact Time */}
              <div>
                <label className="form__label">
                  <i className="fa-solid fa-clock"></i> Preferred Contact Time
                </label>
                <div className="form__field">
                  <i className="fa-solid fa-sun form__field-icon"></i>
                  <select name="contact_time" className="form__select">
                    <option>Morning (9am – 12pm)</option>
                    <option>Afternoon (12pm – 4pm)</option>
                    <option>Evening (4pm – 8pm)</option>
                    <option>Anytime</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div className="form__field">
                <i className="fa-solid fa-message form__field-icon form__field-icon--top"></i>
                <textarea
                  name="message"
                  placeholder="Your Message / Special Requirements (bulk quantity, occasion, custom design, delivery city…)"
                  rows="5"
                  className="form__textarea"
                  required
                />
              </div>

              {/* Submit */}
              <button type="submit" className="btn btn--primary form__submit" disabled={loading}>
                <i className={`fa-solid ${loading ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`}></i>
                {loading ? 'Sending...' : 'Send Inquiry — Get Free Quote'}
              </button>

              <p className="form__privacy">
                <i className="fa-solid fa-lock"></i>
                Your information is 100% private. No spam, ever.
              </p>

            </div>
          </form>
        </div>
        {/* end contact__content */}

      </div>
      {/* end contact__container */}

      {/* Popup Modal */}
      {showPopup && (
        <div className="popup">
          <div className={`popup__box ${isError ? 'popup__box--error' : 'popup__box--success'}`}>
            <div className="popup__icon">
              <i className={isError ? 'fa-solid fa-circle-xmark' : 'fa-solid fa-circle-check'}></i>
            </div>
            <p className="popup__message">{popupMessage}</p>
            <button className="popup__button" onClick={() => setShowPopup(false)}>
              <i className="fa-solid fa-check"></i> OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ContactForm;