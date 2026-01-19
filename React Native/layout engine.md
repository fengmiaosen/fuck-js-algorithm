**核心定位**
- 跨平台的布局引擎，由 Facebook 开源，用于 React Native 等框架
- 以 CSS Flexbox 的子集为核心，计算每个节点的 `x/y/width/height`
- 结果确定性强：同一样式和树结构在 iOS/Android/桌面均得到一致布局
- 轻量、零依赖（C/C++ 实现），易嵌入其他渲染系统

**Flexbox 特性**
- 默认主轴为 `flexDirection: 'column'`（与 Web 默认 `'row'` 不同）
- 支持 `justifyContent`、`alignItems`、`alignSelf`、`alignContent`
- 支持 `flexGrow`、`flexShrink`、`flexBasis`；`flex: n` 通常映射为“可增长、可收缩、基础尺寸自动”
- 支持 `flexWrap` 多行布局，配合 `alignContent` 控制多行对齐
- 支持基线对齐 `alignItems: 'baseline'`（常用于文本行对齐）

**尺寸与单位**
- 支持点（逻辑像素）与百分比（相对父容器尺寸）
- 完整的约束集：`width/height`、`minWidth/minHeight`、`maxWidth/maxHeight`
- 支持 `aspectRatio` 按宽高比约束尺寸
- 完整边界模型：`margin/padding/border` 按边（含 `start/end`）定义
- 支持方向 `direction: ltr/rtl`，`start/end` 在 RTL/LTR 下自动映射
- 支持 `display: 'none'` 使节点从布局树中移除

**定位与对齐**
- `position: 'relative' | 'absolute'`，绝对定位不参与父容器的 Flex 排布
- 通过 `top/right/bottom/left` 指定绝对定位偏移
- `margin: 'auto'` 可在可用空间中分配以实现居中等对齐（取决于轴与上下文）

**性能与一致性**
- O(n) 的布局遍历，带脏标记传播（仅在变更路径上重算）
- 叶子节点通过 `measure` 函数按约束测量（文本、未知固有尺寸内容）
- 具备测量缓存：按约束（最大/最小宽高）缓存结果，减少重复测量
- 支持像素网格对齐（通过点缩放因子）避免亚像素渲染模糊
- 计算纯函数化：布局完全由样式与树结构决定，易调试、可复现

**与 Web 差异**
- 默认 `flexDirection: 'column'`；Web 为 `'row'`
- 不支持 `float`、`grid`、`position: fixed` 等非 Flex 布局机制
- `overflow` 的滚动不由布局引擎处理，滚动使用专门的 `ScrollView`
- 文本不采用 Web 的 inline/line-box 模型，复杂排版由文本组件自身实现
- 部分 CSS 属性不存在或语义不同，应以 React Native 文档为准

**已知限制**
- 仅实现 Flexbox 子集；不覆盖 Web 全量布局功能
- 绝对定位节点不影响父级尺寸与常规 Flex 排布
- `alignContent` 仅在存在换行（`flexWrap: 'wrap'`）时生效
- `zIndex` 只影响绘制顺序，不影响布局计算

**实践建议**
- 明确设置 `flexDirection`，避免默认 `'column'` 导致与 Web 预期不一致
- 主轴分配优先用 `justifyContent`，交叉轴用 `alignItems`，减少不必要的绝对定位
- 合理使用 `flexGrow/flexShrink/flexBasis` 控制伸缩性，避免仅用 `width/height` 造成挤压
- 文本与图片尽量提供约束（如最大宽高或容器宽度），降低多次测量成本
- 使用百分比前确保父容器尺寸可确定，否则可能触发额外的布局与测量回合
- 需要层叠/浮层效果时用绝对定位并配合 `zIndex`，不要依赖布局顺序改变位置

这份总结抓住了 Yoga 在 React Native 中的核心：以高性能、可复现的 Flexbox 子集提供跨平台一致布局，同时保持 API 简洁、行为稳定，并与 Web 的默认值与模型存在若干差异。掌握这些特点能显著降低跨平台 UI 的调试成本。