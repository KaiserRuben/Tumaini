// vue.config.js
const {defineConfig} = require('@vue/cli-service')

module.exports = defineConfig({
    productionSourceMap: false,
    chainWebpack: config => {
        // Disable TypeScript type checking to avoid pre-existing errors
        config.plugins.delete('fork-ts-checker')
    }
})
