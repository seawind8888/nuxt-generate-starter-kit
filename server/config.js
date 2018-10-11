let config = {
    getRouteApi: 'http://127.0.0.1:8010/route',
    log4jsConfig: {
        appenders: { nuxt: { type: 'file', pattern:'%d{yyyy/MM/dd-hh.mm.ss} %p %c  %m%n',
        // filename: '/dianyi/website/dbit/log/nuxt.log'
        filename: 'log/nuxt.log'
        } },
        categories: { default: { appenders: ['nuxt'], level: 'info' } }
    }
}

module.exports = config