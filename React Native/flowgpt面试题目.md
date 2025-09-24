
1. RN流式输出模拟打字机效果透明度设置

**实现思路：**
- 使用 useState 管理文本内容和透明度值
- 将文本拆分成字符数组
- 使用 setInterval/setTimeout 来逐步显示每个字符
- 使用 Animated.Value 来实现透明度动画效果
- 可以封装成自定义 Hook 以便复用

**示例代码：**
```javascript
const TypewriterText = ({ text, speed = 50 }) => {
  const [displayText, setDisplayText] = useState('');
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    return () => clearInterval(timer);
  }, [text]);

  return (
    <Animated.Text style={{ opacity }}>
      {displayText}
    </Animated.Text>
  );
};
```

2. 使用rn模拟chatgpt的那种回复下效果。 回复的文字大约10000个token。要有文字慢慢弹出的效果

**实现方案：**
- 分批渲染大文本，避免性能问题
- 使用流式输出模拟实时回复
- 添加光标闪烁效果增强体验
- 支持暂停/继续功能

**示例代码：**
```javascript
const ChatGPTResponse = ({ response }) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  
  useEffect(() => {
    let index = 0;
    const batchSize = 5; // 每次显示5个字符
    
    const timer = setInterval(() => {
      if (index < response.length) {
        const nextBatch = response.slice(0, index + batchSize);
        setDisplayText(nextBatch);
        index += batchSize;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 30); // 30ms间隔，适合大文本
    
    return () => clearInterval(timer);
  }, [response]);

  return (
    <View>
      <Text>{displayText}</Text>
      {isTyping && <Text style={{ opacity: 0.5 }}>|</Text>}
    </View>
  );
};
```


3. 其他题目

1.项目解决, 你在其中承担角色? 页面面临问题,业务目前数据(pv 订单量)? 你对业务的理解是什么?

**答案：**
- **角色定位**：前端技术负责人、核心开发者、架构设计参与者
- **问题识别**：性能瓶颈、用户体验问题、技术债务
- **数据驱动**：通过PV、转化率、用户留存等指标评估效果
- **业务理解**：深入了解用户需求、商业模式、技术与业务的平衡点
```
示例：电商项目中，发现商品列表页加载慢导致转化率下降5%，
通过虚拟滚动和图片懒加载优化，提升页面性能30%，转化率回升至正常水平
```

2.业务变化特别快的情况,你们团队在 技术上,团队建设上如何应对?

**答案：**
- **技术应对**：模块化架构、组件库建设、自动化测试、CI/CD流程
- **团队建设**：敏捷开发、代码规范、知识分享、技能培训
- **流程优化**：需求评审、技术方案讨论、快速迭代、及时复盘
```
示例：采用微前端架构，各业务线独立开发部署，
建立组件库减少重复开发，通过自动化测试保证质量
```

3.项目介绍,介绍完毕之后没有问

**答案：**
- **项目背景**：业务场景、技术选型、团队规模
- **技术亮点**：核心功能实现、性能优化、技术难点解决
- **成果展示**：业务指标提升、技术指标改善、用户反馈
```
示例：React Native电商App，支持iOS/Android双端，
日活10万+，通过性能优化将启动时间从3s降至1.5s
```

4.用的状态管理工具是啥? 状态工具的使用场景是啥? 

除了 redux 还用过哪些?  这些状态工具都有哪些问题?  如果遇到一个组件需要在卸载的时候讲初始的状态给重置回来,如果不让你在 redux 写一个重置函数,你会如何解决?

**答案：**
- **常用工具**：Redux、Zustand、Context API、MobX
- **使用场景**：跨组件状态共享、复杂状态逻辑、数据持久化
- **各工具问题**：Redux样板代码多、Context性能问题、MobX学习成本高
- **组件卸载重置**：使用useEffect清理、高阶组件包装、状态隔离设计
```javascript
// 示例：使用useEffect清理
useEffect(() => {
  return () => {
    // 组件卸载时重置状态
    dispatch({ type: 'RESET_COMPONENT_STATE' });
  };
}, []);
```

5.给你一个复杂项目,让你来做性能优化,你会如何解决与思考?

**答案：**
- **分析阶段**：性能监控工具分析、识别瓶颈点、制定优化策略
- **渲染优化**：React.memo、useMemo、useCallback减少重渲染
- **包体积优化**：代码分割、懒加载、图片压缩、依赖分析
- **网络优化**：接口合并、缓存策略、预加载关键资源
```javascript
// 示例：组件优化
const ExpensiveComponent = React.memo(({ data }) => {
  const processedData = useMemo(() => 
    data.map(item => heavyCalculation(item)), [data]
  );
  return <View>{/* 渲染内容 */}</View>;
});
```

6.虚拟滚动是什么? 如何实现?  使用 padding-top 来控制空白会有什么问题?  元素非等高的列表如何实现虚拟滚动?

**答案：**
- **虚拟滚动**：只渲染可视区域内的列表项，动态计算显示内容，优化大数据列表性能
- **实现方式**：RN中使用FlatList（推荐）或手动实现（ScrollView + 计算可见范围 + transform定位）
- **padding-top问题**：滚动条位置不准确、性能差、滚动跳跃、内存占用，应使用transform替代
- **非等高实现**：动态测量高度并缓存、使用onLayout回调、预估高度机制、增量更新可见范围
```javascript
// 示例：FlatList虚拟滚动
<FlatList
  data={largeDataSet}
  renderItem={({ item }) => <ItemComponent item={item} />}
  initialNumToRender={10}
  maxToRenderPerBatch={5}
  windowSize={10}
  removeClippedSubviews={true}
/>
```
