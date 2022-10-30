import EventListener from '../listener/listener.js'
import fs from 'node:fs'
import { createRequire } from 'module'
import YAML from 'yaml'


let _path = process.cwd()
const require = createRequire(import.meta.url)
const { exec } = require('child_process')

export default class onlineEvent extends EventListener {
    constructor() {
        super({ event: 'system.offline' })
        this.key = 'restart'
        this.keys = 'setrestart'
    }


    /** 默认方法 */
    async execute(e) {
        let setrestart = await redis.get(this.keys)
        if (!setrestart) {
            return true
        }
        let cm = 'npm run restart'
        let asd = this.get('bot')
        let deFault = fs.readFileSync(`${_path}/resources/Default.yaml`, 'utf-8')
        for (let i in asd) {
            if (fs.existsSync(`${_path}/data/${asd[i].qq[0]}/token`)) {
                deFault = deFault.replace(/qq:/g, 'qq: ' + asd[i].qq[0])
                deFault = deFault.replace(/pwd:/g, `pwd:  '${asd[i].pw}'`)
                deFault = deFault.replace(/platform:/g, 'platform: ' + asd[i].plat[0])
                fs.writeFileSync(`${_path}/config/config/qq.yaml`, deFault, 'utf8')
                break
            }
        }
        /*
        2022年10月30日13:42:26
        修改了代码，仅当能查找到有token的账号时覆盖qq.yaml，否则不切换账号直接重启
        这样做的目的是避免
            网络抖动导致所有账号都没有token时
            原代码会导致覆盖空账号
            让Bot主人感到很蒙蔽然后发现控制台提示登录新账号
        的问题。
        原文件：https://gitee.com/zhxhx/Yunzai-Bot-js/blob/main/%E5%B8%90%E5%8F%B7%E7%AE%A1%E7%90%86/checkonline.js
        //*/
        console.log("开始重启")
        await redis.set(this.key, '1')
        exec(cm, { windowsHide: true }, (error, stdout, stderr) => {
            if (error) {
                redis.del(this.key)
                logger.error(`重启失败\n${error.stack}`)
            } else if (stdout) {
                logger.mark('重启成功，运行已由前台转为后台')
                logger.mark('查看日志请用命令：npm run log')
                logger.mark('停止后台运行命令：npm stop')
                process.exit()
            }
        })
    }

    get(name) {
        let file = `${_path}/resources/${name}.yaml`
        let key = `${name}`
        this[key] = YAML.parse(
            fs.readFileSync(file, 'utf8')
        )
        return this[key]
    }
}
