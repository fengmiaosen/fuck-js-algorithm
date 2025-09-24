/**
 * 高级 ChatGPT 回复组件
 * 提供更多自定义选项和性能调优功能
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Animated,
  Dimensions,
  Platform,
  InteractionManager,
  StyleSheet,
} from 'react-native';
import { PerformanceOptimizer, TextProcessor, AnimationManager } from './PerformanceOptimizer';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const AdvancedChatGPTReply = ({
  text = '',
  speed = 50,
  chunkSize = 100,
  maxVisibleChunks = 10,
  enableVirtualization = true,
  enablePerformanceMonitoring = true,
  animationConfig = {},
  onProgress = () => {},
  onComplete = () => {},
  onPerformanceUpdate = () => {},
  style = {},
  textStyle = {},
  containerStyle = {},
  theme = 'light',
  autoStart = true,
  pauseOnBackground = true,
  adaptiveSpeed = true,
  memoryOptimization = true,
  debugMode = false,
}) => {
  // 状态管理
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState({});
  const [visibleChunks, setVisibleChunks] = useState([]);
  const [devicePerformance, setDevicePerformance] = useState('medium');

  // Refs
  const animationRef = useRef(null);
  const performanceOptimizerRef = useRef(new PerformanceOptimizer());
  const animationManagerRef = useRef(new AnimationManager());
  const scrollViewRef = useRef(null);
  const lastUpdateTimeRef = useRef(Date.now());
  const frameCountRef = useRef(0);
  const appStateRef = useRef('active');

  // 预处理文本
  const processedText = useMemo(() => {
    return TextProcessor.preprocess(text);
  }, [text]);

  // 文本分析
  const textAnalysis = useMemo(() => {
    return PerformanceOptimizer.analyzeText(processedText);
  }, [processedText]);

  // 智能分块
  const textChunks = useMemo(() => {
    const adaptiveChunkSize = adaptiveSpeed 
      ? Math.max(50, Math.min(200, Math.floor(processedText.length / 100)))
      : chunkSize;
    
    return TextProcessor.smartSplit(processedText, adaptiveChunkSize);
  }, [processedText, chunkSize, adaptiveSpeed]);

  // 自适应速度计算
  const adaptiveSpeedValue = useMemo(() => {
    if (!adaptiveSpeed) return speed;
    
    return PerformanceOptimizer.adaptiveSpeed(
      processedText.length,
      30000, // 30秒目标时间
      devicePerformance
    );
  }, [speed, adaptiveSpeed, processedText.length, devicePerformance]);

  // 主题样式
  const themeStyles = useMemo(() => {
    const themes = {
      light: {
        backgroundColor: '#ffffff',
        textColor: '#000000',
        borderColor: '#e0e0e0',
      },
      dark: {
        backgroundColor: '#1a1a1a',
        textColor: '#ffffff',
        borderColor: '#333333',
      },
      chatgpt: {
        backgroundColor: '#f7f7f8',
        textColor: '#374151',
        borderColor: '#d1d5db',
      },
    };
    
    return themes[theme] || themes.light;
  }, [theme]);

  // 设备性能检测
  useEffect(() => {
    const detectPerformance = async () => {
      await InteractionManager.runAfterInteractions(() => {
        const performance = PerformanceOptimizer.detectDevicePerformance();
        setDevicePerformance(performance);
      });
    };
    
    detectPerformance();
  }, []);

  // 虚拟化渲染计算
  const calculateVisibleChunks = useCallback(() => {
    if (!enableVirtualization) {
      return textChunks.map((chunk, index) => ({ chunk, index }));
    }

    const { startIndex, endIndex } = PerformanceOptimizer.calculateVisibleChunks(
      currentIndex,
      chunkSize,
      textChunks.length,
      maxVisibleChunks
    );

    return textChunks
      .slice(startIndex, endIndex)
      .map((chunk, relativeIndex) => ({
        chunk,
        index: startIndex + relativeIndex,
      }));
  }, [currentIndex, textChunks, chunkSize, maxVisibleChunks, enableVirtualization]);

  // 更新可见块
  useEffect(() => {
    const newVisibleChunks = calculateVisibleChunks();
    setVisibleChunks(newVisibleChunks);
  }, [calculateVisibleChunks]);

  // 性能监控
  useEffect(() => {
    if (!enablePerformanceMonitoring) return;

    const monitorPerformance = () => {
      const metrics = performanceOptimizerRef.current.getPerformanceMetrics();
      const memoryUsage = PerformanceOptimizer.monitorMemoryUsage();
      
      const currentTime = Date.now();
      const deltaTime = currentTime - lastUpdateTimeRef.current;
      frameCountRef.current++;
      
      const fps = deltaTime > 0 ? 1000 / deltaTime : 0;
      
      const performanceData = {
        ...metrics,
        memoryUsage,
        fps: Math.round(fps),
        textProgress: (currentIndex / processedText.length) * 100,
        chunksRendered: visibleChunks.length,
        devicePerformance,
      };
      
      setPerformanceMetrics(performanceData);
      onPerformanceUpdate(performanceData);
      
      lastUpdateTimeRef.current = currentTime;
    };

    const interval = setInterval(monitorPerformance, 1000);
    return () => clearInterval(interval);
  }, [currentIndex, processedText.length, visibleChunks.length, devicePerformance, enablePerformanceMonitoring, onPerformanceUpdate]);

  // 打字动画逻辑
  const startTypingAnimation = useCallback(() => {
    if (isCompleted || isPlaying) return;

    setIsPlaying(true);
    setIsPaused(false);

    const animationId = 'typing-animation';
    const animation = animationManagerRef.current.createTypingAnimation(animationId, {
      speed: adaptiveSpeedValue,
      onProgress: (progress) => {
        onProgress(progress);
      },
      onComplete: () => {
        setIsCompleted(true);
        setIsPlaying(false);
        onComplete();
      },
    });

    animationManagerRef.current.startAnimation(animationId);

    const animate = () => {
      if (currentIndex >= processedText.length) {
        setIsCompleted(true);
        setIsPlaying(false);
        onComplete();
        return;
      }

      if (!isPlaying || isPaused) return;

      // 批量渲染优化
      const renderFunctions = [];
      const batchSize = Math.min(5, processedText.length - currentIndex);

      for (let i = 0; i < batchSize; i++) {
        const newIndex = currentIndex + i;
        if (newIndex < processedText.length) {
          renderFunctions.push(() => {
            setCurrentIndex(newIndex + 1);
            setDisplayedText(processedText.slice(0, newIndex + 1));
          });
        }
      }

      performanceOptimizerRef.current.batchRender(renderFunctions);

      // 内存管理
      if (memoryOptimization && currentIndex % 1000 === 0) {
        PerformanceOptimizer.memoryManager.clear();
      }

      // 自动滚动
      if (scrollViewRef.current && currentIndex % 100 === 0) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }

      animationRef.current = setTimeout(animate, adaptiveSpeedValue);
    };

    animate();
  }, [
    currentIndex,
    processedText,
    adaptiveSpeedValue,
    isCompleted,
    isPlaying,
    isPaused,
    memoryOptimization,
    onProgress,
    onComplete,
  ]);

  // 暂停动画
  const pauseAnimation = useCallback(() => {
    setIsPaused(true);
    setIsPlaying(false);
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    animationManagerRef.current.pauseAnimation('typing-animation');
  }, []);

  // 恢复动画
  const resumeAnimation = useCallback(() => {
    if (!isCompleted) {
      setIsPaused(false);
      startTypingAnimation();
    }
  }, [isCompleted, startTypingAnimation]);

  // 重置动画
  const resetAnimation = useCallback(() => {
    setCurrentIndex(0);
    setDisplayedText('');
    setIsPlaying(false);
    setIsPaused(false);
    setIsCompleted(false);
    
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    
    performanceOptimizerRef.current.stopProcessing();
    performanceOptimizerRef.current.resetMetrics();
    animationManagerRef.current.removeAnimation('typing-animation');
  }, []);

  // 自动开始
  useEffect(() => {
    if (autoStart && processedText && !isPlaying && !isCompleted) {
      const timer = setTimeout(() => {
        startTypingAnimation();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [autoStart, processedText, isPlaying, isCompleted, startTypingAnimation]);

  // 应用状态监听
  useEffect(() => {
    if (!pauseOnBackground) return;

    const handleAppStateChange = (nextAppState) => {
      if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
        // 应用回到前台
        if (isPaused && !isCompleted) {
          resumeAnimation();
        }
      } else if (nextAppState.match(/inactive|background/)) {
        // 应用进入后台
        if (isPlaying) {
          pauseAnimation();
        }
      }
      appStateRef.current = nextAppState;
    };

    // 注意：在实际应用中需要使用 AppState.addEventListener
    // 这里只是示例代码
    
    return () => {
      // 清理监听器
    };
  }, [isPaused, isCompleted, isPlaying, pauseOnBackground, resumeAnimation, pauseAnimation]);

  // 清理资源
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
      performanceOptimizerRef.current.stopProcessing();
      animationManagerRef.current.cleanup();
    };
  }, []);

  // 渲染文本块
  const renderTextChunk = useCallback((chunkData, index) => {
    const { chunk, index: chunkIndex } = chunkData;
    const chunkStartIndex = textChunks.slice(0, chunkIndex).join('').length;
    const chunkEndIndex = chunkStartIndex + chunk.length;
    
    let visibleText = '';
    if (currentIndex > chunkStartIndex) {
      const visibleLength = Math.min(currentIndex - chunkStartIndex, chunk.length);
      visibleText = chunk.slice(0, visibleLength);
    }

    return (
      <Text
        key={`chunk-${chunkIndex}`}
        style={[
          styles.textChunk,
          textStyle,
          { color: themeStyles.textColor },
        ]}
      >
        {visibleText}
      </Text>
    );
  }, [currentIndex, textChunks, textStyle, themeStyles.textColor]);

  // 调试信息
  const renderDebugInfo = () => {
    if (!debugMode) return null;

    return (
      <View style={styles.debugContainer}>
        <Text style={styles.debugText}>
          进度: {Math.round((currentIndex / processedText.length) * 100)}%
        </Text>
        <Text style={styles.debugText}>
          当前索引: {currentIndex} / {processedText.length}
        </Text>
        <Text style={styles.debugText}>
          可见块数: {visibleChunks.length} / {textChunks.length}
        </Text>
        <Text style={styles.debugText}>
          设备性能: {devicePerformance}
        </Text>
        <Text style={styles.debugText}>
          FPS: {performanceMetrics.fps || 0}
        </Text>
        <Text style={styles.debugText}>
          内存使用: {Math.round((performanceMetrics.memoryUsage?.used || 0) / 1024 / 1024)}MB
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, containerStyle, { backgroundColor: themeStyles.backgroundColor }]}>
      <ScrollView
        ref={scrollViewRef}
        style={[styles.scrollView, style]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        <View style={styles.textContainer}>
          {enableVirtualization
            ? visibleChunks.map(renderTextChunk)
            : <Text style={[styles.text, textStyle, { color: themeStyles.textColor }]}>
                {displayedText}
              </Text>
          }
        </View>
      </ScrollView>
      
      {renderDebugInfo()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollView: {
    flex: 1,
  },
  textContainer: {
    paddingBottom: 20,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  textChunk: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  debugContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 8,
    borderRadius: 4,
    minWidth: 200,
  },
  debugText: {
    color: '#ffffff',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginBottom: 2,
  },
});

// 导出控制方法的 Hook
export const useChatGPTReplyControls = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [progress, setProgress] = useState(0);

  const controls = {
    play: () => setIsPlaying(true),
    pause: () => {
      setIsPlaying(false);
      setIsPaused(true);
    },
    resume: () => {
      setIsPlaying(true);
      setIsPaused(false);
    },
    reset: () => {
      setIsPlaying(false);
      setIsPaused(false);
      setIsCompleted(false);
      setProgress(0);
    },
    stop: () => {
      setIsPlaying(false);
      setIsCompleted(true);
    },
  };

  const status = {
    isPlaying,
    isPaused,
    isCompleted,
    progress,
  };

  return { controls, status };
};

export default AdvancedChatGPTReply;