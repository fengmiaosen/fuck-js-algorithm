<!-- https://trac.webkit.org/wiki/JavaScriptCore -->

# JavaScriptCore Overview

JavaScriptCore is WebKit's built-in JavaScript engine. It includes:

## Key Components

- **LLInt (Low Level Interpreter)**: The first tier interpreter that executes JavaScript code directly
- **Baseline JIT**: A simple JIT compiler that generates relatively unoptimized machine code
- **DFG JIT (Data Flow Graph)**: An optimizing JIT compiler that performs aggressive optimizations
- **FTL JIT (Faster Than Light)**: The highest tier JIT compiler that produces heavily optimized code

## Main Features

- Multiple compilation tiers for optimal performance
- Garbage collection
- Just-In-Time compilation
- Type inference
- Optimizing compiler

## Usage

JavaScriptCore can be used:

1. As part of WebKit in web browsers
2. As a standalone JavaScript engine
3. Through public C API
4. Via Objective-C/Swift API on Apple platforms

## Performance Characteristics

- Adaptive compilation based on code hotness
- Speculative optimizations
- On-stack replacement
- Inline caching

JavaScriptCore provides a robust foundation for executing JavaScript code with good performance characteristics while maintaining memory efficiency.
