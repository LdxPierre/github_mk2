// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const isProduction = process.env.NODE_ENV == "production";

const stylesHandler = isProduction
	? MiniCssExtractPlugin.loader
	: "style-loader";

const config = {
	entry: {
		main: path.join(__dirname, "src/index.ts"),
		snake: {
			import: path.join(__dirname, "src/snake/index.js"),
			filename: "snake/[name].js",
		},
		blog: {
			import: path.join(__dirname, "src/blog/index.ts"),
			filename: "blog/[name].js",
		},
		blogForm: {
			import: path.join(__dirname, "src/blog/form/form.ts"),
			filename: "blog/[name].js",
		},
		blogTopbar: {
			import: path.join(__dirname, "src/blog/assets/javascript/topbar.ts"),
			filename: "blog[name].js",
		},
		todolist: {
			import: path.join(__dirname, "src/todolist/index.ts"),
			filename: "todolist/[name].js",
		},
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		clean: true,
	},
	devServer: {
		host: "localhost",
		hot: false,
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "/src/index.html",
			chunks: ["main"],
		}),
		new HtmlWebpackPlugin({
			template: "src/blog/index.html",
			chunks: ["blog", "blogTopbar"],
			filename: "blog/index.html",
		}),
		new HtmlWebpackPlugin({
			template: "src/blog/form/form.html",
			chunks: ["blogForm", "blogTopbar"],
			filename: "blog/form.html",
		}),
		new HtmlWebpackPlugin({
			template: "src/snake/index.html",
			chunks: ["snake"],
			filename: "snake/index.html",
		}),
		new HtmlWebpackPlugin({
			template: "src/todolist/index.html",
			chunks: ["todolist"],
			filename: "todolist/index.html",
		}),
		new CopyWebpackPlugin({
			patterns: [
				{ from: "./src/assets/images", to: "./assets/images" },
				{
					from: "./src/assets/resources",
					to: "./assets/resources",
				},
			],
		}),

		// Add your plugins here
		// Learn more about plugins from https://webpack.js.org/configuration/plugins/
	],
	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/i,
				loader: "ts-loader",
				exclude: ["/node_modules/"],
			},
			{
				test: /\.css$/i,
				use: [stylesHandler, "css-loader"],
			},
			{
				test: /\.s[ac]ss$/i,
				use: [stylesHandler, "css-loader", "sass-loader"],
			},
			{
				test: /\.(eot|svg|ttf|woff|woff2)$/i,
				type: "asset",
			},

			// Add your rules for custom modules here
			// Learn more about loaders from https://webpack.js.org/loaders/
		],
	},
	resolve: {
		extensions: [".tsx", ".ts", ".jsx", ".js", "..."],
	},
};

module.exports = () => {
	if (isProduction) {
		config.mode = "production";

		config.plugins.push(
			new MiniCssExtractPlugin({
				filename: "assets/style/[name].css",
			})
		);

		config.plugins.push(new WorkboxWebpackPlugin.GenerateSW());
	} else {
		config.mode = "development";
	}
	return config;
};
