module.exports = {
  pwa: {
    name: 'Air-for-Steam Configuration',
    themeColor: '#009bb0',
    msTileColor: '#00acc1',
  },

  lintOnSave: process.env.NODE_ENV !== 'production',
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: '',
  runtimeCompiler: true,
  productionSourceMap: false,
  parallel: true,
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        mac: {
          category: 'public.app-category.utilities',
        },
        linux: {
          category: 'Utility',
        },
      },
    },
  },
}
