const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
// const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
// const ESLintPlugin = require('eslint-webpack-plugin')

const isProd = process.env.NODE_ENV === 'production'
const isDev = !isProd
const isServe = process.env.SERVE

const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`)

const babelOptions = () => {
  const presets = [
    '@babel/preset-env',
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
      },
    ],
    '@babel/preset-typescript',
  ]
  const plugins = []
  if (isServe) {
    plugins.push('react-refresh/babel')
  }

  return {
    presets,
    plugins,
  }
}

const cssLoaders = (modules, extra) => {
  const loaders = [
    MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: modules
        ? {
            modules: { localIdentName: '[local]__[sha1:hash:hex:7]' },
            importLoaders: extra ? 2 : 1,
          }
        : {},
    },
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: ['postcss-preset-env'],
        },
      },
    },
  ]
  if (extra) loaders.push(extra)
  return loaders
}

const optimization = () => {
  const config = {
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: 'chunk-vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'initial',
        },
        common: {
          name: 'chunk-common',
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true,
        },
      },
    },
  }
  if (isProd) config.minimizer = [new CssMinimizerWebpackPlugin(), new TerserWebpackPlugin()]
  return config
}

module.exports = {}
