module.exports = {
    chainWebpack: config => {
        config
            .module
            .rule('vue')
            .use('vue-loader')
            .loader('vue-loader')
            .tap(options => {
                options.transformAssetUrls = {
                    audio: 'src',
                };
                return options;
            });
    }
};
