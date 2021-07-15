module.exports = {
  transpileDependencies: ["vuetify"],
	outputDir: "../server/src/public",	
	baseURL: 'https://umk.coko38.ru',
	devServer: {
    proxy: 'http://localhost:3000'
  },
}
