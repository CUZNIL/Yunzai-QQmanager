/*
发送 #账号管理帮助 获取详细帮助
项目原地址https://gitee.com/zhxhx/Yunzai-Bot-js/ （貌似关闭了，不过本js大量代码都是他写的，特别注明下。）
项目改版地址https://gitee.com/CUZNIL/Yunzai-QQmanager/
如果该插件失效，前往改版地址获取最新版，如果依旧失效请提交issue。
如果决定要卸载本插件，请不要单独删除本js，否则可能导致BOT无法正常响应消息！！！！！
正确卸载姿势是对BOT说：“卸载账号管理插件，但是保留账密在/resources/QQmanager/bot.yaml”，这样插件会删除除了账密文件的所有该插件生成的文件（包括自身）。
如果你账密不需要在云崽目录记录，卸载请发送“完全卸载账号管理插件”，这样插件会删除所有该插件生成的文件（包括自身）。
此js最后一次编辑于2023-3-5 01:18:38
//*/
import fs from 'node:fs'
import YAML from 'yaml'
import { Restart } from '../other/restart.js'
import cfg from '../../lib/config/config.js'

let qq = 0
let pw
let First_Run = false

export class zhanghao extends plugin {
  constructor() {
    super({
      name: '帐号管理',
      event: 'message',
      priority: 4000,
      rule: [
        {
          reg: '^(#|(确认))切换(\\d)+$',
          fnc: 'change',
          permission: 'master'
        },
        {
          reg: '^#配置$',
          fnc: 'int',
          permission: 'master'
        },
        {
          reg: '^#删除配置(\\d)+$',
          fnc: 'del',
          permission: 'master'
        },
        {
          reg: '^#查看$',
          fnc: 'check',
          permission: 'master'
        },
        {
          reg: '^#设置替换(开启|关闭)$',
          fnc: 'setchange',
          permission: 'master'
        },
        {
          reg: '^卸载账号管理插件，但是保留账密在/resources/QQmanager/bot.yaml$',
          fnc: 'uninstallALL',
          permission: 'master'
        },
        {
          reg: '^完全卸载账号管理插件$',
          fnc: 'uninstall',
          permission: 'master'
        },
        {
          reg: '^#?账号?管理?(帮助)?$',
          fnc: 'help',
          permission: 'master'
        }
      ]
    })
    let yaml = []
    this._path = process.cwd()
    /** 生成bot.yaml文件存储帐号数据 */
    if (!fs.existsSync(`${this._path}/resources/QQmanager`)) {
      First_Run = true
      fs.mkdirSync(`${this._path}/resources/QQmanager`)
      fs.writeFileSync(`${this._path}/resources/QQmanager/bot.yaml`, YAML.stringify(yaml), 'utf8')
      fs.writeFileSync(`${this._path}/resources/QQmanager/Default.yaml`,
        `# qq账号
qq:
# 密码，为空则用扫码登录,扫码登录现在仅能在同一ip下进行
pwd:
# 1:安卓手机、 2:aPad 、 3:安卓手表、 4:MacOS 、 5:iPad
platform:
`, 'utf8')
      fs.writeFileSync(`${this._path}/lib/events/checkonline.js`,
        `import EventListener from '../listener/listener.js'
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
              let deFault = fs.readFileSync(\`${_path}/resources/QQmanager/Default.yaml\`, 'utf-8')
              for (let i in asd) {
                  if (fs.existsSync(\`${_path}/data/${asd[i].qq[0]}/token\`)) {
                      deFault = deFault.replace(/qq:/g, 'qq: ' + asd[i].qq[0])
                      deFault = deFault.replace(/pwd:/g, \`pwd:  '${asd[i].pw}'\`)
                      deFault = deFault.replace(/platform:/g, 'platform: ' + asd[i].plat[0])
                      fs.writeFileSync(\`${_path}/config/config/qq.yaml\`, deFault, 'utf8')
                      break
                  }
              }
              console.log("开始重启")
              await redis.set(this.key, '1')
              exec(cm, { windowsHide: true }, (error, stdout, stderr) => {
                  if (error) {
                      redis.del(this.key)
                      logger.error(\`重启失败\n${error.stack}\`)
                  } else if (stdout) {
                      logger.mark('重启成功，运行已由前台转为后台')
                      logger.mark('查看日志请用命令：npm run log')
                      logger.mark('停止后台运行命令：npm stop')
                      process.exit()
                  }
              })
          }
      
          get(name) {
              let file = \`${_path}/resources/QQmanager/${name}.yaml\`
              let key = \`${name}\`
              this[key] = YAML.parse(
                  fs.readFileSync(file, 'utf8')
              )
              return this[key]
          }
      }
      `, 'utf8')
    }
    this.asd = this.get('bot')
    this.key = 'restart'
    this.keys = 'setrestart'
  }

