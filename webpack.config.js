var path = require('path');
var nodeExternals = require('webpack-node-externals');
const WebpackShellPlugin = require('webpack-shell-plugin');
const { DefinePlugin } = require('webpack')
require('dotenv').config()

module.exports = {
    target: 'node', 
    externals: [nodeExternals()],
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'optic.js'
  },

  module: {
    rules: [{
     
        exclude:/node_modules/ ,

    }]
},
plugins: [
  new DefinePlugin({
    'process.env.MONGO_URI': JSON.stringify(process.env.MONGO_URI),
    'process.env.PORT': JSON.stringify(process.env.PORT),
    'process.env.SMS_URL': JSON.stringify(process.env.SMS_URL),
  
   

    
  })
]
};
