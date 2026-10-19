const WARM_LABEL = /chaud|3000|2700|warm/i;
const COOL_LABEL = /froid|6500|6000|5000|cool|blanc pur/i;

export const COLOR_TONES = {
  warm: 'chaud',
  neutral: 'neutre',
  cool: 'froid',
};

export const colorTemperatureTone = (label) => {
  if (WARM_LABEL.test(label || '')) return COLOR_TONES.warm;
  if (COOL_LABEL.test(label || '')) return COLOR_TONES.cool;
  return COLOR_TONES.neutral;
};

export const colorTemperatureFraction = (label) => {
  const tone = colorTemperatureTone(label);
  if (tone === COLOR_TONES.warm) return 0.14;
  if (tone === COLOR_TONES.cool) return 0.86;
  return 0.5;
};

export const colorTemperatureLabel = (fraction) => {
  if (fraction <= 0.34) return 'Blanc chaud';
  if (fraction >= 0.66) return 'Blanc froid';
  return 'Blanc neutre';
};
