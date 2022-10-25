import EventListener from '../listener/listener.js'
import fs from 'node:fs'
import { createRequire } from 'module'
import YAML from 'yaml'


let _path = process.cwd()
const require = createRequire(import.meta.url)
const { exec } = require('child_process')

export default class onlineEvent extends EventListener {
    constructor () {
      super({ event: 'system.offline' })
      this.key = 'restart'
      this.keys = 'setrestart'
    }

  
    /** 默认方法 */
    async execute (e) {
      let setrestart = await redis.get(this.keys)
      if(!setrestart){
        return true
      }
      let cm='npm run restart'
      let asd = this.get('bot')
      let deFault =fs.readFileSync(`${_path}/resources/Default.yaml`,'utf-8')
      for(let i in asd){
        if (fs.existsSync(`${_path}/data/${asd[i].qq[0]}/token`)){
          deFault = deFault.replace(/qq:/g,'qq: '+ asd[i].qq[0])
          deFault = deFault.replace(/pwd:/g,`pwd:  '${asd[i].pw}'`)
          deFault = deFault.replace(/platform:/g,'platform: ' + asd[i].plat[0])
          break
        }
      }
      fs.writeFileSync(`${_path}/config/config/qq.yaml`, deFault, 'utf8')
      console.log("开始重启")
      await redis.set(this.key, '1')
      exec(cm, { windowsHide: true }, (error, stdout, stderr) => {
        if (error) {
          redis.del(this.key)
          logger.error(`重启失败\n${error.stack}`)
        }else if (stdout) {
          logger.mark('重启成功，运行已由前台转为后台')
          logger.mark('查看日志请用命令：npm run log')
          logger.mark('停止后台运行命令：npm stop')
          process.exit()
        }
      })
    }

    get (name) {
      let file = `${_path}/resources/${name}.yaml`
      let key = `${name}`
      this[key] = YAML.parse(
        fs.readFileSync(file, 'utf8')
      )
      return this[key]
    }
  }
