const ip = require('ip').address();
module.exports = {

    baseUrl: process.env.BASE_URL,

    // 将构建好的文件输出到哪里
    outputDir: process.env.outputDir,
    assetsDir: 'static',

    css: {
        loaderOptions: {
            // pass options to sass-loader
            sass: {
                // @/ is an alias to src/
                // so this assumes you have a file named `src/variables.scss`
                data: `@import "@/assets/css/_reset.scss";@import "@/assets/css/_base.scss";`
            }
        }
    },

    lintOnSave: false,

    // 配置 webpack-dev-server 行为。
    devServer: {
        // open: process.platform === 'darwin',
        // localhost
        host: ip,
        port: 8080,
        https: false,
        hotOnly: false,
        open:true,
        proxy: {
            '/api': {
                // 目标 API 地址
                target: 'https://mapi.qulaxin.com/api/v1/',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        },
        // before: app => {}
    },
    chainWebpack: config => {
        config.resolve.symlinks(true);
        config.module
            .rule('images')
            .use('url-loader')
            .loader('url-loader')
            .tap(options => {
                options.limit = 10000
                return options
            })
    },

    // 第三方插件的选项
    pluginOptions: {
        "postcss-import": {},
        "postcss-url": {},
        "postcss-aspect-ratio-mini": {},
        "postcss-write-svg": { utf8: false },
        "postcss-cssnext": {},
        "postcss-px-to-viewport-opt": {
            viewportWidth: 750,// 视窗的宽度，对应的是我们设计稿的宽度，一般是750
            // viewportHeight: 1334, // 视窗的高度，根据750设备的宽度来指定，一般指定1334，也可以不配置
            unitPrecision: 3, // 指定`px`转换为视窗单位值的小数位数（很多时候无法整除）
            viewportUnit: 'vw', // 指定需要转换成的视窗单位，建议使用vw
            selectorBlackList: ["lx"], // 指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名
            minPixelValue: 1, // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值
            mediaQuery: false // 允许在媒体查询中转换`px`
        },
        "postcss-viewport-units": {},
        "cssnano": {
            preset: "default"
        }
    },

    runtimeCompiler: false,
    productionSourceMap: false,
    parallel: undefined
}
