// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true
// })

/*
 * @Description:
 * @Autor: lishuyu
 * @Date: 2022-07-10 21:24:54
 * @LastEditors: lin
 * @LastEditTime: 2023-02-08 16:27:38
 */

// 'use strict';
const path = require('path');
const { defineConfig } = require('@vue/cli-service');
// const defaultSettings = require('./src/settings.js');
// const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
let cesiumSource = 'node_modules/cesium/Source';
let cesiumWorkers = '../Build/Cesium/Workers';
// 需要排除的包对象
let externals = {};
// // 需要配置的 CDN 链接
let CDN = { css: [], js: [] };
// // 判断是否是开发环境
// const isProduction = process.env.NODE_ENV === 'development';


function resolve(dir) {
  return path.join(__dirname, dir);
}

// const name = defaultSettings.title || 'vue Admin Template'; // page title

// const port = process.env.port || process.env.npm_config_port || 9527; // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  crossorigin: 'use-credentials',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    }},
  configureWebpack: {
    // name: name,
    externals: externals,
    output: {
      sourcePrefix: ' '
    },
    amd: {
      toUrlUndefined: true
    },
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@': path.resolve('src'),
        'cesium': path.resolve(__dirname, cesiumSource)
      },
      fallback: { 'https': false, 'zlib': false, 'http': false, 'url': false }
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          { from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' },
          { from: path.join(cesiumSource, 'Assets'), to: 'Assets' },
          { from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' },
          { from: path.join(cesiumSource, 'ThirdParty'), to: 'ThirdParty' } // 需要整个ThirdParty
        ]
      }),
      new webpack.DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify('./')
      })
    ],
    optimization: {
      nodeEnv: false
    },
    module: {
      // unknownContextCritical: /^.\/.*$/,
      // unknownContextCritical: false
    }
  },

  // 使用svg-sprite-loader编译svg，若使用file-loader时排除src/icon下的svg矢量图标
  chainWebpack: (config) => {
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end();
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end();
  }
  // ,css: {
  //   loaderOptions: {
  //     postcss: {
  //       postcssOptions: {
  //         plugins: [
  //           require('postcss-pxtorem')({
  //             rootValue: 37.5,
  //             propList: ['*'],
  //             selectorBlackList: [
  //               'van-', 'svg-'
  //             ],
  //             exclude: (file)=>{
  //               return file.indexOf('phone') === -1;
  //             }
  //           })
  //         ]
  //       }
  //     }
  //   }
  // }
};
