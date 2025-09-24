/**
 * 性能优化工具类
 * 专门用于优化 ChatGPT 回复效果的渲染性能
 */

import { InteractionManager, Platform } from 'react-native';

export class PerformanceOptimizer {
  constructor() {
    this.renderQueue = [];
    this.isProcessing = false;
    this.frameId = null;
    this.performanceMetrics = {
      renderTime: 0,
      memoryUsage: 0,
      frameDrops: 0,
    };
  }

  /**
   * 批量渲染优化
   * 将多个渲染任务放入队列，分帧处理
   */
  batchRender(renderFunctions) {
    this.renderQueue.push(...renderFunctions);
    
    if (!this.isProcessing) {
      this.processRenderQueue();
    }
  }

  /**
   * 处理渲染队列
   * 每帧处理时间控制在 16ms 内，确保 60fps
   */
  processRenderQueue() {
    this.isProcessing = true;
    
    const processChunk = () => {
      const startTime = Date.now();
      
      // 每帧处理时间不超过 16ms (60fps)
      while (this.renderQueue.length > 0 && Date.now() - startTime < 16) {
        const renderFunction = this.renderQueue.shift();
        try {
          renderFunction();
        } catch (error) {
          console.warn('渲染函数执行失败:', error);
        }
      }
      
      // 记录性能指标
      this.performanceMetrics.renderTime += Date.now() - startTime;
      
      if (this.renderQueue.length > 0) {
        this.frameId = requestAnimationFrame(processChunk);
      } else {
        this.isProcessing = false;
      }
    };
    
    this.frameId = requestAnimationFrame(processChunk);
  }

  /**
   * 停止渲染队列处理
   */
  stopProcessing() {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
    this.isProcessing = false;
    this.renderQueue = [];
  }

  /**
   * 内存管理器
   * 使用 LRU 缓存策略管理内存
   */
  static memoryManager = {
    cache: new Map(),
    maxCacheSize: 100,
    
    set(key, value) {
      if (this.cache.size >= this.maxCacheSize) {
        // 删除最旧的缓存项
        const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
      }
      this.cache.set(key, value);
    },
    
    get(key) {
      const value = this.cache.get(key);
      if (value !== undefined) {
        // 重新设置以更新访问顺序
        this.cache.delete(key);
        this.cache.set(key, value);
      }
      return value;
    },
    
    has(key) {
      return this.cache.has(key);
    },
    
    delete(key) {
      return this.cache.delete(key);
    },
    
    clear() {
      this.cache.clear();
    },
    
    size() {
      return this.cache.size;
    }
  };

  /**
   * 文本分析和优化建议
   */
  static analyzeText(text) {
    const words = text.split(/\s+/);
    const sentences = text.split(/[.!?。！？]/);
    const paragraphs = text.split(/\n\s*\n/);
    
    return {
      length: text.length,
      wordCount: words.length,
      sentenceCount: sentences.length,
      paragraphCount: paragraphs.length,
      avgWordLength: words.reduce((sum, word) => sum + word.length, 0) / words.length,
      avgSentenceLength: text.length / sentences.length,
      estimatedRenderTime: text.length * 0.1, // ms
      recommendedChunkSize: Math.max(50, Math.min(200, Math.floor(text.length / 100))),
      complexity: this.calculateTextComplexity(text),
    };
  }

  /**
   * 计算文本复杂度
   */
  static calculateTextComplexity(text) {
    const words = text.split(/\s+/);
    const uniqueWords = new Set(words.map(word => word.toLowerCase()));
    const vocabularyRichness = uniqueWords.size / words.length;
    
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    const sentences = text.split(/[.!?。！？]/).filter(s => s.trim());
    const avgSentenceLength = sentences.reduce((sum, sentence) => sum + sentence.length, 0) / sentences.length;
    
    // 复杂度评分 (0-1)
    const complexity = (
      (avgWordLength / 10) * 0.3 +
      (avgSentenceLength / 100) * 0.3 +
      vocabularyRichness * 0.4
    );
    
    return Math.min(1, complexity);
  }

  /**
   * 自适应速度调整
   * 根据文本长度和目标时间计算最优速度
   */
  static adaptiveSpeed(textLength, targetDuration = 30000, devicePerformance = 'medium') {
    let baseSpeed = targetDuration / textLength;
    
    // 根据设备性能调整
    const performanceMultiplier = {
      'low': 1.5,
      'medium': 1.0,
      'high': 0.7,
    };
    
    baseSpeed *= performanceMultiplier[devicePerformance] || 1.0;
    
    // 限制速度范围
    return Math.max(10, Math.min(200, baseSpeed));
  }

