# Playwright MCP 安装和配置完整指南

## 🎯 安装状态

✅ **已完成的步骤：**
- Node.js 环境检查 (v22.18.0)
- Playwright MCP 包安装
- Playwright 浏览器引擎安装
- 配置文件创建

## 📦 已安装的包

1. **better-playwright-mcp3** - 高性能 Playwright MCP 实现
2. **@frank-tech/playwright-mcp** - 稳定的 Playwright MCP 包
3. **Playwright 浏览器引擎** - Chromium, Firefox, WebKit

## ⚙️ Claude Desktop 配置

### 步骤 1: 找到配置文件
配置文件位置：`~/Library/Application Support/Claude/claude_desktop_config.json`

### 步骤 2: 添加 MCP 服务器配置

**推荐配置（使用 @frank-tech/playwright-mcp）：**
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@frank-tech/playwright-mcp"],
      "env": {
        "PLAYWRIGHT_HEADLESS": "true",
        "PLAYWRIGHT_TIMEOUT": "30000"
      }
    }
  }
}
```

**备选配置（使用 better-playwright-mcp3 HTTP 模式）：**
```json
{
  "mcpServers": {
    "playwright-http": {
      "command": "better-playwright-mcp3",
      "args": ["server", "--port", "3001"],
      "env": {
        "PLAYWRIGHT_HEADLESS": "true"
      }
    }
  }
}
```

### 步骤 3: 重启 Claude Desktop
配置完成后，完全退出并重新启动 Claude Desktop 应用。

## 🧪 验证安装

### 方法 1: 在 Claude 中测试
重启 Claude Desktop 后，在对话中尝试：
```
请帮我打开百度首页并截图
```

### 方法 2: 命令行测试
```bash
# 测试 HTTP 服务器模式
better-playwright-mcp3 server --port 3001

# 测试 MCP 模式
npx @frank-tech/playwright-mcp
```

## 🚀 使用示例

### 基础网页操作
```
1. 打开 https://example.com
2. 点击页面上的"更多信息"链接
3. 截图保存
```

### 表单填写
```
1. 打开登录页面
2. 填写用户名和密码
3. 点击登录按钮
4. 等待页面加载完成
```

### 数据提取
```
1. 打开新闻网站
2. 提取所有新闻标题
3. 保存为 JSON 格式
```

## 🔧 环境变量配置

可以在配置中设置以下环境变量：

```json
"env": {
  "PLAYWRIGHT_HEADLESS": "true",           // 无头模式
  "PLAYWRIGHT_TIMEOUT": "30000",           // 超时时间(毫秒)
  "PLAYWRIGHT_BROWSER": "chromium",        // 浏览器类型
  "PLAYWRIGHT_VIEWPORT_WIDTH": "1280",     // 视口宽度
  "PLAYWRIGHT_VIEWPORT_HEIGHT": "720"      // 视口高度
}
```

## 🛠️ 故障排除

### 常见问题

1. **MCP 服务器启动失败**
   - 检查 Node.js 版本 (需要 >= 16)
   - 确保包正确安装：`npm list -g @frank-tech/playwright-mcp`

2. **浏览器启动失败**
   - 重新安装浏览器：`npx playwright install`
   - 检查系统权限

3. **Claude Desktop 无法识别 MCP**
   - 检查配置文件语法是否正确
   - 确保完全重启了 Claude Desktop
   - 查看 Claude Desktop 日志

### 调试命令

```bash
# 检查安装状态
npm list -g | grep playwright

# 测试浏览器
npx playwright --version

# 手动启动 MCP 服务器
npx @frank-tech/playwright-mcp
```

## 📋 下一步

1. ✅ 安装完成
2. ✅ 配置文件创建
3. 🔄 **当前步骤：将配置添加到 Claude Desktop**
4. ⏳ 重启 Claude Desktop
5. ⏳ 测试 Playwright 功能

## 🎉 成功标志

当配置成功后，你应该能够在 Claude 对话中：
- 请求打开网页
- 进行页面交互
- 提取网页数据
- 生成截图
- 自动化表单填写

---

**注意：** 如果遇到任何问题，请检查 Claude Desktop 的日志文件或尝试不同的 MCP 包配置。