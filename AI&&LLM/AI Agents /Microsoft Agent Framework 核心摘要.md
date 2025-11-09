# Microsoft Agent Framework 核心摘要

## 概述

Microsoft Agent Framework 是一个开源开发工具包，用于生成适用于 .NET 和 Python 的 AI 代理和多代理工作流 <mcreference link="https://learn.microsoft.com/zh-cn/agent-framework/overview/agent-framework-overview" index="0">0</mcreference>。它将语义内核和 AutoGen 项目的想法汇集在一起，并扩展了其优势，同时添加了新功能 <mcreference link="https://learn.microsoft.com/zh-cn/agent-framework/overview/agent-framework-overview" index="0">0</mcreference>。

### 核心定位
- **下一代语义内核和 AutoGen**：由同一团队构建，是今后构建 AI 代理的统一基础 <mcreference link="https://learn.microsoft.com/zh-cn/agent-framework/overview/agent-framework-overview" index="0">0</mcreference>
- **企业级功能**：结合了 AutoGen 的简单抽象与语义内核的企业级功能 <mcreference link="https://learn.microsoft.com/zh-cn/agent-framework/overview/agent-framework-overview" index="0">0</mcreference>
- **公共预览版**：目前以公共预览版提供，欢迎社区贡献 <mcreference link="https://learn.microsoft.com/zh-cn/agent-framework/overview/agent-framework-overview" index="0">0</mcreference>

## 主要功能特性

### 1. AI 代理 (AI Agents)
使用 LLM 处理用户输入、调用工具和 MCP 服务器以执行任务并生成响应的单个代理 <mcreference link="https://learn.microsoft.com/zh-cn/agent-framework/overview/agent-framework-overview" index="0">0</mcreference>。

**核心组件架构图：**
```
[用户输入] → [AI 代理] → [LLM] → [工具/MCP服务器] → [响应生成]
                ↓
        [线程、上下文提供程序、中间件]
```

**支持的模型提供程序：**
- Azure OpenAI
- OpenAI  
- Azure AI

### 2. 工作流 (Workflows)
基于图形的工作流，用于连接多个代理和函数来执行复杂的多步骤任务 <mcreference link="https://learn.microsoft.com/zh-cn/agent-framework/overview/agent-framework-overview" index="0">0</mcreference>。

**工作流特性：**
- 基于类型的路由
- 嵌套支持
- 检查点功能
- 人工循环方案的请求/响应模式

**工作流架构示例：**
```
[代理1] → [函数] → [代理2] → [输出]
    ↓         ↓         ↓
[状态管理] [检查点] [人工干预]
```

## 基础构建模块

框架提供以下基础组件 <mcreference link="https://learn.microsoft.com/zh-cn/agent-framework/overview/agent-framework-overview" index="0">0</mcreference>：

- **模型客户端**：聊天完成和响应
- **代理线程**：状态管理
- **上下文提供程序**：代理内存
- **中间件**：截获代理操作
- **MCP 客户端**：工具集成

## 适用场景

### AI 代理适用场景
AI 代理适用于需要自主决策、即席规划、试验和错误探索和基于聊天的用户交互的应用程序 <mcreference link="https://learn.microsoft.com/zh-cn/agent-framework/overview/agent-framework-overview" index="0">0</mcreference>：

1. **客户支持**：处理多模式查询（文本、语音、图像），使用工具查找信息 <mcreference link="https://learn.microsoft.com/zh-cn/agent-framework/overview/agent-framework-overview" index="0">0</mcreference>
2. **教育和辅导**：利用外部知识库提供个性化辅导 <mcreference link="https://learn.microsoft.com/zh-cn/agent-framework/overview/agent-framework-overview" index="0">0</mcreference>
3. **代码生成和调试**：帮助软件开发人员进行实现、代码评审和调试 <mcreference link="https://learn.microsoft.com/zh-cn/agent-framework/overview/agent-framework-overview" index="0">0</mcreference>
4. **研究帮助**：搜索Web、汇总文档，从多个来源拼凑信息 <mcreference link="https://learn.microsoft.com/zh-cn/agent-framework/overview/agent-framework-overview" index="0">0</mcreference>

### 不适用场景

**AI 代理不适合：**
- 高度结构化且要求严格遵循预定义规则的任务 <mcreference link="https://learn.microsoft.com/zh-cn/agent-framework/overview/agent-framework-overview" index="0">0</mcreference>
- 具有明确定义操作顺序的特定类型输入
- 可以编写函数处理的任务

**工作流更适合：**
- 涉及多个步骤和决策点的复杂任务
- 需要大量工具（超过20个）的场景
- 需要显式控制执行路径的情况

## 安装方式

### Python
```bash
pip install agent-framework
```

### .NET
```bash
dotnet add package Microsoft.Agents.AI
```

## 重要注意事项

⚠️ **安全提醒**：如果使用 Microsoft Agent Framework 生成使用第三方服务器或代理运行的应用程序，则自行承担风险 <mcreference link="https://learn.microsoft.com/zh-cn/agent-framework/overview/agent-framework-overview" index="0">0</mcreference>。建议查看与第三方服务器或代理共享的所有数据，并识别第三方保留和位置数据的做法。

## 迁移指南

对于现有用户：
- **语义内核用户**：参考语义内核的迁移指南
- **AutoGen用户**：参考AutoGen的迁移指南

---

*文档基于Microsoft官方文档整理，详细信息请参考：https://learn.microsoft.com/zh-cn/agent-framework/overview/agent-framework-overview*