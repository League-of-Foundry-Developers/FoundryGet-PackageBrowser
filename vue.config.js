module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/FoundryGet-PackageBrowser/'
    : '/',
  chainWebpack: config => {
    if (process.env.NODE_ENV === "production") {
    }
  }
};
