const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const config = {
    entry: {
        main: {
            import: './index.ts',
        },
    },
    resolve: {
        extensions: ['.ts', '.tsx'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(
                __dirname,
                './index.html'
            ),
            title: 'Game',
        }),
        new CopyWebpackPlugin({
            patterns: [{ from: './index.css' }],
        }),
    ],
};

module.exports = (_, argv) => {
    if (argv.mode === 'development') {
        const override = {
            optimization: {
                minimize: false,
            },
            devtool: 'source-map',
        };

        return { ...config, ...override };
    }

    return config;
};