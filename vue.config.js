module.exports = {
  transpileDependencies: ["vuetify"],
  publicPath: process.env.NODE_ENV === 'production'
    ? '/FoundryGet-PackageBrowser/'
    : '/',
  chainWebpack: config => {
    if (process.env.NODE_ENV === "production") {config.module.rule('vue')
        .use('vuetify-loader')
          .loader('vuetify-loader')
    }
  }
};
