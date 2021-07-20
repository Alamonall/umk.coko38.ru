module.exports = {
  transpileDependencies: ['vuetify'],
	outputDir: '../server/src/public',
	publicPath: 'https://umk.coko38.ru',
	devServer: {
    proxy: 'http://localhost:3000'
  },
}
