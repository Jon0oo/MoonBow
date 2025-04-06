const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin'); 


module.exports = {
  entry: {
    main: './js/main.js',

    
    //firebaseConfig: './js/firebaseConfig.js',
    //demoRequests: './js/demoRequests.js',
    //firebaseHelpers: './js/firebaseHelpers.js',
   
    slide1: './js/slide1.js',
    //modalComponent: './js/modalComponent.js',

    slide2: './js/slide2.js',
    slide3: './js/slide3.js',
    slide4: './js/slide4.js',
    vision: './js/vision.js',
    history: './js/history.js',
    signin:  './js/signin.js',
    admin:  './js/admin.js',
  },



 
    
      
      
      
      
      
  
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
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
            presets: ['@babel/preset-env',], // Add React preset
          },
        },
      },
      {
        test: /\.css$/,
        use: [
            MiniCssExtractPlugin.loader,
            {
                loader: 'css-loader',
                options: {
                    //esModule: false, // disable ES modules to remove export {} from output
                },
            },
        ],
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
      chunks: ['main',  'slide1', 'slide2', 'slide3', 'slide4'],
      favicon: 'images/favicon.ico',
      minify: {
        html5                          : true,
        collapseWhitespace             : true,
        minifyCSS                      : true,
        minifyJS                       : true,
        minifyURLs                     : false,
        removeComments                 : true,
        removeEmptyAttributes          : true,
        removeOptionalTags             : true,
        // Remove attributes when value matches default.
        removeRedundantAttributes      : true,
        // Remove type="text/javascript" from script tags. 
        // Other type attribute values are left intact
        removeScriptTypeAttributes     : true,
        // Remove type="text/css" from style and link tags. 
        // Other type attribute values are left intact
        removeStyleLinkTypeAttributes : true,
        // Replaces the doctype with the short (HTML5) doctype
        useShortDoctype                : true
    }
    }),
    // Vision page (only loads vision.js)
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'html/vision.html'),
      filename: 'html/vision.html',
      chunks: ['main', 'vision'],
      minify: {
        html5                          : true,
        collapseWhitespace             : true,
        minifyCSS                      : true,
        minifyJS                       : true,
        minifyURLs                     : false,
        removeComments                 : true,
        removeEmptyAttributes          : true,
        removeOptionalTags             : true,
        // Remove attributes when value matches default.
        removeRedundantAttributes      : true,
        // Remove type="text/javascript" from script tags. 
        // Other type attribute values are left intact
        removeScriptTypeAttributes     : true,
        // Remove type="text/css" from style and link tags. 
        // Other type attribute values are left intact
        removeStyleLinkTypeAttributes : true,
        // Replaces the doctype with the short (HTML5) doctype
        useShortDoctype                : true
    }
    }),
    // History page (only loads history.js)
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'html/history.html'),
      filename: 'html/history.html',
      chunks: ['main' ,'history'],
      minify: {
        html5                          : true,
        collapseWhitespace             : true,
        minifyCSS                      : true,
        minifyJS                       : true,
        minifyURLs                     : false,
        removeComments                 : true,
        removeEmptyAttributes          : true,
        removeOptionalTags             : true,
        // Remove attributes when value matches default.
        removeRedundantAttributes      : true,
        // Remove type="text/javascript" from script tags. 
        // Other type attribute values are left intact
        removeScriptTypeAttributes     : true,
        // Remove type="text/css" from style and link tags. 
        // Other type attribute values are left intact
        removeStyleLinkTypeAttributes : true,
        // Replaces the doctype with the short (HTML5) doctype
        useShortDoctype                : true
    }
    }),
    //for the signin page
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'html/signin.html'),
      filename: 'html/signin.html',
      chunks: ['main', 'signin'],
      minify: {
        html5                          : true,
        collapseWhitespace             : true,
        minifyCSS                      : true,
        minifyJS                       : true,
        minifyURLs                     : false,
        removeComments                 : true,
        removeEmptyAttributes          : true,
        removeOptionalTags             : true,
        // Remove attributes when value matches default.
        removeRedundantAttributes      : true,
        // Remove type="text/javascript" from script tags. 
        // Other type attribute values are left intact
        removeScriptTypeAttributes     : true,
        // Remove type="text/css" from style and link tags. 
        // Other type attribute values are left intact
        removeStyleLinkTypeAttributes : true,
        // Replaces the doctype with the short (HTML5) doctype
        useShortDoctype                : true
    }
    }),
    //for the admin page
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'html/admin.html'),
      filename: 'html/admin.html',
      chunks: ['main',  'admin' ],

      minify: {
        html5                          : true,
        collapseWhitespace             : true,
        minifyCSS                      : true,
        minifyJS                       : true,
        minifyURLs                     : false,
        removeComments                 : true,
        removeEmptyAttributes          : true,
        removeOptionalTags             : true,
        // Remove attributes when value matches default.
        removeRedundantAttributes      : true,
        // Remove type="text/javascript" from script tags. 
        // Other type attribute values are left intact
        removeScriptTypeAttributes     : true,
        // Remove type="text/css" from style and link tags. 
        // Other type attribute values are left intact
        removeStyleLinkTypeAttributes : true,
        // Replaces the doctype with the short (HTML5) doctype
        useShortDoctype                : true
    }


    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css', // Creates a main.css file (and others if multiple entry points exist)
    }),
  ],

  optimization: {
    minimize: true,
    minimizer: [
      // Minify JavaScript
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
  
      // Minify CSS
      // Comment out this line temporarily
      //new CssMinimizerPlugin(),
    ],
  },
  
  

  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
      watch: true,
    },
    watchFiles: ['css/**/*.css'],
    port: 8000,
    hot: false,
    devMiddleware: {
      publicPath: '/',
    },
  }
  
};



