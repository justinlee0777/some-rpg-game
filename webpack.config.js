const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');

const config = {
    entry: {
        main: {
            import: './index.ts',
        },
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx'],
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
            {
                test: /\.(s(a|c)ss)$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './index.html'),
            title: 'Game',
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: './assets', to: 'assets' },
                {
                    from: './package.json',
                    transform: (content) => {
                        const json = JSON.parse(content.toString());

                        // The current distribution has no dependencies.
                        delete json.dependencies;
                        delete json.devDependencies;

                        // Why not delete the scripts at this point.
                        delete json.scripts;

                        return JSON.stringify(json);
                    },
                },
            ],
        }),
        new MiniCssExtractPlugin(),
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
