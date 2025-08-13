module.exports = {
    content: [
      "./index.html",      // Make sure this file is in your root folder
      "./js/**/*.js",
      "./js/**/*.jsx",
      "./css/**/*.css",
    ],
    theme: {
  extend: {
    fontFamily: {
      sans: ['var(--font-ppgatwick)', 'sans-serif'],
    },
  },
},

    plugins: [],
  };
  