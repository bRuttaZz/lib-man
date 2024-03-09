const path = require('path');

module.exports = {
    mode: process.env.DEBUG == "1" ? 'development' : 'production',
    entry: {
        index: './public/src/index.js',
        login: './public/src/login.js',
        "main-page": './public/src/main-page.js',
    },
    output: {
        path: path.resolve(__dirname, 'public', 'static', 'js'),
        filename: '[name].bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.(?:js|mjs|cjs)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', { targets: "defaults" }]
                        ]
                    }
                }
            }
        ]
    }
};