module.exports = {
  configureWebpack: {
    devServer: {
        clientLogLevel: 'info',
        watchOptions: {
            poll: true
        }
    }
  },

  pluginOptions: {
    lintStyleOnBuild: false,
    stylelint: {}
  }
}
