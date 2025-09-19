/**
 * History API 与 popstate 事件演示
 * 核心问题：调用 history.pushState() 或 history.replaceState() 会不会触发 popstate 事件？
 * 答案：不会！
 */

console.log('=== History API 与 popstate 事件演示 ===\n');

// 1. 设置 popstate 事件监听器
console.log('1. 设置 popstate 事件监听器');
let popstateCount = 0;

if (typeof window !== 'undefined') {
    window.addEventListener('popstate', function(event) {
        popstateCount++;
        console.log(`🎯 popstate 事件被触发！(第${popstateCount}次)`);
        console.log('   事件状态:', event.state);
        console.log('   当前URL:', window.location.href);
        console.log('');
    });
    console.log('✅ popstate 监听器已设置\n');
} else {
    console.log('⚠️  当前环境不支持 window 对象，无法演示浏览器 API\n');
}

// 2. 测试 pushState - 不会触发 popstate
console.log('2. 测试 pushState（不会触发 popstate）');
function testPushState() {
    console.log('📝 调用 history.pushState() 前...');
    
    if (typeof history !== 'undefined') {
        const state = { page: 'test1', timestamp: Date.now() };
        const title = 'Test Page 1';
        const url = '/test1';
        
        history.pushState(state, title, url);
        console.log('✅ history.pushState() 调用完成');
        console.log('   状态:', state);
        console.log('   URL:', url);
        console.log('   popstate 事件触发次数:', popstateCount);
    } else {
        console.log('⚠️  当前环境不支持 history 对象');
    }
    console.log('');
}

// 3. 测试 replaceState - 不会触发 popstate
console.log('3. 测试 replaceState（不会触发 popstate）');
function testReplaceState() {
    console.log('📝 调用 history.replaceState() 前...');
    
    if (typeof history !== 'undefined') {
        const state = { page: 'test2', timestamp: Date.now() };
        const title = 'Test Page 2';
        const url = '/test2';
        
        history.replaceState(state, title, url);
        console.log('✅ history.replaceState() 调用完成');
        console.log('   状态:', state);
        console.log('   URL:', url);
        console.log('   popstate 事件触发次数:', popstateCount);
    } else {
        console.log('⚠️  当前环境不支持 history 对象');
    }
    console.log('');
}

// 4. 连续调用测试
console.log('4. 连续调用 pushState 测试');
function testMultiplePushState() {
    console.log('📝 连续调用 pushState 3次...');
    
    if (typeof history !== 'undefined') {
        for (let i = 1; i <= 3; i++) {
            const state = { page: `multi${i}`, step: i };
            const url = `/multi${i}`;
            
            history.pushState(state, `Multi ${i}`, url);
            console.log(`   ${i}. pushState 完成 - URL: ${url}`);
        }
        
        console.log('✅ 连续 pushState 完成');
        console.log('   popstate 事件触发次数:', popstateCount);
    } else {
        console.log('⚠️  当前环境不支持 history 对象');
    }
    console.log('');
}

// 5. 模拟 SPA 路由器
console.log('5. SPA 路由器示例');
class SimpleRouter {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        this.init();
    }
    
    init() {
        if (typeof window !== 'undefined') {
            // 监听 popstate 事件处理浏览器前进后退
            window.addEventListener('popstate', (event) => {
                console.log('🔄 路由器检测到 popstate 事件');
                const path = window.location.pathname;
                this.handleRoute(path, event.state, 'popstate');
            });
        }
    }
    
    // 注册路由
    route(path, handler) {
        this.routes[path] = handler;
        console.log(`📋 注册路由: ${path}`);
    }
    
    // 导航到新路由 - 使用 pushState
    navigate(path, state = {}) {
        console.log(`🚀 导航到: ${path}`);
        
        if (typeof history !== 'undefined') {
            // pushState 不会触发 popstate，需要手动处理
            history.pushState(state, '', path);
            this.handleRoute(path, state, 'navigate');
        } else {
            this.handleRoute(path, state, 'navigate');
        }
    }
    
    // 替换当前路由 - 使用 replaceState
    replace(path, state = {}) {
        console.log(`🔄 替换路由: ${path}`);
        
        if (typeof history !== 'undefined') {
            // replaceState 不会触发 popstate，需要手动处理
            history.replaceState(state, '', path);
            this.handleRoute(path, state, 'replace');
        } else {
            this.handleRoute(path, state, 'replace');
        }
    }
    
    handleRoute(path, state, source) {
        console.log(`   处理路由变化 - 来源: ${source}`);
        console.log(`   路径: ${path}`);
        console.log(`   状态:`, state);
        
        const handler = this.routes[path];
        if (handler) {
            this.currentRoute = path;
            handler(state);
        } else {
            console.log(`   ⚠️  未找到路由处理器: ${path}`);
        }
        console.log('');
    }
}

// 使用路由器
const router = new SimpleRouter();

// 注册路由
router.route('/home', (state) => {
    console.log('🏠 渲染首页', state);
});

router.route('/about', (state) => {
    console.log('ℹ️  渲染关于页面', state);
});

router.route('/contact', (state) => {
    console.log('📞 渲染联系页面', state);
});

console.log('');

// 6. 历史记录管理器
console.log('6. 历史记录管理器示例');
class HistoryManager {
    constructor() {
        this.history = [];
        this.currentIndex = -1;
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        if (typeof window !== 'undefined') {
            window.addEventListener('popstate', (event) => {
                console.log('📚 历史管理器检测到 popstate');
                console.log('   事件状态:', event.state);
                this.onHistoryChange(event.state);
            });
        }
    }
    