  async init() {
    let restart = await redis.get(this.key)
    let msg = '上个帐号掉线了,已为你替换帐号!'
    if (restart) {
      Bot.pickUser(cfg.masterQQ).sendMsg(msg)
    }
    redis.del(this.key)
  }

  async change() {
    let deFault = fs.readFileSync(`${this._path}/resources/QQmanager/Default.yaml`, 'utf-8')
    let msg = this.e.msg.match(/\d+/g, '')
    if (parseInt(msg) > this.asd.length) {
      this.reply("你有那么多帐号吗?#查看 自己看看去！")
      return true
    }
    let QQ = this.asd[parseInt(msg) - 1].qq[0]
    let PW = this.asd[parseInt(msg) - 1].pw
    let Plat = this.asd[parseInt(msg) - 1].plat[0]
    if (QQ === Bot.uin) {
      this.reply("不能切换自己的帐号哦!想重启的话直接#重启 就行了！")
      return true
    }
    if (!(fs.existsSync(`${this._path}/data/${QQ}_token`) || this.e.msg.includes("确认"))) {
      this.reply(`该帐号可能未通过登录验证,不支持切换!如确认要切换此账号请发送单条消息“确认切换${msg}”(注意没有#)`)
      return true
    }
    deFault = deFault.replace(/qq:/g, 'qq: ' + QQ)
    deFault = deFault.replace(/pwd:/g, `pwd:  '${PW}'`)
    deFault = deFault.replace(/platform:/g, 'platform: ' + Plat)
    fs.writeFileSync(`${this._path}/config/config/qq.yaml`, deFault, 'utf8')
    this.reply("切换成功，即将重启!")
    setTimeout(() => this.restart(), 2000)
  }

  async check() {
    let msg = []
    let title = [`帐号如下:\n(当前帐号为${Bot.uin})`]
    for (let i in this.asd) {
      msg.push(`${parseInt(i) + 1}、${this.asd[i].qq[0]}。该账号${fs.existsSync(`${this._path}/data/${this.asd[i].qq[0]}_token`) ? "有token" : "无token，请谨慎切换"}`)
    }
    msg.push(`切换账号的指令是#切换+数字\n非账号封禁导致的token消失一般可以正常切换\n更多指令回复#账号管理帮助 获取`)
    let forward = await this.makeForwardMsg(Bot.uin, title, msg)
    this.reply(forward)
  }

  async int() {
    if (this.e.isGroup) {
      this.reply("请私聊配置哦~")
      return true
    }
    this.setContext('getqq')
    await this.reply("请发送qq号!")
  }

  /** 获取qq号、密码、设备 */
  async getqq() {
    if (/结束/.test(this.e.msg)) {
      this.reply("已结束配置")
      this.finish('getqq')
      return true
    }
    let data = this.e.msg.match(/\d+/g)
    qq = parseInt(data)
    if (data == null) {
      this.reply("请输入正确的qq号!")
      this.finish('getqq')
      return true
    } else {
      for (let i in this.asd) {
        if (this.asd[i].qq[0] === qq) {
          this.reply("该账户已配置")
          this.finish('getqq')
          return true
        }
      }
    }
    this.setContext('getpw')
    await this.reply("请输入密码!")
    this.finish('getqq')
  }

  async getpw() {
    if (/结束/.test(this.e.msg)) {
      this.reply("已结束配置")
      this.finish(`getpw`)
      return true
    }
    pw = this.e.msg
    this.setContext('getplat')
    await this.reply("请选择登录设备!\n1:安卓手机、 2:aPad 、 3:安卓手表、 4:MacOS 、 5:iPad")
    this.finish(`getpw`)
  }

  getplat() {
    if (/结束/.test(this.e.msg)) {
      this.reply("已结束配置")
      this.finish('getplat')
      return true
    }
    let plat = parseInt(this.e.msg)
    if (plat === null) {
      this.reply("请输入正确的设备号!")
      return true
    }
    if (/无/.test(pw)) {
      this.asd.push({ 'qq': [qq], 'pw': [], 'plat': [plat] })
      fs.writeFileSync(`${this._path}/resources/QQmanager/bot.yaml`, YAML.stringify(this.asd), 'utf8')
    } else {
      this.asd.push({ 'qq': [qq], 'pw': [pw], 'plat': [plat] })
      fs.writeFileSync(`${this._path}/resources/QQmanager/bot.yaml`, YAML.stringify(this.asd), 'utf8')
    }
    if (!fs.existsSync(`${this._path}/data/${qq}_token`)) {
      this.reply("该帐号可能未通过登录验证,请及时通过登录验证,否则将会影响帐号切换!")
    } else {
      this.reply("配置成功!")
    }
    this.finish('getplat')
  }

