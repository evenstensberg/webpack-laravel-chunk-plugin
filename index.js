const {join, resolve} = require('path');
const {readFileSync} = require('fs');

const recursiveFind = require('./recursive-find');
const findInvoc = require('./find-invocation');

const laravelPath = resolve(process.cwd());
const gitIgnorePath = resolve(laravelPath, '.gitignore');
const gitIgnoreFile = readFileSync(gitIgnorePath, 'utf8').split('\n');

const excluded = [
    'node_modules',
    '.git',
    'vendor',
    'tests',
    'storage'
].concat(gitIgnoreFile);

const globFiles = recursiveFind(laravelPath, excluded);

const defaultOptions = {
    src: globFiles
}

class WebpackLaravelChunkPlugin {
    constructor(options) {
      this.pluginOpts = options || defaultOptions;

      this.pluginOpts.src = findInvoc(this.pluginOpts.src);
    }
  
    apply(compiler) {
      compiler.hooks.afterEmit.tapAsync('webpackLaravelChunkPlugin', (compilation, callback) => {
        /* Read chunks, compare with laravel blade files */
        callback();
      });
    }
  }
  
  module.exports = WebpackLaravelChunkPlugin;