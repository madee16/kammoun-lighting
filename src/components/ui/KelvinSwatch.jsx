import { useEffect, useRef, useState } from 'react';
import {
  colorTemperatureFraction,
  colorTemperatureLabel,
} from '../../lib/colorTemperature.js';

const LIGHT_STOPS = [
  [255, 196, 150],
  [255, 240, 214],
  [210, 236, 255],
];

function lightColor(fraction) {
  const t = fraction * (LIGHT_STOPS.length - 1);
  const i = Math.min(LIGHT_STOPS.length - 2, Math.floor(t));
  const f = t - i;
  const [r1, g1, b1] = LIGHT_STOPS[i];
  const [r2, g2, b2] = LIGHT_STOPS[i + 1];
  return `rgb(${Math.round(r1 + (r2 - r1) * f)}, ${Math.round(g1 + (g2 - g1) * f)}, ${Math.round(
    b1 + (b2 - b1) * f,
  )})`;
}

export function KelvinSwatch({ label }) {
  const [fraction, setFraction] = useState(() => colorTemperatureFraction(label));
  const chipRef = useRef(null);
  const dragging = useRef(false);

  useEffect(() => {
    setFraction(colorTemperatureFraction(label));
  }, [label]);

  const updateFromEvent = (event) => {
    const chip = chipRef.current;
    if (!chip) return;
    const rect = chip.getBoundingClientRect();
    const next = (event.clientX - rect.left) / rect.width;
    setFraction(Math.min(1, Math.max(0, next)));
  };

  const onKeyDown = (event) => {
    let step = 0;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') step = -0.08;
    else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') step = 0.08;
    else return;
    event.preventDefault();
    setFraction((current) => Math.min(1, Math.max(0, current + step)));
  };

  const color = lightColor(fraction);

  return (
    <div className="kelvin-preview">
      <div className="kelvin-head">
        <span className="kelvin-bulb" style={{ background: color, boxShadow: `0 0 18px ${color}` }} aria-hidden="true" />
        <span className="kelvin-label">{colorTemperatureLabel(fraction)}</span>
      </div>
      <div
        className="kelvin-chip"
        ref={chipRef}
        role="slider"
        aria-label="Temperature de couleur de la lumiere"
        aria-valuemin={0}
        aria-valuemax={1}
        aria-valuenow={Number(fraction.toFixed(2))}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={(event) => {
          dragging.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          updateFromEvent(event);
        }}
        onPointerMove={(event) => {
          if (dragging.current) updateFromEvent(event);
        }}
        onPointerUp={(event) => {
          dragging.current = false;
          event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onPointerCancel={() => {
          dragging.current = false;
        }}
      >
        <span className="kelvin-marker" style={{ left: `${fraction * 100}%` }} aria-hidden="true" />
      </div>
      <div className="kelvin-scale" aria-hidden="true">
        <span>Chaud</span>
        <span>Neutre</span>
        <span>Froid</span>
      </div>
    </div>
  );
}