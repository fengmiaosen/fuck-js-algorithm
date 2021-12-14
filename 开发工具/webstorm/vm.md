## webstorm vm配置项

### webstorm.vmoptions

* 文件路径

```
~/Library/Application Support/JetBrains/WebStorm2021.2/webstorm.vmoptions
```

## 常见问题

### macOS webstorm改动webstorm.vmoptions导致其无法启动

1. macOS自带终端打开 ` ~ /Applications/WebStorm.app/Contents/MacOS/webstorm`查看具体的启动错误信息
2. finder中打开上述webstorm.vmoptions所在文件目录 `~/Library/Application Support/JetBrains/WebStorm2021.2/webstorm.vmoptions`，注意 `WebStorm2021.2`是本机安装的具体应用版本号，有所不同
3. 根据第一步中的提示修改相关配置后，运行webstorm


* [Directories used by the IDE to store settings, caches, plugins and logs](https://intellij-support.jetbrains.com/hc/en-us/articles/206544519)
* [IDEA mac版本破解时idea.vmoptions配置出错，导致idea无法启动](https://blog.csdn.net/qq_41273599/article/details/102553574?utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromMachineLearnPai2%7Edefault-2.no_search_link&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromMachineLearnPai2%7Edefault-2.no_search_link)