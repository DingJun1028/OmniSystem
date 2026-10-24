/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8F0',
        ink: '#1F1D2B',
        muted: '#5B5870',
        coral: '#FF6B6B',
        'coral-dark': '#E85A5A',
        sunshine: '#FFD93D',
        mint: '#6BCB77',
        sky: '#4D96FF',
        lilac: '#B388FF',
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Nunito', 'sans-serif'],
      },
      spacing: {
        '22': '5.5rem',
      },
      boxShadow: {
        card: '0 10px 30px rgba(31,29,43,0.08)',
        button: '0 6px 0 #E85A5A',
        'button-hover': '0 8px 0 #E85A5A',
        'button-active': '0 2px 0 #E85A5A',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      maxWidth: {
        'site': '1100px',
      },
    },
  },
  plugins: [],
}
