const Bundler = require('parcel-bundler');
const Path = require('path');

// Localização do arquivo como único entrypoint:
// const entryFiles = Path.join(__dirname, './index.html');
// Ou: múltiplos arquivos como globbing (também pode ser como .js)
// const entryFiles = './src/*.js';
// Ou: múltiplos arquivos em um array
const entryFilesBE = ['./src/BE/background.js'];
const entryFilesFE = ['./src/FE/content.js']

// Opções do bundler
const makeOptions = (filename) => {
    const options = {
      outDir: './pkg', // O diretório de saída para construir os arquivos, dist é o padrão
      outFile: `${filename}`, // O nome do arquivo de saída
      target: 'browser', // browser/node/electron, browser é o padrão
      https: true,
      logLevel: 2, // 5 = irá salvar tudo em um arquivo, 4 = assim como o 3 mas com timestamp e adicionalmente irá logar as requisições http realizadas para o servidor, 3 = irá loggar tudo, 2 = irá loggar avisos e erros, 1 = irá loggar erros
      sourceMaps:  , // Habilita ou desabilita sourcemaps, habilitado é o padrão (builds minificadas atualmente sempre criam sourcemaps)
      hmrHostname: '', // Um hostname para hot module reload, "" é o padrão
      detailedReport: false // Exibe um report detalhado dos bundles, assets, tamanho de arquivos e tempos, false é o padrão, os reports são exibidos somente se o watch estiver desabilidado
    };
    return options
}

(async function() {
  // Inicializa o bundler utilizando a localização do entrypoint e as configurações especificadas.
  const bundlerBE = new Bundler(entryFilesBE, makeOptions('background.js'));
  const bundlerFE = new Bundler(entryFilesFE, makeOptions('content.js'));

  // Executa o bundler, isto retorna o bundle principal
  // Utiliza os eventos, se você estiver com o modo watch essa promise será disparada uma única vez e não a cada rebuild
  await bundlerBE.bundle();
  await bundlerFE.bundle();
})();