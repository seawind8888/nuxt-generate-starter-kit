const Koa = require('koa')
const fs = require('fs')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const app = new Koa()
const cors = require('@koa/cors')
const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 8010
const config = require('./config.js')
const log4js = require('log4js')
const logger = log4js.getLogger('nuxt');
const spawn = require('child_process').spawn


log4js.configure(config.log4jsConfig);

let static = new Router()
let execQueue = []

function execNode(process, node = []) {
    let local = host == '0.0.0.0'? true:false
    let bash = spawn('node', [`server/build.js`, ...node, local?['-l']:[]])
       
    logger.info('info',`[${process}] 进程开始执行`)
    bash.stdout.on('data', (data) => {
        logger.info('info',`[${process}] 进程 stdout: ${data}`)
    });
    bash.stderr.on('data', (data) => {
        logger.info('info',`[${process}] 进程 stderr: ${data}`)
    });
    bash.on('close', (code) => {
        logger.info('info',`[${process}] 退出进程 ${code}`)
        if(execQueue.length >0) {
            let exec = execQueue.splice(0,1)
            execNode(exec[0].split('=')[0], exec)
        }
    });
    bash.on('error',(code) => {
        logger.info('error',`[${process}] 进程错误  ${code}`)
    })
}


static.get('/', async(ctx) => {
    execQueue = ctx.querystring.split('&')
    ctx.body = {
        code : 0,
        msg : "请求成功，开始构建"
    }
    execNode('init',['-i'])
})

let router = new Router()


router.use('/static', static.routes(), static.allowedMethods())

app.use(cors())
app.use(bodyParser())

app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(port, host)
console.warn('服务已开启' + host + ':' + port)