const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const modifyVars = require('./themes/dark.js');

module.exports = {
    useMultipleTheme: false, // 是否开启多主题
    isCombinePortal: true,  //是否集成到portal
    isNoticeUpdate: false,  //是否开启更新通知，会在terminal控制台给出提醒
    publicPath: '/doiaWeb/',
    themes: [
        {
            name: 'light',
            entryPath: path.resolve(__dirname, './themes/light.js')
        },
        {
            name: 'dark',
            entryPath: path.resolve(__dirname, './themes/dark.js')
        }
    ],
    modifyVars, // 非多主题下样式变量

    htmlTagsPlugin: config => {
        config.tags = [
            'conf/env-config.js',
        ];
        return config;
    },
    devServer: config => {
        config.host = '0.0.0.0';
        config.port = 8802;
        config.proxy = {
            // '/gateway': {
            //   target: 'http://10.0.7.169:18551',
            //   changeOrigin: true,
            //   pathRewrite: {
            //     '^/gateway': ''
            //   }
            // },
            '/api/v1/doia': {
                // target: 'http://10.0.20.182:18081',
                // target: 'http://10.0.12.24:18371',
                target: 'http://10.0.2.191:18375',
                // target: "http://10.0.23.210:18081",
                // target: "http://10.0.9.47:18751"
                // target: "http://10.0.22.133:18081",
                // target: "http://10.0.23.104:18089",
                // target: "http://10.1.23.193:18081", //日志模式
                // target: "http://10.0.20.98:18089",
                // target: "http://10.0.20.136:18081",
                // target: "http://10.0.21.167:18081", //jayson
                // target:"http://10.0.21.188:18088", //日志异常检测
                changeOrigin: true,
            },
            "/gateway/douc": {   //调用douc接口获取标签页icon路径
                target: "http://10.0.9.47:18751",
                changeOrigin: true,
                pathRewrite: {
                    '^/gateway': ''
                }
            },
            "/gateway/doia": {  //调用固定网关接口获取页脚version版本信息
                // target: 'http://10.0.21.167:18081',
                // target: 'http://10.0.12.24:18371',
                target: 'http://10.0.2.192:18371',
                // target: 'http://10.0.7.240:18371',
                changeOrigin: true,
                pathRewrite: {
                    '^/gateway/doia': ''
                }
            },
            "/gateway/portal": {  //获取nacos配置
                target: "http://10.0.2.191:18080",
                // target: "http://10.0.6.84:18080",
                changeOrigin: true,
                // pathRewrite: {
                //     '^/gateway/portal': ''
                // }
            }
        };
        return config;
    },
    expandConfig/* 配置名称 */: (original/* 默认配置 */) => {
        // 合并规则（merge.smart）
        return {
            module: {
                rules: [
                    {
                        test: /\.md$/,
                        loader: 'raw-loader'
                    }
                ]
            },
            plugins: [
                new MonacoWebpackPlugin({
                    languages: ["sql", "json", "custom-sql"],
                    features: ["coreCommands", "find"]
                }),
                // Ignore require() calls in vs/language/typescript/lib/typescriptServices.js
                new webpack.IgnorePlugin(
                    /^((fs)|(path)|(os)|(crypto)|(source-map-support))$/,
                    /vs(\/|\\)language(\/|\\)typescript(\/|\\)lib/
                )
            ]
        };
    },
    build: config => {
        // 走babel
        config.module.rules[1].include = config.module.rules[1].include.concat([
            path.resolve(__dirname, '../node_modules/sql-formatter'),
            path.resolve(__dirname, '../node_modules/whatwg-fetch')
        ]);
        return config;
    }
};
