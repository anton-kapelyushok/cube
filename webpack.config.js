const path = require('path');

module.exports = {
    context: __dirname,
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, 'build'),
        filename: '[name].bundle.js',
        publicPath: '/build/',
    },
    module: {
        loaders: [
            {
                test: /.js$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                query: {
                    cacheDirectory: true,
                    presets: ['es2015'],
                },
            },
            {
                test: /.html$/,
                loader: 'html-loader',
            },
            {
                test: /.json$/,
                loader: 'json-loader',
            },
            {
                test: /.css$/,
                loader: 'style-loader!css-loader',
            }
        ],
    },
    resolve: {
        alias: {
            '~': path.resolve(__dirname, 'src')
        },
        extensions: ['', '.js']
    },
    watch: true,
    devtool: 'source-map'
};
