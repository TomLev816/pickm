/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'pagebg': '#edeef0',
      'navBar': '#ffffff',
      'hoverButtons': '#f74437',
      'selectedWeek': '#006dca',
      'teamInfo': '#FFFfff',
      'selectedTeamInfo': '#006dca',
      'winnerTeamInfo': '#74A874',
      'loserTeamInfo': '#FF745C',
      'gameBg': '#ffffff',
    },
  },
};
