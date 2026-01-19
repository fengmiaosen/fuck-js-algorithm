

Design tokens are key-value pairs that represent the specs of a design system.

**核心作用**
- 作为设计系统的单一事实来源，用键值描述颜色、间距、排版、圆角、阴影、动效等规范，避免魔法数与散落样式
- 保证跨平台一致性：同一套 tokens 可输出为 `CSS Variables`、`Android XML`、`iOS` 等产物，使 Web/Native 风格统一
- 支持主题与品牌扩展：通过 token 集与别名实现浅色/深色、多品牌/节日主题的快速切换
- 降低维护成本与变更风险：修改 token 即可全局生效，影响范围可控、易审查与回滚
- 提升组件复用与测试性：组件消费语义化 tokens，减少硬编码；可对 token 变更做视觉回归测试
- 加强设计-开发协作：设计工具（如 Figma Variables/Design Tokens）与代码通过相同命名与导出流程对齐
- 促进可访问性：语义色（如 `success`/`warning`/`danger`）映射到合格对比度；字号/间距遵循尺度系统

**基本原理**
- 键值对与语义命名：采用结构化命名如 `category.type.name`（例：`color.text.primary`、`space.xs`），名称表达用途而非具体值
- 两层结构：基础 tokens（原子值，如色板、字号基础）与语义 tokens（面向用途，如文本主色）；语义层引用基础层
- 引用与别名：通过引用链（如 `{color.base.blue.500}`）派生语义 token，形成可替换、可主题化的映射
- 主题与作用域：不同主题是同一语义 token 的不同值；可按平台、品牌、暗/明、密度等维度分组与覆盖
- 尺度系统与约束：采用有序刻度（如 4/8pt 间距梯度、字体层级），保证视觉节奏与可预测性
- 类型与单位：覆盖颜色、空间、排版、圆角、边框、阴影、层级、动效等；单位遵循平台（`px/rem/%/dp/pt`）
- 解析与转换流水线：源格式（JSON/JS/YAML）经构建工具（如 Style Dictionary、Theo）转换为目标产物（`CSS vars`、`Android XML`、`iOS Swift/ObjC`、`tokens.ts`）
- 校验与版本化：使用 Schema 校验、Lint 规则与测试保证命名一致性与值合法性，变更通过版本管理可追踪


## 参考资料

* [Awesome-Design-Tokens](https://github.com/sturobson/Awesome-Design-Tokens)
* [What Are Design Tokens and How Are They Useful?](https://www.michaelmang.dev/blog/introduction-to-design-tokens)
* [How to manage your Design Tokens with Style Dictionary](https://didoo.medium.com/how-to-manage-your-design-tokens-with-style-dictionary-98c795b938aa)