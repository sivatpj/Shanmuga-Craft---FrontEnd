import React, { useState, useEffect } from 'react';
import { useSSE } from '../hooks/useSSE';
import CitySelector from './CitySelector';
import '../Styles/MetalPricesPage.css';

const GOLD_PURITIES   = ['24K', '22K', '18K'];
const SILVER_PURITIES = ['999', '925', '900'];
const WEIGHTS         = [1, 2, 4, 8, 10, 50, 100];

const parsePrices = (data, type) => {
  const result = {};
  data.filter(d => d.type === type).forEach(d => {
    if (!result[d.city_name]) result[d.city_name] = {};
    result[d.city_name][d.purity] = parseFloat(d.rate_per_gram);
  });
  return result;
};

const MetalPricesPage = () => {
  const [activeTab, setActiveTab] = useState('Gold');

  const [selectedGoldCities,   setSelectedGoldCities]   = useState([]);
  const [selectedSilverCities, setSelectedSilverCities] = useState([]);

  const [goldPurity,   setGoldPurity]   = useState('24K');
  const [silverPurity, setSilverPurity] = useState('999');

  const [goldPrices,   setGoldPrices]   = useState({});
  const [silverPrices, setSilverPrices] = useState({});
  const [prevGold,     setPrevGold]     = useState({});
  const [prevSilver,   setPrevSilver]   = useState({});

  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error,   setError]           = useState(null);

  const { connected, priceData, error: streamError } = useSSE();

  /* ── initial fetch ── */
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res  = await fetch('/api/v1/prices');
        const json = await res.json();
        if (!json.success) throw new Error('Failed to load prices');
        setGoldPrices(parsePrices(json.data, 'Gold'));
        setSilverPrices(parsePrices(json.data, 'Silver'));
        setLastUpdated(new Date());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ── SSE live update ── */
  useEffect(() => {
    if (!priceData) return;
    const incoming = Array.isArray(priceData) ? priceData : priceData?.data;
    if (!incoming) return;

    setGoldPrices(prev => {
      setPrevGold(prev);
      const next    = { ...prev };
      const newData = parsePrices(incoming, 'Gold');
      Object.keys(newData).forEach(c => { next[c] = { ...(next[c] || {}), ...newData[c] }; });
      return next;
    });

    setSilverPrices(prev => {
      setPrevSilver(prev);
      const next    = { ...prev };
      const newData = parsePrices(incoming, 'Silver');
      Object.keys(newData).forEach(c => { next[c] = { ...(next[c] || {}), ...newData[c] }; });
      return next;
    });

    setLastUpdated(new Date());
  }, [priceData]);

  /* ── derived values ── */
  const isGold       = activeTab === 'Gold';
  const t            = isGold ? 'gold' : 'silver';   // CSS suffix
  const prices       = isGold ? goldPrices     : silverPrices;
  const prevPrices   = isGold ? prevGold       : prevSilver;
  const purities     = isGold ? GOLD_PURITIES  : SILVER_PURITIES;
  const purity       = isGold ? goldPurity     : silverPurity;
  const setPurity    = isGold ? setGoldPurity  : setSilverPurity;
  const selCities    = isGold ? selectedGoldCities    : selectedSilverCities;
  const setSelCities = isGold ? setSelectedGoldCities : setSelectedSilverCities;
  const displayCities = selCities.length > 0 ? selCities : Object.keys(prices);

  /* ── helpers ── */
  const getPrice     = (city, p) => prices?.[city]?.[p] ?? null;
  const getPrevPrice = (city, p) => prevPrices?.[city]?.[p] ?? null;

  const getTrend = (city, p) => {
    const curr = getPrice(city, p);
    const prev = getPrevPrice(city, p);
    if (!curr || !prev || curr === prev) return 'neutral';
    return curr > prev ? 'up' : 'down';
  };

  const getDiff = (city, p) => {
    const curr = getPrice(city, p);
    const prev = getPrevPrice(city, p);
    if (!curr || !prev || curr === prev) return null;
    const diff = curr - prev;
    return diff > 0 ? `+₹${diff.toFixed(2)}` : `-₹${Math.abs(diff).toFixed(2)}`;
  };

  const calcWeight = (city, p, w) => {
    const rate = getPrice(city, p);
    if (!rate) return '—';
    return (rate * w).toLocaleString('en-IN', { maximumFractionDigits: 2 });
  };

  /* ── TrendIcon ── */
  const TrendIcon = ({ trend }) => {
    if (trend === 'up')   return <span className="metal-trend-badge metal-trend-up">▲</span>;
    if (trend === 'down') return <span className="metal-trend-badge metal-trend-down">▼</span>;
    return <span className="metal-trend-badge metal-trend-neutral">—</span>;
  };

  /* ── loading ── */
  if (loading) return (
    <div className={`metal-page ${!isGold ? 'metal-page--silver' : ''}`}>
      <div className="metal-container">
        <div className="metal-loading" style={{ color: isGold ? '#926f0e' : '#64748b' }}>
          <i className="fas fa-spinner fa-spin" style={{ marginRight: 10 }} />
          Loading metal prices…
        </div>
      </div>
    </div>
  );

  /* ── error ── */
  if (error) return (
    <div className={`metal-page ${!isGold ? 'metal-page--silver' : ''}`}>
      <div className="metal-container">
        <div className="metal-loading" style={{ color: '#b45309' }}>⚠ {error}</div>
      </div>
    </div>
  );

  return (
    <div className={`metal-page ${!isGold ? 'metal-page--silver' : ''}`}>
      <div className="metal-container">

        {/* ── Page heading ── */}
        <div className="metal-page-heading">
          <h1 className={`metal-main-title ${!isGold ? 'metal-main-title--silver' : ''}`}>
            Live Metal Prices
          </h1>
          <p className={`metal-main-subtitle ${!isGold ? 'metal-main-subtitle--silver' : ''}`}>
            Real-time gold &amp; silver rates across Tamil Nadu
          </p>
        </div>

        {/* ── Tab switcher ── */}
        <div className="metal-tab-row">
          {['Gold', 'Silver'].map(tab => {
            const isActive = activeTab === tab;
            let cls = 'metal-tab-btn ';
            if (isActive) cls += tab === 'Gold' ? 'metal-tab-btn--gold-active' : 'metal-tab-btn--silver-active';
            else cls += 'metal-tab-btn--inactive';
            return (
              <button key={tab} className={cls} onClick={() => setActiveTab(tab)}>
                <i className={`fas ${tab === 'Gold' ? 'fa-coins' : 'fa-circle-dot'}`} style={{ marginRight: 8 }} />
                {tab}
              </button>
            );
          })}

          {/* Live status */}
          <div className="metal-live-status">
            <span className={`metal-live-dot ${connected ? 'metal-live-dot--connected' : 'metal-live-dot--disconnected'}`} />
            <span className="metal-live-text">
              {lastUpdated
                ? `Updated ${lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}${connected ? '' : (streamError ? ` (offline: ${streamError})` : ' (offline)')}`
                : (streamError ? `Offline: ${streamError}` : 'Connecting…')}
            </span>
          </div>
        </div>

        {/* ── City + purity controls ── */}
        <div className="metal-controls">
          <CitySelector
            type={activeTab}
            selectedCities={selCities}
            onSelectionChange={setSelCities}
          />

          <div className="metal-purity-row">
            {purities.map(p => (
              <button
                key={p}
                className={`metal-purity-btn ${
                  purity === p
                    ? `metal-purity-btn--${t}-active`
                    : `metal-purity-btn--${t}-inactive`
                }`}
                onClick={() => setPurity(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* ── Rate cards ── */}
        <div
          className="metal-rates"
          style={{ gridTemplateColumns: `repeat(${Math.min(displayCities.length, 3)}, 1fr)` }}
        >
          {displayCities.map(city => {
            const price = getPrice(city, purity);
            const trend = getTrend(city, purity);
            const diff  = getDiff(city, purity);
            return (
              <div key={city} className={`metal-rate-card metal-rate-card--${t}`}>
                <div className="metal-rate-card-header">
                  <span className={`metal-rate-city metal-rate-city--${t}`}>{city}</span>
                  <span className={`metal-rate-badge metal-rate-badge--${t}`}>{purity} · Per Gram</span>
                </div>
                <div className={`metal-rate-price metal-rate-price--${t}`}>
                  ₹{price ? price.toLocaleString('en-IN', { maximumFractionDigits: 2 }) : '—'}
                </div>
                <div className="metal-rate-trend">
                  <TrendIcon trend={trend} />
                  <span className={`metal-trend-text--${trend}`}>
                    {diff ?? 'No change'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Weight tables ── */}
        {displayCities.map(city => (
          <div key={city} className={`metal-table-wrapper metal-table-wrapper--${t}`}>
            <h3 className={`metal-table-title metal-table-title--${t}`}>
              {city} — {activeTab} Price by Weight
            </h3>
            <div className="metal-table-responsive">
              <table className="metal-price-table">
                <thead>
                  <tr>
                    <th className={`metal-table-header metal-table-header--${t}`}>Weight</th>
                    {purities.map(p => (
                      <th
                        key={p}
                        className={`metal-table-header metal-table-header--${t}`}
                        style={p === purity ? { outline: `2px solid ${isGold ? '#c9a84c' : '#94a3b8'}`, outlineOffset: -2 } : {}}
                      >
                        {p} {activeTab}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {WEIGHTS.map(w => (
                    <tr key={w} className={`metal-table-row metal-table-row--${t}`}>
                      <td className={`metal-table-cell metal-table-cell--${t}`}>
                        <span className={`metal-weight-value--${t}`}>{w}</span>
                        <span className={`metal-weight-unit--${t}`}> gram{w > 1 ? 's' : ''}</span>
                      </td>
                      {purities.map(p => (
                        <td
                          key={p}
                          className={`metal-table-cell metal-table-cell--${t}`}
                          style={{
                            fontWeight: p === purity ? 800 : 400,
                            opacity:    p === purity ? 1 : 0.7,
                          }}
                        >
                          ₹{calcWeight(city, p, w)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {/* ── Info cards ── */}
        <div className="metal-info-cards">
          {[
            { icon: 'fa-crown',      title: 'Best Rates',         text: 'Competitive pricing with no hidden charges' },
            { icon: 'fa-chart-line', title: 'Live via SSE', text: 'Prices stream in real-time from international markets' },
            { icon: 'fa-rotate',     title: 'Buyback Guarantee',  text: 'Lifetime buyback at current rates for hallmarked products' },
          ].map(card => (
            <div key={card.title} className={`metal-info-card metal-info-card--${t}`}>
              <div className={`metal-info-icon metal-info-icon--${t}`}>
                <i className={`fas ${card.icon}`} />
              </div>
              <h4 className={`metal-info-title--${t}`}>{card.title}</h4>
              <p className={`metal-info-text--${t}`}>{card.text}</p>
            </div>
          ))}
        </div>

        {/* ── Disclaimer ── */}
        <div className={`metal-disclaimer metal-disclaimer--${t}`}>
          <p>
            <strong>Note:</strong> Prices are indicative and subject to change based on market conditions.
            GST charges apply as per government regulations. Final prices will be confirmed at the time of purchase.
          </p>
        </div>

      </div>
    </div>
  );
};

export default MetalPricesPage;
