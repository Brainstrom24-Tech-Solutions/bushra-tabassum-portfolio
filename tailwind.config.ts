import type { Config } from 'tailwindcss';
export default { content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'], theme: { extend: { colors: { paper: '#f4f1ea', ink: '#242923', bronze: '#7b674b' }, fontFamily: { display: ['Georgia', 'serif'], sans: ['Arial', 'sans-serif'] } } }, plugins: [] } satisfies Config;
