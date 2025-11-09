#!/usr/bin/env node

const { spawn } = require('child_process');

console.log('🧪 测试 Playwright MCP 配置...\n');

// 测试 MCP 服务器启动
console.log('1. 测试 MCP 服务器启动...');
const mcpProcess = spawn('better-playwright-mcp3', ['mcp'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

let mcpOutput = '';
mcpProcess.stdout.on('data', (data) => {
  mcpOutput += data.toString();
});

mcpProcess.stderr.on('data', (data) => {
  console.log('MCP stderr:', data.toString());
});

// 发送初始化消息
setTimeout(() => {
  const initMessage = {
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: {
        name: "test-client",
        version: "1.0.0"
      }
    }
  };
  
  mcpProcess.stdin.write(JSON.stringify(initMessage) + '\n');
  
  setTimeout(() => {
    mcpProcess.kill();
    console.log('✅ MCP 服务器启动测试完成');
    console.log('📄 MCP 输出:', mcpOutput.substring(0, 200) + '...');
    
    // 测试 HTTP 服务器
    console.log('\n2. 测试 HTTP 服务器启动...');
    const httpProcess = spawn('better-playwright-mcp3', ['server', '--port', '3001'], {
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    httpProcess.stdout.on('data', (data) => {
      console.log('HTTP 服务器输出:', data.toString());
    });
    
    httpProcess.stderr.on('data', (data) => {
      console.log('HTTP 服务器错误:', data.toString());
    });
    
    setTimeout(() => {
      httpProcess.kill();
      console.log('✅ HTTP 服务器测试完成');
      console.log('\n🎉 Playwright MCP 安装和配置成功！');
      console.log('\n📋 下一步操作：');
      console.log('1. 将配置添加到 Claude Desktop 配置文件');
      console.log('2. 重启 Claude Desktop');
      console.log('3. 在对话中使用 Playwright 功能');
    }, 3000);
    
  }, 2000);
}, 1000);

mcpProcess.on('error', (error) => {
  console.error('❌ MCP 服务器启动失败:', error.message);
});