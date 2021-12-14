module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/vue-elTable-plus/'
    : '/',
  css: { extract: false }
}