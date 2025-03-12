const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    main: [
      './js/main.js',
    ],
    slide1: [
      './js/slide1.js',
    ],
    slide2: [
      './js/slide2.js',
    ],
    slide3: [
      './js/slide3.js',
    ],
    slide4: [
      './js/slide4.js',
    ],
    vision: [
      './js/vision.js',
    ],
    history: [
      './js/history.js',
    ],




    
      
      
      
      
      
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/', // Ensures the HMR update chunks are requested from the correct URL
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        // Replace 'style-loader' with MiniCssExtractPlugin.loader to extract CSS into files
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[hash][ext][query]',
        },
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
    ],
  },
  plugins: [
    // For your main page
    new HtmlWebpackPlugin({
      template: 'index.html',
      filename: 'index.html',
      favicon: 'images/favicon.ico',
    }),
    // For your history page
    new HtmlWebpackPlugin({
      template: '../html/history.html',
      filename: '../html/history.html',
    }),
    // For your vision page
    new HtmlWebpackPlugin({
      template: '../html/vision.html',
      filename: '../html/vision.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css', // Creates a main.css file (and others if multiple entry points exist)
    }),
  ],
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'),
      watch: true,
    },
    port: 8000,
    hot: true,
    
  },
};
