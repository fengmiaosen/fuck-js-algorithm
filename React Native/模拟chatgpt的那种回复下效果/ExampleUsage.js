/**
 * ChatGPT 回复效果组件使用示例
 * 展示各种配置选项和使用场景
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Slider,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import ChatGPTReply from './ChatGPTReply';
import AdvancedChatGPTReply, { useChatGPTReplyControls } from './AdvancedChatGPTReply';

// 示例文本数据（约10000个token）
const SAMPLE_TEXTS = {
  short: `这是一个简短的示例文本，用于测试基本的打字机效果。`,
  
  medium: `React Native 是一个由 Facebook 开发的开源移动应用开发框架。它允许开发者使用 JavaScript 和 React 来构建原生移动应用。

React Native 的核心优势在于"一次编写，到处运行"的理念。开发者可以使用相同的代码库来构建 iOS 和 Android 应用，大大提高了开发效率。

在性能方面，React Native 应用运行在 JavaScript 线程上，通过桥接机制与原生模块通信。这种架构使得应用既能享受 JavaScript 的开发便利性，又能获得接近原生应用的性能表现。`,

  long: `人工智能（Artificial Intelligence，简称AI）是计算机科学的一个分支，它企图了解智能的实质，并生产出一种新的能以人类智能相似的方式做出反应的智能机器。该领域的研究包括机器人、语言识别、图像识别、自然语言处理和专家系统等。

人工智能从诞生以来，理论和技术日益成熟，应用领域也不断扩大。可以设想，未来人工智能带来的科技产品，将会是人类智慧的"容器"。人工智能可以对人的意识、思维的信息过程的模拟。人工智能不是人的智能，但能像人那样思考、也可能超过人的智能。

机器学习是人工智能的一个重要分支，它是一种通过算法使机器能够从数据中学习并做出决策或预测的技术。深度学习作为机器学习的一个子集，使用多层神经网络来模拟人脑的工作方式，在图像识别、语音识别、自然语言处理等领域取得了突破性进展。

自然语言处理（NLP）是人工智能领域中的一个重要方向，它致力于让计算机能够理解、解释和生成人类语言。近年来，基于Transformer架构的大型语言模型如GPT系列、BERT等在NLP任务上表现出色，推动了对话系统、文本生成、机器翻译等应用的发展。

计算机视觉是另一个重要的AI应用领域，它使计算机能够从图像或视频中获取信息。卷积神经网络（CNN）的发展极大地推进了图像分类、目标检测、人脸识别等技术的进步。这些技术在自动驾驶、医疗诊断、安防监控等领域有着广泛的应用。

强化学习是机器学习的另一个重要分支，它通过智能体与环境的交互来学习最优策略。AlphaGo、AlphaZero等系统在围棋、国际象棋等游戏中战胜人类顶级选手，展示了强化学习的强大能力。

随着AI技术的不断发展，我们也面临着一些挑战和问题。算法偏见、隐私保护、就业影响、AI安全等问题需要我们认真对待。同时，AI的发展也带来了巨大的机遇，它将在医疗、教育、交通、金融等各个领域发挥重要作用，推动社会的进步和发展。

未来，人工智能将继续快速发展，我们可能会看到更加智能、更加人性化的AI系统。通用人工智能（AGI）的实现虽然还有很长的路要走，但随着技术的不断进步，这个目标正在逐步接近。同时，我们也需要建立相应的伦理框架和监管机制，确保AI技术的发展能够造福人类社会。

在这个AI快速发展的时代，每个人都应该了解和学习AI相关知识，以便更好地适应未来的社会变化。无论是技术从业者还是普通用户，都应该关注AI的发展趋势，思考如何利用AI技术来提高工作效率和生活质量。

总的来说，人工智能是一个充满机遇和挑战的领域。它不仅改变着我们的工作方式和生活方式，也在重新定义着人类与机器的关系。在拥抱AI技术的同时，我们也要保持理性和谨慎，确保技术的发展始终服务于人类的福祉。`
};

const ExampleUsage = () => {
  // 基本状态
  const [selectedText, setSelectedText] = useState('medium');
  const [currentExample, setCurrentExample] = useState('basic');
  
  // 配置状态
  const [speed, setSpeed] = useState(50);
  const [chunkSize, setChunkSize] = useState(100);
  const [enableVirtualization, setEnableVirtualization] = useState(true);
  const [enablePerformanceMonitoring, setEnablePerformanceMonitoring] = useState(true);
  const [theme, setTheme] = useState('light');
  const [debugMode, setDebugMode] = useState(false);
  const [adaptiveSpeed, setAdaptiveSpeed] = useState(true);
  const [memoryOptimization, setMemoryOptimization] = useState(true);
  
  // 性能数据
  const [performanceData, setPerformanceData] = useState({});
  
  // 控制器
  const { controls, status } = useChatGPTReplyControls();
  
  // Refs
  const basicReplyRef = useRef(null);
  const advancedReplyRef = useRef(null);

  // 处理性能更新
  const handlePerformanceUpdate = (data) => {
    setPerformanceData(data);
  };

  // 处理进度更新
  const handleProgress = (progress) => {
    console.log('进度更新:', progress);
  };

  // 处理完成
  const handleComplete = () => {
    Alert.alert('完成', '文本显示完成！');
  };

  // 渲染控制按钮
  const renderControls = () => (
    <View style={styles.controlsContainer}>
      <Text style={styles.sectionTitle}>播放控制</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.controlButton, styles.playButton]}
          onPress={controls.play}
          disabled={status.isPlaying}
        >
          <Text style={styles.buttonText}>播放</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.controlButton, styles.pauseButton]}
          onPress={controls.pause}
          disabled={!status.isPlaying}
        >
          <Text style={styles.buttonText}>暂停</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.controlButton, styles.resumeButton]}
          onPress={controls.resume}
          disabled={!status.isPaused}
        >
          <Text style={styles.buttonText}>继续</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.controlButton, styles.resetButton]}
          onPress={controls.reset}
        >
          <Text style={styles.buttonText}>重置</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          状态: {status.isPlaying ? '播放中' : status.isPaused ? '已暂停' : status.isCompleted ? '已完成' : '待播放'}
        </Text>
        <Text style={styles.statusText}>
          进度: {Math.round(status.progress)}%
        </Text>
      </View>
    </View>
  );

  // 渲染配置选项
  const renderConfiguration = () => (
    <View style={styles.configContainer}>
      <Text style={styles.sectionTitle}>配置选项</Text>
      
      {/* 文本选择 */}
      <View style={styles.configItem}>
        <Text style={styles.configLabel}>示例文本:</Text>
        <View style={styles.textButtonRow}>
          {Object.keys(SAMPLE_TEXTS).map((key) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.textButton,
                selectedText === key && styles.textButtonActive
              ]}
              onPress={() => setSelectedText(key)}
            >
              <Text style={[
                styles.textButtonText,
                selectedText === key && styles.textButtonTextActive
              ]}>
                {key === 'short' ? '短文本' : key === 'medium' ? '中文本' : '长文本'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 速度控制 */}
      <View style={styles.configItem}>
        <Text style={styles.configLabel}>打字速度: {speed}ms</Text>
        <Slider
          style={styles.slider}
          minimumValue={10}
          maximumValue={200}
          value={speed}
          onValueChange={setSpeed}
          step={10}
          minimumTrackTintColor="#007AFF"
          maximumTrackTintColor="#E5E5EA"
          thumbTintColor="#007AFF"
        />
      </View>

      {/* 块大小控制 */}
      <View style={styles.configItem}>
        <Text style={styles.configLabel}>块大小: {chunkSize}</Text>
        <Slider
          style={styles.slider}
          minimumValue={50}
          maximumValue={500}
          value={chunkSize}
          onValueChange={setChunkSize}
          step={25}
          minimumTrackTintColor="#007AFF"
          maximumTrackTintColor="#E5E5EA"
          thumbTintColor="#007AFF"
        />
      </View>

      {/* 主题选择 */}
      <View style={styles.configItem}>
        <Text style={styles.configLabel}>主题:</Text>
        <View style={styles.themeButtonRow}>
          {['light', 'dark', 'chatgpt'].map((themeOption) => (
            <TouchableOpacity
              key={themeOption}
              style={[
                styles.themeButton,
                theme === themeOption && styles.themeButtonActive
              ]}
              onPress={() => setTheme(themeOption)}
            >
              <Text style={[
                styles.themeButtonText,
                theme === themeOption && styles.themeButtonTextActive
              ]}>
                {themeOption === 'light' ? '浅色' : themeOption === 'dark' ? '深色' : 'ChatGPT'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 开关选项 */}
      <View style={styles.switchContainer}>
        <View style={styles.switchItem}>
          <Text style={styles.switchLabel}>虚拟化渲染</Text>
          <Switch
            value={enableVirtualization}
            onValueChange={setEnableVirtualization}
            trackColor={{ false: '#E5E5EA', true: '#34C759' }}
            thumbColor="#FFFFFF"
          />
        </View>
        
        <View style={styles.switchItem}>
          <Text style={styles.switchLabel}>性能监控</Text>
          <Switch
            value={enablePerformanceMonitoring}
            onValueChange={setEnablePerformanceMonitoring}
            trackColor={{ false: '#E5E5EA', true: '#34C759' }}
            thumbColor="#FFFFFF"
          />
        </View>
        
        <View style={styles.switchItem}>
          <Text style={styles.switchLabel}>自适应速度</Text>
          <Switch
            value={adaptiveSpeed}
            onValueChange={setAdaptiveSpeed}
            trackColor={{ false: '#E5E5EA', true: '#34C759' }}
            thumbColor="#FFFFFF"
          />
        </View>
        
        <View style={styles.switchItem}>
          <Text style={styles.switchLabel}>内存优化</Text>
          <Switch
            value={memoryOptimization}
            onValueChange={setMemoryOptimization}
            trackColor={{ false: '#E5E5EA', true: '#34C759' }}
            thumbColor="#FFFFFF"
          />
        </View>
        
        <View style={styles.switchItem}>
          <Text style={styles.switchLabel}>调试模式</Text>
          <Switch
            value={debugMode}
            onValueChange={setDebugMode}
            trackColor={{ false: '#E5E5EA', true: '#34C759' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>
    </View>
  );

  // 渲染性能信息
  const renderPerformanceInfo = () => {
    if (!enablePerformanceMonitoring || !performanceData.fps) return null;

    return (
      <View style={styles.performanceContainer}>
        <Text style={styles.sectionTitle}>性能监控</Text>
        <View style={styles.performanceGrid}>
          <View style={styles.performanceItem}>
            <Text style={styles.performanceLabel}>FPS</Text>
            <Text style={styles.performanceValue}>{performanceData.fps}</Text>
          </View>
          <View style={styles.performanceItem}>
            <Text style={styles.performanceLabel}>进度</Text>
            <Text style={styles.performanceValue}>{Math.round(performanceData.textProgress || 0)}%</Text>
          </View>
          <View style={styles.performanceItem}>
            <Text style={styles.performanceLabel}>渲染块</Text>
            <Text style={styles.performanceValue}>{performanceData.chunksRendered || 0}</Text>
          </View>
          <View style={styles.performanceItem}>
            <Text style={styles.performanceLabel}>内存</Text>
            <Text style={styles.performanceValue}>
              {Math.round((performanceData.memoryUsage?.used || 0) / 1024 / 1024)}MB
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // 渲染示例选择
  const renderExampleSelector = () => (
    <View style={styles.exampleSelectorContainer}>
      <Text style={styles.sectionTitle}>示例类型</Text>
      <View style={styles.exampleButtonRow}>
        <TouchableOpacity
          style={[
            styles.exampleButton,
            currentExample === 'basic' && styles.exampleButtonActive
          ]}
          onPress={() => setCurrentExample('basic')}
        >
          <Text style={[
            styles.exampleButtonText,
            currentExample === 'basic' && styles.exampleButtonTextActive
          ]}>
            基础版本
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.exampleButton,
            currentExample === 'advanced' && styles.exampleButtonActive
          ]}
          onPress={() => setCurrentExample('advanced')}
        >
          <Text style={[
            styles.exampleButtonText,
            currentExample === 'advanced' && styles.exampleButtonTextActive
          ]}>
            高级版本
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // 渲染当前示例
  const renderCurrentExample = () => {
    const commonProps = {
      text: SAMPLE_TEXTS[selectedText],
      speed,
      onProgress: handleProgress,
      onComplete: handleComplete,
      theme,
    };

    if (currentExample === 'basic') {
      return (
        <ChatGPTReply
          ref={basicReplyRef}
          {...commonProps}
          style={styles.replyContainer}
        />
      );
    } else {
      return (
        <AdvancedChatGPTReply
          ref={advancedReplyRef}
          {...commonProps}
          chunkSize={chunkSize}
          enableVirtualization={enableVirtualization}
          enablePerformanceMonitoring={enablePerformanceMonitoring}
          adaptiveSpeed={adaptiveSpeed}
          memoryOptimization={memoryOptimization}
          debugMode={debugMode}
          onPerformanceUpdate={handlePerformanceUpdate}
          style={styles.replyContainer}
        />
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>ChatGPT 回复效果示例</Text>
        
        {renderExampleSelector()}
        {renderConfiguration()}
        {renderControls()}
        {renderPerformanceInfo()}
        
        <View style={styles.demoContainer}>
          <Text style={styles.sectionTitle}>演示效果</Text>
          {renderCurrentExample()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#1D1D1F',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1D1D1F',
  },
  
  // 示例选择器样式
  exampleSelectorContainer: {
    marginBottom: 24,
  },
  exampleButtonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  exampleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    alignItems: 'center',
  },
  exampleButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  exampleButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1D1D1F',
  },
  exampleButtonTextActive: {
    color: '#FFFFFF',
  },
  
  // 配置容器样式
  configContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  configItem: {
    marginBottom: 20,
  },
  configLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#1D1D1F',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  
  // 文本按钮样式
  textButtonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  textButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F2F2F7',
    borderRadius: 6,
    alignItems: 'center',
  },
  textButtonActive: {
    backgroundColor: '#007AFF',
  },
  textButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1D1D1F',
  },
  textButtonTextActive: {
    color: '#FFFFFF',
  },
  
  // 主题按钮样式
  themeButtonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  themeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F2F2F7',
    borderRadius: 6,
    alignItems: 'center',
  },
  themeButtonActive: {
    backgroundColor: '#34C759',
  },
  themeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1D1D1F',
  },
  themeButtonTextActive: {
    color: '#FFFFFF',
  },
  
  // 开关容器样式
  switchContainer: {
    gap: 12,
  },
  switchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1D1D1F',
  },
  
  // 控制按钮样式
  controlsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  controlButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: '#34C759',
  },
  pauseButton: {
    backgroundColor: '#FF9500',
  },
  resumeButton: {
    backgroundColor: '#007AFF',
  },
  resetButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  statusText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  
  // 性能监控样式
  performanceContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  performanceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  performanceItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  performanceLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  performanceValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  
  // 演示容器样式
  demoContainer: {
    marginBottom: 24,
  },
  replyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    minHeight: 300,
    maxHeight: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default ExampleUsage;