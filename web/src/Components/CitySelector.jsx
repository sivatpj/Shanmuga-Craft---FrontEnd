import React, { useState, useEffect } from 'react';
import { fetchZones } from '../services/api';
import '../styles/CitySelector.css';

const CitySelector = ({ selectedCities = [], onSelectionChange, type = 'Gold' }) => {
  const [activeCities, setActiveCities] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);

  /* ── Fetch zone list ── */
  useEffect(() => {
    const loadZones = async () => {
      try {
        setLoading(true);
        const data   = await fetchZones();
        const cities = data
          .filter(z => z.type === type)
          .map(z => z.city_name);

        setActiveCities(cities);

        if (selectedCities.length === 0 && onSelectionChange) {
          onSelectionChange(cities);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadZones();
  }, [type]);

  /* ── Toggle logic ── */
  const isAllSelected = selectedCities.length === activeCities.length;

  const handleAll = () => onSelectionChange?.(activeCities);

  const handleCity = (city) => {
    if (selectedCities.includes(city)) {
      if (selectedCities.length === 1) return; // keep at least one
      onSelectionChange?.(selectedCities.filter(c => c !== city));
    } else {
      onSelectionChange?.([...selectedCities, city]);
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="city-selector-wrapper">
        {[52, 90, 90].map((w, i) => (
          <div key={i} className="city-skeleton" style={{ width: w }} />
        ))}
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className="city-selector-wrapper">
        <span className="city-error">⚠ {error}</span>
      </div>
    );
  }

  /* ── Render ── */
  return (
    <div className="city-selector-wrapper" role="group" aria-label="City selector">

      {/* ALL button */}
      <button
        className={`city-btn ${isAllSelected ? 'city-btn--active' : 'city-btn--inactive'}`}
        onClick={handleAll}
        aria-pressed={isAllSelected}
      >
        All
      </button>

      {/* Per-city buttons */}
      {activeCities.map(city => {
        const isSelected = selectedCities.includes(city);
        return (
          <button
            key={city}
           className={`city-btn ${isSelected ? 'city-btn--active' : 'city-btn--inactive'}`}
            onClick={() => handleCity(city)}
            aria-pressed={isSelected}
          >
            {city}
          </button>
        );
      })}

    </div>
  );
};

export default CitySelector;