    // 添加新的历史记录
    push(url, state, title = '') {
        console.log(`📝 添加历史记录: ${url}`);
        
        if (typeof history !== 'undefined') {
            history.pushState(state, title, url);
        }
        
        // 更新内部历史记录
        this.currentIndex++;
        this.history = this.history.slice(0, this.currentIndex);
        this.history.push({ url, state, title, timestamp: Date.now() });
        
        // 手动触发状态变化处理
        this.onHistoryChange(state);
    }
    
    // 替换当前历史记录
    replace(url, state, title = '') {
        console.log(`🔄 替换历史记录: ${url}`);
        
        if (typeof history !== 'undefined') {
            history.replaceState(state, title, url);
        }
        
        // 更新内部历史记录
        if (this.currentIndex >= 0) {
            this.history[this.currentIndex] = { url, state, title, timestamp: Date.now() };
        }
        
        // 手动触发状态变化处理
        this.onHistoryChange(state);
    }
    
    // 历史记录变化处理
    onHistoryChange(state) {
        console.log('   处理历史记录变化');
        console.log('   当前状态:', state);
        
        if (typeof window !== 'undefined') {
            console.log('   当前URL:', window.location.href);
        }
        
        this.updatePage(state);
    }
    
    updatePage(state) {
        if (state && state.page) {
            console.log(`   📄 更新页面内容: ${state.page}`);
        }
        console.log('');
    }
    
    // 获取历史记录信息
    getHistoryInfo() {
        return {
            total: this.history.length,
            current: this.currentIndex,
            history: this.history
        };
    }
}

const historyManager = new HistoryManager();
console.log('');

// 7. 执行测试
console.log('=== 开始执行测试 ===\n');

// 延迟执行以确保事件监听器已设置
setTimeout(() => {
    testPushState();
    
    setTimeout(() => {
        testReplaceState();
        
        setTimeout(() => {
            testMultiplePushState();
            
            setTimeout(() => {
                console.log('=== 路由器测试 ===');
                router.navigate('/home', { from: 'test', timestamp: Date.now() });
                router.navigate('/about', { from: 'test', timestamp: Date.now() });
                router.replace('/about-updated', { from: 'test', updated: true });
                
                setTimeout(() => {
                    console.log('=== 历史管理器测试 ===');
                    historyManager.push('/page1', { page: 'Page 1', id: 1 });
                    historyManager.push('/page2', { page: 'Page 2', id: 2 });
                    historyManager.replace('/page2-updated', { page: 'Page 2 Updated', id: 2 });
                    
                    setTimeout(() => {
                        console.log('=== 测试总结 ===');
                        console.log(`✅ 所有测试完成`);
                        console.log(`📊 popstate 事件总共触发了 ${popstateCount} 次`);
                        console.log('');
                        console.log('🔍 关键发现:');
                        console.log('   1. pushState() 和 replaceState() 都没有触发 popstate 事件');
                        console.log('   2. 只有用户的浏览器导航行为才会触发 popstate');
                        console.log('   3. 在 SPA 中需要手动处理 pushState/replaceState 后的状态变化');
                        console.log('');
                        
                        if (typeof history !== 'undefined') {
                            console.log('💡 提示: 在浏览器中，你可以:');
                            console.log('   - 点击浏览器的后退/前进按钮来触发 popstate');
                            console.log('   - 调用 history.back() 或 history.forward() 来触发 popstate');
                            console.log('   - 调用 history.go(-1) 或 history.go(1) 来触发 popstate');
                        }
                        
                        console.log('');
                        console.log('📚 历史记录信息:', historyManager.getHistoryInfo());
                    }, 100);
                }, 100);
            }, 100);
        }, 100);
    }, 100);
}, 100);

// 8. 导出函数供外部使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SimpleRouter,
        HistoryManager,
        testPushState,
        testReplaceState,
        testMultiplePushState
    };
}

// 9. 浏览器环境下的额外功能
if (typeof window !== 'undefined') {
    // 将函数挂载到全局对象，方便在控制台中测试
    window.historyDemo = {
        router,
        historyManager,
        testPushState,
        testReplaceState,
        testMultiplePushState,
        
        // 便捷的测试函数
        testBackNavigation() {
            console.log('🔙 测试 history.back() - 这会触发 popstate');
            history.back();
        },
        
        testForwardNavigation() {
            console.log('🔜 测试 history.forward() - 这会触发 popstate');
            history.forward();
        },
        
        testGoNavigation(delta = -1) {
            console.log(`↩️ 测试 history.go(${delta}) - 这会触发 popstate`);
            history.go(delta);
        },
        
        getPopstateCount() {
            return popstateCount;
        },
        
        resetPopstateCount() {
            popstateCount = 0;
            console.log('🔄 popstate 计数器已重置');
        }
    };
    
    console.log('🌐 浏览器环境检测到，已将测试函数挂载到 window.historyDemo');
    console.log('   你可以在控制台中使用以下命令:');
    console.log('   - window.historyDemo.testBackNavigation()');
    console.log('   - window.historyDemo.testForwardNavigation()');
    console.log('   - window.historyDemo.testGoNavigation(-1)');
    console.log('   - window.historyDemo.getPopstateCount()');
    console.log('');
}