
# Playwright MCP 安装与配置指南

## 🎯 **什么是 Playwright MCP？**

Playwright MCP (Model Context Protocol) 是一个允许 Claude 通过 MCP 协议控制 Playwright 浏览器自动化的服务器。它提供了网页交互、截图、数据提取等功能。

**GitHub 仓库：** https://github.com/microsoft/playwright-mcp

## 📋 **系统要求**

- **Node.js**: 18.0.0 或更高版本
- **操作系统**: macOS, Linux, Windows
- **Claude Desktop**: 最新版本
- **内存**: 至少 4GB RAM

## 🚀 **安装步骤**

### 1. **安装 Playwright MCP**

```bash
# 全局安装 Playwright MCP
npm install -g @microsoft/playwright-mcp

# 或者使用 npx（推荐）
npx @microsoft/playwright-mcp --version
```

### 2. **安装 Playwright 浏览器**

```bash
# 安装所有浏览器
npx playwright install

# 或者只安装特定浏览器
npx playwright install chromium
npx playwright install firefox
npx playwright install webkit
```

### 3. **验证安装**

```bash
# 检查 Playwright 是否正确安装
npx playwright --version

# 测试浏览器启动
npx playwright test --headed
```

## ⚙️ **配置 Claude Desktop**

### 1. **找到配置文件**

**macOS 路径：**
```bash
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Windows 路径：**
```bash
%APPDATA%\Claude\claude_desktop_config.json
```

**Linux 路径：**
```bash
~/.config/Claude/claude_desktop_config.json
```

### 2. **编辑配置文件**

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@microsoft/playwright-mcp"],
      "env": {
        "PLAYWRIGHT_HEADLESS": "true",
        "PLAYWRIGHT_BROWSER": "chromium"
      }
    }
  }
}
```

### 3. **高级配置选项**

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@microsoft/playwright-mcp",
        "--browser", "chromium",
        "--headless", "false",
        "--timeout", "30000"
      ],
      "env": {
        "PLAYWRIGHT_HEADLESS": "false",
        "PLAYWRIGHT_BROWSER": "chromium",
        "PLAYWRIGHT_TIMEOUT": "30000",
        "PLAYWRIGHT_VIEWPORT_WIDTH": "1920",
        "PLAYWRIGHT_VIEWPORT_HEIGHT": "1080"
      }
    }
  }
}
```

## 🔧 **环境变量配置**

### **常用环境变量**

```bash
# 浏览器设置
export PLAYWRIGHT_BROWSER=chromium          # 默认浏览器
export PLAYWRIGHT_HEADLESS=true            # 无头模式
export PLAYWRIGHT_TIMEOUT=30000            # 超时时间(ms)

# 视窗设置
export PLAYWRIGHT_VIEWPORT_WIDTH=1920      # 视窗宽度
export PLAYWRIGHT_VIEWPORT_HEIGHT=1080     # 视窗高度

# 下载设置
export PLAYWRIGHT_DOWNLOAD_PATH=/tmp/downloads  # 下载路径

# 调试设置
export DEBUG=pw:api                         # 启用调试日志
export PLAYWRIGHT_DEBUG=1                  # 详细调试信息
```

### **创建环境配置文件**

```bash
# 创建 .env 文件
cat > ~/.playwright-mcp.env << EOF
PLAYWRIGHT_BROWSER=chromium
PLAYWRIGHT_HEADLESS=true
PLAYWRIGHT_TIMEOUT=30000
PLAYWRIGHT_VIEWPORT_WIDTH=1920
PLAYWRIGHT_VIEWPORT_HEIGHT=1080
DEBUG=pw:api
EOF

# 加载环境变量
source ~/.playwright-mcp.env
```

## 🎮 **使用示例**

### **1. 基础网页操作**

```javascript
// Claude 可以执行的操作示例
await page.goto('https://example.com');
await page.click('button[type="submit"]');
await page.fill('input[name="username"]', 'testuser');
await page.screenshot({ path: 'screenshot.png' });
```

### **2. 数据提取**

```javascript
// 提取页面文本
const title = await page.textContent('h1');
const links = await page.$$eval('a', links => 
  links.map(link => ({ text: link.textContent, href: link.href }))
);
```

### **3. 表单操作**

```javascript
// 填写表单
await page.fill('#email', 'user@example.com');
await page.fill('#password', 'password123');
await page.click('#login-button');
await page.waitForNavigation();
```

## 🛠 **可用工具和功能**

### **页面导航**
- `goto(url)` - 导航到指定URL
- `goBack()` - 返回上一页
- `goForward()` - 前进到下一页
- `reload()` - 刷新页面

### **元素交互**
- `click(selector)` - 点击元素
- `fill(selector, text)` - 填写输入框
- `selectOption(selector, value)` - 选择下拉选项
- `check(selector)` - 勾选复选框

### **数据提取**
- `textContent(selector)` - 获取文本内容
- `getAttribute(selector, name)` - 获取属性值
- `$$eval(selector, fn)` - 批量提取数据

### **等待和断言**
- `waitForSelector(selector)` - 等待元素出现
- `waitForNavigation()` - 等待页面导航
- `waitForTimeout(ms)` - 等待指定时间

### **截图和PDF**
- `screenshot(options)` - 截取屏幕截图
- `pdf(options)` - 生成PDF文件

## 🔍 **测试配置**

### **1. 创建测试脚本**

```bash
# 创建测试目录
mkdir -p ~/playwright-mcp-test
cd ~/playwright-mcp-test

