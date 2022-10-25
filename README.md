# 云崽Bot账号管理插件(js插件)

#### 介绍
改写自[BeterKing](https://gitee.com/zhxhx)的[账号管理插件](https://gitee.com/zhxhx/Yunzai-Bot-js/)，针对[网络抖动造成的token丢失问题](https://gitee.com/zhxhx/Yunzai-Bot-js/issues/I5VXKA)作出了临时解决。该插件适用于[Yunzai-Bot v3](https://gitee.com/Le-niao/Yunzai-Bot)

个人只改动了账号管理.js,其他内容和原项目一致


#### 安装教程

0.  请确保你已经正确搭载了[云崽Bot v3](https://gitee.com/Le-niao/Yunzai-Bot)
1.  将[`QQmanager.js`](https://gitee.com/CUZNIL/Yunzai-QQmanager/blob/master/%E8%B4%A6%E5%8F%B7%E7%AE%A1%E7%90%86.js)文件放入`Yunzai-Bot/plugins/example/`文件夹下
-  如果你已经正确装载了[原项目](https://gitee.com/zhxhx)的插件，再删除[`账号管理.js`](https://gitee.com/zhxhx/Yunzai-Bot-js/blob/main/%E5%B8%90%E5%8F%B7%E7%AE%A1%E7%90%86/%E5%B8%90%E5%8F%B7%E7%AE%A1%E7%90%86.js)即宣告安装结束。
2.  将[`Default.yaml`](https://gitee.com/CUZNIL/Yunzai-QQmanager/blob/master/Default.yaml)文件放入`Yunzai-Bot/recourses`文件夹下
3.  将[`checkonline.js`](https://gitee.com/CUZNIL/Yunzai-QQmanager/blob/master/checkonline.js)文件放入`Yunzai-Bot/lib/event`文件夹下
4.  重启Yunzai-Bot
- 提示：如果不知道如何执行放文件这个操作，可以百度。

#### 使用说明

账号切换：`^(#|(确认))切换(\\d)+$`
配置新账号(请私聊使用)：`^#配置$`
删除配置：`^#删除配置(\\d)+$`
查看已配置账号：`^#查看$`
设置下线自动替换：`^#设置替换(开启|关闭)$`

看不懂正则挺正常，下面说点人话举点例子：

![配置新账号](doc-use/%E9%85%8D%E7%BD%AE%E6%96%B0%E8%B4%A6%E5%8F%B7.png)


#### 我到底改了啥？

首先再强调一下原地址[账号管理插件](https://gitee.com/zhxhx/Yunzai-Bot-js/)

1.  让 **命令匹配** 更人性化了，加了一堆正则和几个函数
2.  删去了原插件的 **小雪等级** 判定`getXiaoxuePermissionLevel` _删除原因：个人不需要这层限制_ 
3.  删去了 **重复头衔** 判定`isHisTitle` _删除原因：同一个群可以有相同的专属头衔，个人不需要这层限制_ 
4.  删去了 **保存全员头衔** `getGroupMemberTitleList` _删除原因：这功能原本用于判断重复头衔，故也不需要了_ 
5.  删去了 **判断** 用户索取头衔是否恰为他的当前头衔`isGaveTitle` _删除原因：个人不需要_
6.  改写了 **头衔设置流程** ：
- 用户索要的头衔过长时先 **裁切文本** ，并在设置成功的提示中 **告知** 专属头衔的限制

![当你索要了过长的头衔](use_in_README.md/%E7%B4%A2%E8%A6%81%E8%BF%87%E9%95%BF%E7%9A%84%E5%A4%B4%E8%A1%94%E6%97%B6.png)
- 设置失败的提示中删去了机器人昵称`${tools.botName}`。 _删除原因：个人不需要。并且如果想维护该功能较为麻烦，难以单独作为js插件使用，如有需要还是下[原插件](http://gitee.com/XueWerY/xiaoxue-plugin)吧！_
![原插件设置失败时](use_in_README.md/%E8%AE%BE%E7%BD%AE%E5%A4%B1%E8%B4%A5%E6%97%B6%E4%BC%9A%E8%B0%83%E7%94%A8%E6%9C%BA%E5%99%A8%E4%BA%BA%E5%90%8D%E7%A7%B0.png)
![改写后](use_in_README.md/%E8%AE%BE%E7%BD%AE%E5%A4%B1%E8%B4%A5%E7%9A%84%E6%96%87%E6%9C%AC%E5%8F%98%E6%9B%B4.png)
- 设置成功的提示中增加了用户索取的 **头衔内容** ，以便于debug以及让用户及时了解自己的命令被如何识别。
![设置成功增加提示](use_in_README.md/%E8%AE%BE%E7%BD%AE%E6%88%90%E5%8A%9F%E5%A2%9E%E5%8A%A0%E6%8F%90%E7%A4%BA.png)
- 删除了私聊使用对应命令时的提示 _删除原因：我的bot为了避免无端封号很早就 **禁用私聊** 了，我建议你们也这么做。_
7.  可能还有别的改了，忘了。但是忘了就是说明不重要，如果你很在意可以去啃代码~

#### 遇到问题/需要联系我/需要使用Bot

群号 **638077675** 

答案  **火花骑士** 

![群](use_in_README.md/group.png)