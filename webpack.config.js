const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    main: './js/main.js',
   
    slide1: './js/slide1.js',
    slide2: './js/slide2.js',
    slide3: './js/slide3.js',
    slide4: './js/slide4.js',
    vision: './js/vision.js',
    history: './js/history.js',
  },




    
      
      
      
      
      
  
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/MoonBow/',
  },

  resolve: {
    extensions: ['.js', '.jsx'], // Allow imports without specifying extensions
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.(js|jsx)$/, // Allow .jsx files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'], // Add React preset
          },
        },
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
    // Index page (loads everything except vision.js and history.js)
    new HtmlWebpackPlugin({
      template: 'index.html',
      filename: 'index.html',
      chunks: ['main', 'slide1', 'slide2', 'slide3', 'slide4'],
      favicon: 'images/favicon.ico',
    }),
    // Vision page (only loads vision.js)
    new HtmlWebpackPlugin({
      template: '../moonbow.github.io/html/vision.html',
      filename: 'html/vision.html',
      chunks: ['main', 'vision'],
    }),
    // History page (only loads history.js)
    new HtmlWebpackPlugin({
      template: '../moonbow.github.io/html/history.html',
      filename: 'html/history.html',
      chunks: ['main' ,'history'],
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
    hot: false,
    devMiddleware: {
    publicPath: '/MoonBow/',
  },
},
};