# 创建测试文件
cat > test-mcp.js << 'EOF'
const { chromium } = require('playwright');

(async () => {
  console.log('启动浏览器...');
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('导航到测试页面...');
  await page.goto('https://example.com');
  
  console.log('截取屏幕截图...');
  await page.screenshot({ path: 'test-screenshot.png' });
  
  console.log('获取页面标题...');
  const title = await page.title();
  console.log('页面标题:', title);
  
  await browser.close();
  console.log('测试完成！');
})();
EOF

# 运行测试
node test-mcp.js
```

### **2. 验证 MCP 连接**

重启 Claude Desktop 后，在对话中询问：

```
请帮我访问 https://example.com 并截取屏幕截图
```

如果配置正确，Claude 应该能够：
- 启动浏览器
- 导航到指定网站
- 截取屏幕截图
- 返回结果

## 🚨 **常见问题和解决方案**

### **1. 浏览器启动失败**

```bash
# 问题：浏览器二进制文件未找到
# 解决：重新安装浏览器
npx playwright install --force

# 问题：权限不足
# 解决：检查文件权限
chmod +x ~/.cache/ms-playwright/*/chrome-linux/chrome
```

### **2. MCP 服务器连接失败**

```bash
# 检查 Node.js 版本
node --version  # 应该 >= 18.0.0

# 检查 MCP 包是否正确安装
npm list -g @microsoft/playwright-mcp

# 重新安装 MCP 包
npm uninstall -g @microsoft/playwright-mcp
npm install -g @microsoft/playwright-mcp
```

### **3. 配置文件问题**

```bash
# 验证 JSON 格式
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json | jq .

# 备份和重置配置
cp ~/Library/Application\ Support/Claude/claude_desktop_config.json ~/claude_config_backup.json
```

### **4. 性能优化**

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@microsoft/playwright-mcp"],
      "env": {
        "PLAYWRIGHT_HEADLESS": "true",
        "PLAYWRIGHT_BROWSER": "chromium",
        "PLAYWRIGHT_TIMEOUT": "15000",
        "PLAYWRIGHT_VIEWPORT_WIDTH": "1280",
        "PLAYWRIGHT_VIEWPORT_HEIGHT": "720"
      }
    }
  }
}
```

## 📊 **性能监控**

### **启用调试日志**

```bash
# 设置调试环境变量
export DEBUG=pw:api,pw:browser
export PLAYWRIGHT_DEBUG=1

# 重启 Claude Desktop 查看日志
```

### **监控资源使用**

```bash
# 监控进程
ps aux | grep playwright

# 监控内存使用
top -p $(pgrep -f playwright)
```

## 🔐 **安全考虑**

### **1. 网络安全**
- 只访问可信的网站
- 避免在生产环境中运行
- 使用代理服务器进行隔离

### **2. 数据隐私**
- 不要在敏感页面上使用
- 定期清理下载文件
- 避免保存敏感信息

### **3. 资源限制**
```json
{
  "env": {
    "PLAYWRIGHT_TIMEOUT": "30000",
    "PLAYWRIGHT_MAX_PAGES": "5",
    "PLAYWRIGHT_MEMORY_LIMIT": "1024"
  }
}
```

## 🎯 **最佳实践**

### **1. 配置优化**
- 使用无头模式提高性能
- 设置合理的超时时间
- 限制并发页面数量

### **2. 错误处理**
- 设置重试机制
- 使用 try-catch 包装操作
- 记录详细的错误日志

### **3. 资源管理**
- 及时关闭不需要的页面
- 定期清理临时文件
- 监控内存使用情况

## 📚 **参考资源**

- **官方文档**: https://playwright.dev/docs/intro
- **MCP 协议**: https://modelcontextprotocol.io/
- **GitHub 仓库**: https://github.com/microsoft/playwright-mcp
- **示例代码**: https://github.com/microsoft/playwright/tree/main/examples

## 🎉 **完成！**

现在你已经成功安装和配置了 Playwright MCP。重启 Claude Desktop 后，你就可以让 Claude 帮你进行网页自动化操作了！

如果遇到问题，请检查：
1. ✅ Node.js 版本 >= 18.0.0
2. ✅ Playwright 浏览器已安装
3. ✅ Claude Desktop 配置文件正确
4. ✅ 环境变量设置正确
5. ✅ 重启了 Claude Desktop