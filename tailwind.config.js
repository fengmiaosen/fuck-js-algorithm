/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./**/*.{html,js,jsx,ts,tsx}",
    "./基础编程题/**/*.{html,js,jsx,ts,tsx}",
    "./js基础/**/*.{html,js,jsx,ts,tsx}",
    "./react框架/**/*.{html,js,jsx,ts,tsx}",
    "./Vue框架/**/*.{html,js,jsx,ts,tsx}",
    "./业务相关/**/*.{html,js,jsx,ts,tsx}",
    "./前端架构/**/*.{html,js,jsx,ts,tsx}",
    "./前端性能优化/**/*.{html,js,jsx,ts,tsx}",
    "./前端监控&录屏回放/**/*.{html,js,jsx,ts,tsx}",
    "./前端跨端/**/*.{html,js,jsx,ts,tsx}",
    "./基础算法/**/*.{html,js,jsx,ts,tsx}",
    "./设计模式/**/*.{html,js,jsx,ts,tsx}",
    "./网络安全/**/*.{html,js,jsx,ts,tsx}",
    "./构建工具/**/*.{html,js,jsx,ts,tsx}",
    "./移动端H5/**/*.{html,js,jsx,ts,tsx}",
    "./组件化开发/**/*.{html,js,jsx,ts,tsx}",
    "./API请求/**/*.{html,js,jsx,ts,tsx}",
    "./canvas/**/*.{html,js,jsx,ts,tsx}",
    "./babel编译/**/*.{html,js,jsx,ts,tsx}",
    "./Node.js/**/*.{html,js,jsx,ts,tsx}",
    "./LeetCode/**/*.{html,js,jsx,ts,tsx}",
    "./PC跨端/**/*.{html,js,jsx,ts,tsx}",
    "./solidjs框架/**/*.{html,js,jsx,ts,tsx}",
    "./svelte框架/**/*.{html,js,jsx,ts,tsx}",
    "./Typescript/**/*.{html,js,jsx,ts,tsx}",
    "./Web 3.0/**/*.{html,js,jsx,ts,tsx}",
    "./WebAssembly/**/*.{html,js,jsx,ts,tsx}",
    "./WebRTC/**/*.{html,js,jsx,ts,tsx}",
    "./web设计工具/**/*.{html,js,jsx,ts,tsx}",
    "./前后端鉴权方案/**/*.{html,js,jsx,ts,tsx}",
    "./前端可视化搭建/**/*.{html,js,jsx,ts,tsx}",
    "./前端测试/**/*.{html,js,jsx,ts,tsx}",
    "./开发工具/**/*.{html,js,jsx,ts,tsx}",
    "./技术和业务/**/*.{html,js,jsx,ts,tsx}",
    "./外企面试/**/*.{html,js,jsx,ts,tsx}",
    "./其它公司面试题/**/*.{html,js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
  darkMode: 'class', // 启用暗色模式
}
