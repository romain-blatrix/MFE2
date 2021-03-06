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
    port: 3000,
    historyApiFallback: true,
  },
  target: "web",
  output: {
    publicPath: "/",
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
      name: "gateway",
      filename: "remoteEntry.js",
      shared: {
        react: {
          requiredVersion: deps.react,
          // import: "react",
          // shareKey: "react",
          // shareScope: "default",
          singleton: true,
          eager: true
        },
        "react-dom": {
          requiredVersion: deps["react-dom"],
          singleton: true,
          eager: true
        },
        "react-router-dom" : {
          requiredVersion: deps["react-router-dom"],
          singleton: true,
          eager: true
        },
        "provider-library" : {
          requiredVersion: deps["provider-library"],
          eager: true
        }
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
