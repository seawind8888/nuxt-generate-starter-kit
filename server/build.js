
const {
    Nuxt,
    Builder,
    Generator
} = require('nuxt');
const utils = require('./common/utils.js')
const config = require('./config.js')
const file = require('../nuxt.config.js')
const log4js = require('log4js')
const logger = log4js.getLogger('nuxt');


log4js.configure(config.log4jsConfig);
let nuxt, init = process.argv[2] == '-i'?true:false


async function start () {
    let routes = [...init?utils.getStaticRoutes():[],...init?[]:utils.getDynamicRoute(process.argv[2])]
    logger.info('info',`构建路由: ${routes}`)
    
    nuxt = new Nuxt(file)
    builder = new Builder(nuxt);
    nuxt.hook('generate:routeFailed', function ({nuxt, errors}) {
        logger.error('error',errors)
    })
    nuxt.hook('generate:done', function ({nuxt, errors}) {
        logger.error('error',errors)
    })
    await new Generator(nuxt, builder).generate({
        build: init?true:false, // *如果不执行new Builder 或是开启此属性，.nuxt文件下不会生成dist文件，导致生成html卡住
        init: false
    })

}

start()