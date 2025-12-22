export const Colors = {
  'brand-gradient-start': '#00A9CE',
  'brand-gradient-end': '#026B73',
  'brand-primary': '#026B73',
  'brand-primary-dark': '#176A70',
  'brand-card-bg': '#FFFFFF',
  'brand-highlight': '#25B6BA',
  'brand-teal': '#00695C',
  'brand-teal-deep': '#066F73',
  'btn-active': '#374151',
  'btn-inactive': '#E5E7EB',
  'txt-active': '#FFFFFF',
  'txt-inactive': '#476A78',
  'txt-golden': '#FFD700',
} as const;

export type ColorKey = keyof typeof Colors;

export const hexToRGBA = (hex: string, opacity: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

