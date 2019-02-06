const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const webpack = require('webpack');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        port: 8080,
        hot: true
        
    },
    module: {
        rules: [                  
            {
                test: /\.ts?$/,
                use: ['ts-loader'],
                exclude: /node_modules/
            }
          
        ]
    },    
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
     
    ]    
});