  /**
   * 设备性能检测
   */
  static detectDevicePerformance() {
    // 简单的性能检测逻辑
    const startTime = Date.now();
    let iterations = 0;
    
    // 执行一些计算密集型操作
    while (Date.now() - startTime < 10) {
      Math.random() * Math.random();
      iterations++;
    }
    
    // 根据迭代次数判断性能
    if (iterations > 100000) {
      return 'high';
    } else if (iterations > 50000) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  /**
   * 虚拟化渲染计算
   * 计算当前应该渲染的文本块
   */
  static calculateVisibleChunks(
    currentIndex,
    chunkSize,
    totalChunks,
    maxVisibleChunks,
    bufferSize = 2
  ) {
    const currentChunkIndex = Math.floor(currentIndex / chunkSize);
    const halfVisible = Math.floor(maxVisibleChunks / 2);
    
    let startIndex = Math.max(0, currentChunkIndex - halfVisible - bufferSize);
    let endIndex = Math.min(totalChunks, currentChunkIndex + halfVisible + bufferSize);
    
    // 确保至少有 maxVisibleChunks 个块
    if (endIndex - startIndex < maxVisibleChunks) {
      if (startIndex === 0) {
        endIndex = Math.min(totalChunks, maxVisibleChunks);
      } else if (endIndex === totalChunks) {
        startIndex = Math.max(0, totalChunks - maxVisibleChunks);
      }
    }
    
    return { startIndex, endIndex };
  }

  /**
   * 内存使用监控
   */
  static monitorMemoryUsage() {
    if (Platform.OS === 'android' && global.performance && global.performance.memory) {
      return {
        used: global.performance.memory.usedJSHeapSize,
        total: global.performance.memory.totalJSHeapSize,
        limit: global.performance.memory.jsHeapSizeLimit,
      };
    }
    
    // iOS 或不支持的环境返回模拟数据
    return {
      used: 0,
      total: 0,
      limit: 0,
    };
  }

  /**
   * 性能指标收集
   */
  getPerformanceMetrics() {
    return {
      ...this.performanceMetrics,
      memoryUsage: PerformanceOptimizer.monitorMemoryUsage(),
      queueLength: this.renderQueue.length,
      isProcessing: this.isProcessing,
    };
  }

  /**
   * 重置性能指标
   */
  resetMetrics() {
    this.performanceMetrics = {
      renderTime: 0,
      memoryUsage: 0,
      frameDrops: 0,
    };
  }
}

/**
 * 文本处理器
 * 专门处理文本分块、预处理等操作
 */
export class TextProcessor {
  /**
   * 智能分词
   * 按照语义边界分割文本，保持句子完整性
   */
  static smartSplit(text, chunkSize = 100) {
    const chunks = [];
    let currentChunk = '';
    
    // 按句子分割
    const sentences = text.split(/([.!?。！？]\s*)/);
    
    for (let i = 0; i < sentences.length; i += 2) {
      const sentence = sentences[i] + (sentences[i + 1] || '');
      
      if (currentChunk.length + sentence.length <= chunkSize) {
        currentChunk += sentence;
      } else {
        if (currentChunk.trim()) {
          chunks.push(currentChunk.trim());
        }
        
        // 如果单个句子超过块大小，强制分割
        if (sentence.length > chunkSize) {
          const words = sentence.split(/\s+/);
          let wordChunk = '';
          
          for (const word of words) {
            if (wordChunk.length + word.length + 1 <= chunkSize) {
              wordChunk += (wordChunk ? ' ' : '') + word;
            } else {
              if (wordChunk) {
                chunks.push(wordChunk);
              }
              wordChunk = word;
            }
          }
          
          currentChunk = wordChunk;
        } else {
          currentChunk = sentence;
        }
      }
    }
    
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }
    
    return chunks;
  }

  /**
   * 文本预处理
   * 清理和标准化文本格式
   */
  static preprocess(text) {
    return text
      .replace(/\r\n/g, '\n')           // 统一换行符
      .replace(/\r/g, '\n')             // 统一换行符
      .replace(/\n{3,}/g, '\n\n')       // 合并多余的空行
      .replace(/\t/g, '    ')           // 制表符转空格
      .replace(/\u00A0/g, ' ')          // 非断行空格转普通空格
      .trim();                          // 去除首尾空白
  }

  /**
   * 计算文本复杂度
   * 返回详细的复杂度分析
   */
  static calculateComplexity(text) {
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const sentences = text.split(/[.!?。！？]/).filter(s => s.trim().length > 0);
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    const avgSentenceLength = sentences.reduce((sum, sentence) => sum + sentence.length, 0) / sentences.length;
    const avgParagraphLength = paragraphs.reduce((sum, paragraph) => sum + paragraph.length, 0) / paragraphs.length;
    
    // 词汇丰富度
    const uniqueWords = new Set(words.map(word => word.toLowerCase()));
    const vocabularyRichness = uniqueWords.size / words.length;
    
    // 标点符号密度
    const punctuationCount = (text.match(/[,.!?;:。，！？；：]/g) || []).length;
    const punctuationDensity = punctuationCount / text.length;
    
    return {
      avgWordLength,
      avgSentenceLength,
      avgParagraphLength,
      vocabularyRichness,
      punctuationDensity,
      complexity: (avgWordLength * avgSentenceLength * vocabularyRichness) / 1000,
      readabilityScore: this.calculateReadabilityScore(words, sentences),
    };
  }

