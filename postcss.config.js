module.exports = {
  plugins: [
    require('postcss-plugin-namespace')('.ModuleBrowser'),
    require('autoprefixer')
  ]
}
