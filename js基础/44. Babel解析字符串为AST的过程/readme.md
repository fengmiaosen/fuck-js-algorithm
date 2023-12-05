
大致分为下面四步：

Babel 具体见下方链接文件的代码
https://github.com/caiyongmin/awesome-coding-javascript/tree/master/src/bundler/babel


1. 词法分析

input => tokenizer => tokens，先对输入代码进行分词，根据最小有效语法单元，对字符串进行切割。

   
2. 语法分析

tokens => parser => AST，然后进行语法分析，会涉及到读取、暂存、回溯、暂存点销毁等操作。


3. AST转换

AST => transformer => newAST，然后转换生成新的 AST


4. AST输出
newAST => codeGenerator => output，最后根据新生成的 AST 输出目标代码。


### 参考资料

[babel 怎么把字符串解析成 AST，是怎么进行词法/语法分析的](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/315)
[掌握了AST，再也不怕被问babel，vue编译，Prettier等原理](https://mp.weixin.qq.com/s/fH2xYo_Bad0mgvo0OdYRZQ)
