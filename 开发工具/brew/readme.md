## macOS配置Homebrew镜像

参考文档 https://mirrors.ustc.edu.cn/help/brew.git.html

```sh
cd "$(brew --repo)"
git remote set-url origin https://mirrors.ustc.edu.cn/brew.git
```
