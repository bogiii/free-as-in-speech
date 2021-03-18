/**
 * External dependencies
 */
const path = require( 'path' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );
const { DefinePlugin } = require( 'webpack' );
const TerserPlugin = require( 'terser-webpack-plugin' );

module.exports = {
	devtool: 'source-map',
	stats: 'errors-only',
	entry: {
		background: './source/background',
		content: './source/content',
		action: './source/action',
		'@wordpress/wxr': './packages/wxr',
		'fetch-from-har': './packages/fetch-from-har',
	},
	output: {
		path: path.join( __dirname, 'distribution/build' ),
		filename: '[name].js',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
			},
		],
	},
	resolve: {
		fallback: {
			path: require.resolve( 'path-browserify' ),
		},
	},
	plugins: [
		new DefinePlugin( {
			'process.env.GUTENBERG_PHASE': JSON.stringify( 1 ),
			'process.env.COMPONENT_SYSTEM_PHASE': JSON.stringify( 0 ),
			'process.env.FORCE_REDUCED_MOTION': JSON.stringify(
				!! process.env.FORCE_REDUCED_MOTION || false
			),
		} ),
		new CopyWebpackPlugin( {
			patterns: [
				{
					from: '**/*',
					context: 'source',
					globOptions: {
						ignore: [ '*.js' ],
					},
				},
				{
					from:
						'node_modules/webextension-polyfill/dist/browser-polyfill.js',
					to: 'polyfills/webextension.js',
				},
				{
					from: 'node_modules/web-streams-polyfill/dist/ponyfill.js',
					to: 'polyfills/web-streams.js',
				},
			],
		} ),
	],
	optimization: {
		minimizer: [
			new TerserPlugin( {
				terserOptions: {
					mangle: false,
					compress: false,
					output: {
						beautify: true,
						indent_level: 2, // eslint-disable-line camelcase
					},
				},
			} ),
		],
	},
};
