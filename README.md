# 云崽Bot账号管理插件(js插件)

### 介绍
[账号管理插件](https://gitee.com/zhxhx/Yunzai-Bot-js/)改写自[BeterKing](https://gitee.com/zhxhx)，针对[网络抖动造成的token丢失问题](https://gitee.com/zhxhx/Yunzai-Bot-js/issues/I5VXKA)作出了临时解决。该插件适用于[Yunzai-Bot v3](https://gitee.com/Le-niao/Yunzai-Bot)

个人只改动了账号管理.js,其他内容和原项目一致


### 安装教程

0.  请确保你已经正确搭载了[云崽Bot v3](https://gitee.com/Le-niao/Yunzai-Bot)
1.  将[`QQmanager.js`](https://gitee.com/CUZNIL/Yunzai-QQmanager/blob/master/%E8%B4%A6%E5%8F%B7%E7%AE%A1%E7%90%86.js)文件放入`Yunzai-Bot/plugins/example/`文件夹下
-  如果你已经正确装载了[原项目](https://gitee.com/zhxhx)的插件，再删除[`账号管理.js`](https://gitee.com/zhxhx/Yunzai-Bot-js/blob/main/%E5%B8%90%E5%8F%B7%E7%AE%A1%E7%90%86/%E5%B8%90%E5%8F%B7%E7%AE%A1%E7%90%86.js)即宣告安装结束。
2.  将[`Default.yaml`](https://gitee.com/CUZNIL/Yunzai-QQmanager/blob/master/Default.yaml)文件放入`Yunzai-Bot/recourses`文件夹下
3.  将[`checkonline.js`](https://gitee.com/CUZNIL/Yunzai-QQmanager/blob/master/checkonline.js)文件放入`Yunzai-Bot/lib/event`文件夹下
4.  重启Yunzai-Bot
- 提示：如果不知道如何执行放文件这个操作，可以百度。

### 使用说明

配置新账号(请私聊使用)：`^#配置$`，中途可以使用“结束”来中断配置流程。

查看已配置账号：`^#查看$`。

删除账号：`^#删除配置(\\d)+$`。

账号切换：`^(#|(确认))切换(\\d)+$`。




设置下线自动替换：`^#设置替换(开启|关闭)$`。

看不懂正则挺正常，下面说点人话举点例子。如果图片没能正确加载请[点击此处](https://gitee.com/CUZNIL/Yunzai-QQmanager/blob/master/doc-use/%E6%BC%94%E7%A4%BA%E7%94%A8%E8%81%8A%E5%A4%A9%E8%AE%B0%E5%BD%95.txt)
#### 配置新账号
![配置新账号](doc-use/%E9%85%8D%E7%BD%AE%E6%96%B0%E8%B4%A6%E5%8F%B7.png)
#### 查看已配置账号
![查看已配置账号](doc-use/%E6%9F%A5%E7%9C%8B.png)
#### 删除账号
![删除账号](doc-use/%E5%88%A0%E9%99%A4%E8%B4%A6%E5%8F%B7.png)
#### 主动切换账号
![主动切换账号](doc-use/%E4%B8%BB%E5%8A%A8%E5%88%87%E6%8D%A2%E8%B4%A6%E5%8F%B7.png)
![切换失败提示](doc-use/%E5%88%87%E6%8D%A2%E5%A4%B1%E8%B4%A5%E6%8F%90%E7%A4%BA.png)

### 我到底改了啥？

首先再强调一下原地址[账号管理插件](https://gitee.com/zhxhx/Yunzai-Bot-js/)

1.  让 **命令匹配** 更人性化了，加了一堆正则和几个函数
2.  删去了原插件的 **小雪等级** 判定`getXiaoxuePermissionLevel` _删除原因：个人不需要这层限制_ 
3.  删去了 **重复头衔** 判定`isHisTitle` _删除原因：同一个群可以有相同的专属头衔，个人不需要这层限制_ 
4.  删去了 **保存全员头衔** `getGroupMemberTitleList` _删除原因：这功能原本用于判断重复头衔，故也不需要了_ 
5.  删去了 **判断** 用户索取头衔是否恰为他的当前头衔`isGaveTitle` _删除原因：个人不需要_
6.  改写了 **头衔设置流程** ：
- 用户索要的头衔过长时先 **裁切文本** ，并在设置成功的提示中 **告知** 专属头衔的限制
![改动](doc-use/Change.png)

### 遇到问题/需要联系我/需要使用Bot

群号 **638077675** 

答案  **火花骑士** 

[![群](doc-use/QQ%E7%BE%A4.png)](http://jq.qq.com/?_wv=1027&k=tqiOtCVc)