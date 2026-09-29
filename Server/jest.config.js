// --> Los test del Backend se guardan en la carpeta Document/Backend (raiz del repo)
/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/../Document/Backend'],
  // --> Los test estan fuera de Server, asi que buscamos las dependencias en Server/node_modules
  modulePaths: ['<rootDir>/node_modules'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.test.json' }],
  },
};