  async del() {
    let del = this.e.msg.match(/\d+/g, '')
    if (parseInt(del) > this.asd.length) {
      this.reply("你有那么多帐号吗?")
      return true
    }
    this.asd.splice(del - 1, 1)
    fs.writeFileSync(`${this._path}/resources/QQmanager/bot.yaml`, YAML.stringify(this.asd), 'utf8')
    this.reply("删除成功!")
    return true
  }

  async setchange() {
    if (/开启/.test(this.e.msg)) {
      await redis.set(this.keys, '1')
      await this.reply("下线替换已开启!")
      if (First_Run)
        this.reply("您似乎是第一次使用本插件，请手动重启一次BOT，否则可能导致该插件无法正常工作。")
      return true
    }
    if (/关闭/.test(this.e.msg)) {
      redis.del(this.keys)
      this.reply("下线替换已关闭!")
      return true
    }
  }


  async uninstallALL() {
    this.reply("非常抱歉，还没写完orz")
  }
  
  
  async uninstall() {
    this.reply("非常抱歉，还没写完呜呜呜")
  }


  async help(e) {
    let msg = [
      {
        message: `#配置\n#删除配置 + 数字\n配置中间可以选择发送"结束"来结束配置。如是扫码登录的，配置密码时发送"无"。同时配置的帐号请注意要通过验证，即data文件下对应qq号有token文件。并且配置的设备请与通过验证时的设备保持一致，否则切换帐号时会直接掉线！`,
        user_id: Bot.uin,
        nickname: "增删"
      },
      {
        message: `#查看\n查看已添加的马甲`,
        user_id: Bot.uin,
        nickname: "查"
      },
      {
        message: `#切换 + 数字\n手动切换马甲`,
        user_id: Bot.uin,
        nickname: "改"
      },
      {
        message: `#设置替换开启 #设置替换关闭\n开启时，云崽掉线时会自动切换下一个有token的马甲。`,
        user_id: Bot.uin,
        nickname: "自动替换"
      },
      {
        message: `当你不想使用本插件时，请务必使用以下指令卸载本插件，以免后续BUG：\n如果需要在云崽目录保留你的所有账密信息，请发送“卸载账号管理插件，但是保留账密在/resources/QQmanager/bot.yaml”。\n如果需要完全卸载本插件，请发送“完全卸载账号管理插件”。为了方便手机端复制，下面俩条消息单独列出。`,
        user_id: Bot.uin,
        nickname: "卸载建议"
      },
      {
        message: `卸载账号管理插件，但是保留账密在/resources/QQmanager/bot.yaml`,
        user_id: Bot.uin,
        nickname: "保留账密卸载"
      },
      {
        message: `完全卸载账号管理插件`,
        user_id: Bot.uin,
        nickname: "完整卸载"
      },
      {
        message: `本插件地址：https://gitee.com/CUZNIL/Yunzai-QQmanager/，github同用户名项目名，可能会保持更新。`,
        user_id: Bot.uin,
        nickname: "插件地址"
      },
    ]
    let forwardMsg = await e.group.makeForwardMsg(msg)
    forwardMsg.data = forwardMsg.data
      .replace(/\n/g, '')
      .replace(/<title color="#777777" size="26">(.+?)<\/title>/g, '___')
      .replace(/___+/, `<title size=\"34\" maxLines=\"2\" lineSpace=\"12\">#账号管理帮助</title><title color="#777777" size="26">QQ马甲管理工具</title>`)
    await e.reply(forwardMsg)
  }

  /** 获取yaml文件内容 */
  get(name) {
    let file = `${this._path}/resources/QQmanager/${name}.yaml`
    let key = `${name}`
    this[key] = YAML.parse(
      fs.readFileSync(file, 'utf8')
    )
    return this[key]
  }
  /** 制作转发内容 */
  async makeForwardMsg(qq, title, msg) {
    let nickname = Bot.nickname
    if (this.e.isGroup) {
      let info = await Bot.getGroupMemberInfo(this.e.group_id, qq)
      nickname = info.card ?? info.nickname
    }
    let userInfo = {
      user_id: Bot.uin,
      nickname
    }
    let forwardMsg = [
      {
        ...userInfo,
        message: title
      }
    ]
    for (let i in msg) {
      forwardMsg.push(
        {
          ...userInfo,
          message: msg[i]
        }
      )
    }
    /** 制作转发内容 */
    if (this.e.isGroup) {
      forwardMsg = await this.e.group.makeForwardMsg(forwardMsg)
    } else {
      forwardMsg = await this.e.friend.makeForwardMsg(forwardMsg)
    }
    /** 处理描述 */
    forwardMsg.data = forwardMsg.data
      .replace(/\n/g, '')
      .replace(/<title color="#777777" size="26">(.+?)<\/title>/g, '___')
      .replace(/___+/, `<title color="#777777" size="26">${title}</title>`)
    return forwardMsg
  }

  restart() {
    new Restart(this.e).restart()
  }


}



