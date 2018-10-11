const fs = require('fs')
const path = require('path')
const root = path.resolve('pages') 

let utils = {
  getDynamicRoute: (routes) => {
    let routesArr = [],
        route = routes.split('=')
    if (!routes) {
      throw new Error('ids is not found')
    }
    route[1].split(',').forEach((e, i) => {
      if (e.indexOf('-') >= 0) {
        let limit = e.split('-'),
          min = Number(limit[0]),
          max = Number(limit[1]) + 1
        for (let i = min; i < max; i++) {
          routesArr.push(`/${route[0]}/${i}`)
        }
      } else {
        routesArr.push(`/${route[0]}/${e}`)
      }
    })

    return routesArr
    
  },
  getStaticRoutes: () => {
    // 遍历文件获取静态
    let paths = fs.readdirSync(root),
        routes = []
    paths.forEach((path) => {
        let file = fs.statSync(root +'/'+ path)
        if(file.isFile()) {
            routes.push(`/${path}`)
        }
    })
    return routes
  }
}

module.exports = utils
