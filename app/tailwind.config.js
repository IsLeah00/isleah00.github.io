module.exports = {
    content: [
        "./src/**/*.{html,ts}"
    ],
    darkMode: 'class',
    theme: {
        screens: {
            sm: '600px',
            md: '960px',
            lg: '1280px',
            xl: '1440px',
        },
    },
  plugins: [require('@tailwindcss/typography')],
};
