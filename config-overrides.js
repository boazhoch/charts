/* config-overrides.js */
const workBoxWebpackPlugin = require('workbox-webpack-plugin');


module.exports = function override(config, env) {
    config.plugins = config.plugins.map(plugin => {

        if (plugin.constructor.name === 'GenerateSW') {
            return new workBoxWebpackPlugin.InjectManifest({
                swSrc: './src/sw.js',
                swDest: 'service-worker.js'
            })
        }
        
        return plugin;
    })

    return config;
}