const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin =
  require("webpack").container.ModuleFederationPlugin;
const path = require("path");
const deps = require("./package.json").dependencies;

module.exports = {
  entry: "./src/index",
  mode: "development",
  devServer: {
    hot: true,
    liveReload: false,
    port: 3002,
  },
  target: "web",
  output: {
    publicPath: "auto",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: ["@babel/preset-react"],
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "mcm",
      filename: "remoteEntry.js",
      exposes: {
        "./routes": "./src/routes",
        "./Widget": "./src/Widget",
      },
      shared: {
        react: {
          requiredVersion: deps.react,
        },
        "react-dom": {
          requiredVersion: deps["react-dom"],
        },
        "react-router-dom" : {
          requiredVersion: deps["react-router-dom"],
          singleton: true
        },
        "provider-library" : {
          requiredVersion: deps["provider-library"],
        }
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
