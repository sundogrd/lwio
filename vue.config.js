const CompressionWebpackPlugin = require('compression-webpack-plugin')
const path = require('path')

const productionGzipExtensions = ['js', 'css']

const readCookie = cookieFile => {
  try {
    if (!cookieFile) {
      return null
    }
    const content = fs.readFileSync(cookieFile, {
      encoding: 'utf8'
    })
    return content
  } catch (ex) {
    return null
  }
}

module.exports = {
  configureWebpack: config => {
    config.resolve = {
      ...config.resolve,
      extensions: ['.js', '.ts', '.vue', '.json'],
      mainFiles: ['index'],
      alias: {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, 'src/')
      }
    }
    config.devServer = {
      disableHostCheck: true,
      proxy: {
        '/api': {
          target: 'https://lwio.sundogrd.com',
          secure: false,
          changeOrigin: true,
          headers: {
            cookie: readCookie(path.join(__dirname, '.cookie'))
          }
        }
      },
      clientLogLevel: 'info',
      watchOptions: {
        poll: true
      }
    }

    if (process.env.NODE_ENV === 'production') {
      // 生产环境build gzip
      config.plugins.push(new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      }))
    }
  },

  pluginOptions: {
    lintStyleOnBuild: false,
    stylelint: {}
  }
}