  /**
   * 计算可读性评分
   * 基于 Flesch Reading Ease 公式的简化版本
   */
  static calculateReadabilityScore(words, sentences) {
    const avgSentenceLength = words.length / sentences.length;
    const avgSyllablesPerWord = words.reduce((sum, word) => {
      return sum + this.countSyllables(word);
    }, 0) / words.length;
    
    // 简化的 Flesch Reading Ease 公式
    const score = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
    
    return Math.max(0, Math.min(100, score));
  }

  /**
   * 估算单词音节数
   * 简化的音节计算方法
   */
  static countSyllables(word) {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    
    const vowels = 'aeiouy';
    let syllableCount = 0;
    let previousWasVowel = false;
    
    for (let i = 0; i < word.length; i++) {
      const isVowel = vowels.includes(word[i]);
      if (isVowel && !previousWasVowel) {
        syllableCount++;
      }
      previousWasVowel = isVowel;
    }
    
    // 处理以 'e' 结尾的单词
    if (word.endsWith('e')) {
      syllableCount--;
    }
    
    return Math.max(1, syllableCount);
  }

  /**
   * 文本分段
   * 按照段落和语义分割文本
   */
  static segmentText(text, options = {}) {
    const {
      maxSegmentLength = 500,
      preserveParagraphs = true,
      preserveSentences = true,
    } = options;
    
    const segments = [];
    
    if (preserveParagraphs) {
      const paragraphs = text.split(/\n\s*\n/);
      
      for (const paragraph of paragraphs) {
        if (paragraph.length <= maxSegmentLength) {
          segments.push(paragraph.trim());
        } else {
          // 段落太长，需要进一步分割
          const subSegments = this.splitLongText(paragraph, maxSegmentLength, preserveSentences);
          segments.push(...subSegments);
        }
      }
    } else {
      const subSegments = this.splitLongText(text, maxSegmentLength, preserveSentences);
      segments.push(...subSegments);
    }
    
    return segments.filter(segment => segment.trim().length > 0);
  }

  /**
   * 分割长文本
   * 辅助方法，用于分割超长的文本段落
   */
  static splitLongText(text, maxLength, preserveSentences) {
    const segments = [];
    
    if (preserveSentences) {
      const sentences = text.split(/([.!?。！？]\s*)/);
      let currentSegment = '';
      
      for (let i = 0; i < sentences.length; i += 2) {
        const sentence = sentences[i] + (sentences[i + 1] || '');
        
        if (currentSegment.length + sentence.length <= maxLength) {
          currentSegment += sentence;
        } else {
          if (currentSegment.trim()) {
            segments.push(currentSegment.trim());
          }
          currentSegment = sentence;
        }
      }
      
      if (currentSegment.trim()) {
        segments.push(currentSegment.trim());
      }
    } else {
      // 简单的字符数分割
      for (let i = 0; i < text.length; i += maxLength) {
        segments.push(text.slice(i, i + maxLength));
      }
    }
    
    return segments;
  }
}

/**
 * 动画管理器
 * 管理打字机效果的动画状态
 */
export class AnimationManager {
  constructor() {
    this.animations = new Map();
    this.globalSpeed = 1.0;
  }

  /**
   * 创建打字动画
   */
  createTypingAnimation(id, config = {}) {
    const {
      speed = 50,
      easing = 'linear',
      onProgress = () => {},
      onComplete = () => {},
    } = config;

    const animation = {
      id,
      speed,
      easing,
      onProgress,
      onComplete,
      startTime: null,
      pausedTime: 0,
      isPaused: false,
      isCompleted: false,
    };

    this.animations.set(id, animation);
    return animation;
  }

  /**
   * 开始动画
   */
  startAnimation(id) {
    const animation = this.animations.get(id);
    if (animation && !animation.isCompleted) {
      animation.startTime = Date.now() - animation.pausedTime;
      animation.isPaused = false;
    }
  }

  /**
   * 暂停动画
   */
  pauseAnimation(id) {
    const animation = this.animations.get(id);
    if (animation && !animation.isPaused) {
      animation.pausedTime = Date.now() - animation.startTime;
      animation.isPaused = true;
    }
  }

  /**
   * 停止动画
   */
  stopAnimation(id) {
    const animation = this.animations.get(id);
    if (animation) {
      animation.isCompleted = true;
      animation.isPaused = true;
    }
  }

  /**
   * 删除动画
   */
  removeAnimation(id) {
    this.animations.delete(id);
  }

  /**
   * 设置全局速度倍率
   */
  setGlobalSpeed(speed) {
    this.globalSpeed = Math.max(0.1, Math.min(5.0, speed));
  }

  /**
   * 获取动画状态
   */
  getAnimationState(id) {
    return this.animations.get(id);
  }

  /**
   * 清理所有动画
   */
  cleanup() {
    this.animations.clear();
  }
}

export default PerformanceOptimizer;