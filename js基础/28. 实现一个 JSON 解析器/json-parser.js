/**
 * JSON 解析器实现
 * 包含词法分析器(Lexer)和语法分析器(Parser)
 */

// Token 类型定义
const TokenType = {
  LEFT_BRACE: 'LEFT_BRACE',        // {
  RIGHT_BRACE: 'RIGHT_BRACE',      // }
  LEFT_BRACKET: 'LEFT_BRACKET',    // [
  RIGHT_BRACKET: 'RIGHT_BRACKET',  // ]
  COMMA: 'COMMA',                  // ,
  COLON: 'COLON',                  // :
  STRING: 'STRING',                // "string"
  NUMBER: 'NUMBER',                // 123, 123.45
  BOOLEAN: 'BOOLEAN',              // true, false
  NULL: 'NULL',                    // null
  EOF: 'EOF'                       // 结束符
};

/**
 * 词法分析器 - 将JSON字符串分解为tokens
 */
class Lexer {
  constructor(input) {
    this.input = input;
    this.position = 0;
    this.currentChar = this.input[this.position];
  }

  // 移动到下一个字符
  advance() {
    this.position++;
    if (this.position >= this.input.length) {
      this.currentChar = null;
    } else {
      this.currentChar = this.input[this.position];
    }
  }

  // 跳过空白字符
  skipWhitespace() {
    while (this.currentChar && /\s/.test(this.currentChar)) {
      this.advance();
    }
  }

  // 解析字符串
  parseString() {
    let result = '';
    this.advance(); // 跳过开始的引号

    while (this.currentChar && this.currentChar !== '"') {
      if (this.currentChar === '\\') {
        this.advance();
        // 处理转义字符
        switch (this.currentChar) {
          case '"':
            result += '"';
            break;
          case '\\':
            result += '\\';
            break;
          case '/':
            result += '/';
            break;
          case 'b':
            result += '\b';
            break;
          case 'f':
            result += '\f';
            break;
          case 'n':
            result += '\n';
            break;
          case 'r':
            result += '\r';
            break;
          case 't':
            result += '\t';
            break;
          case 'u':
            // Unicode 转义序列
            this.advance();
            let unicode = '';
            for (let i = 0; i < 4; i++) {
              if (this.currentChar && /[0-9a-fA-F]/.test(this.currentChar)) {
                unicode += this.currentChar;
                this.advance();
              } else {
                throw new Error('Invalid unicode escape sequence');
              }
            }
            result += String.fromCharCode(parseInt(unicode, 16));
            continue;
          default:
            throw new Error(`Invalid escape character: \\${this.currentChar}`);
        }
      } else {
        result += this.currentChar;
      }
      this.advance();
    }

    if (this.currentChar !== '"') {
      throw new Error('Unterminated string');
    }
    this.advance(); // 跳过结束的引号

    return {
      type: TokenType.STRING,
      value: result
    };
  }

  // 解析数字
  parseNumber() {
    let result = '';
    
    // 处理负号
    if (this.currentChar === '-') {
      result += this.currentChar;
      this.advance();
    }

    // 处理整数部分
    if (this.currentChar === '0') {
      result += this.currentChar;
      this.advance();
      // 检查前导零（除了单独的0）
      if (this.currentChar && /[0-9]/.test(this.currentChar)) {
        throw new Error('Invalid number format');
      }
    } else if (/[1-9]/.test(this.currentChar)) {
      while (this.currentChar && /[0-9]/.test(this.currentChar)) {
        result += this.currentChar;
        this.advance();
      }
    } else {
      throw new Error('Invalid number format');
    }

    // 处理小数部分
    if (this.currentChar === '.') {
      result += this.currentChar;
      this.advance();
      
      if (!this.currentChar || !/[0-9]/.test(this.currentChar)) {
        throw new Error('Invalid number format: missing digits after decimal point');
      }
      
      while (this.currentChar && /[0-9]/.test(this.currentChar)) {
        result += this.currentChar;
        this.advance();
      }
    }

    // 处理指数部分
    if (this.currentChar === 'e' || this.currentChar === 'E') {
      result += this.currentChar;
      this.advance();
      
      if (this.currentChar === '+' || this.currentChar === '-') {
        result += this.currentChar;
        this.advance();
      }
      
      if (!this.currentChar || !/[0-9]/.test(this.currentChar)) {
        throw new Error('Invalid number format: missing digits in exponent');
      }
      
      while (this.currentChar && /[0-9]/.test(this.currentChar)) {
        result += this.currentChar;
        this.advance();
      }
    }

    return {
      type: TokenType.NUMBER,
      value: parseFloat(result)
    };
  }

  // 解析关键字 (true, false, null)
  parseKeyword() {
    let result = '';
    
    while (this.currentChar && /[a-z]/.test(this.currentChar)) {
      result += this.currentChar;
      this.advance();
    }

    switch (result) {
      case 'true':
        return { type: TokenType.BOOLEAN, value: true };
      case 'false':
        return { type: TokenType.BOOLEAN, value: false };
      case 'null':
        return { type: TokenType.NULL, value: null };
      default:
        throw new Error(`Invalid keyword: ${result}`);
    }
  }

  // 获取下一个token
  getNextToken() {
    while (this.currentChar) {
      if (/\s/.test(this.currentChar)) {
        this.skipWhitespace();
        continue;
      }

      switch (this.currentChar) {
        case '{':
          this.advance();
          return { type: TokenType.LEFT_BRACE };
        case '}':
          this.advance();
          return { type: TokenType.RIGHT_BRACE };
        case '[':
          this.advance();
          return { type: TokenType.LEFT_BRACKET };
        case ']':
          this.advance();
          return { type: TokenType.RIGHT_BRACKET };
        case ',':
          this.advance();
          return { type: TokenType.COMMA };
        case ':':
          this.advance();
          return { type: TokenType.COLON };
        case '"':
          return this.parseString();
        case '-':
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          return this.parseNumber();
        case 't':
        case 'f':
        case 'n':
          return this.parseKeyword();
        default:
          throw new Error(`Unexpected character: ${this.currentChar}`);
      }
    }

    return { type: TokenType.EOF };
  }
}

/**
 * 语法分析器 - 将tokens解析为JavaScript对象
 */
class Parser {
  constructor(lexer) {
    this.lexer = lexer;
    this.currentToken = this.lexer.getNextToken();
  }

  // 消费当前token并获取下一个
  eat(tokenType) {
    if (this.currentToken.type === tokenType) {
      this.currentToken = this.lexer.getNextToken();
    } else {
      throw new Error(`Expected ${tokenType}, got ${this.currentToken.type}`);
    }
  }

  // 解析JSON值
  parseValue() {
    switch (this.currentToken.type) {
      case TokenType.STRING:
      case TokenType.NUMBER:
      case TokenType.BOOLEAN:
      case TokenType.NULL:
        const value = this.currentToken.value;
        this.eat(this.currentToken.type);
        return value;
      case TokenType.LEFT_BRACE:
        return this.parseObject();
      case TokenType.LEFT_BRACKET:
        return this.parseArray();
      default:
        throw new Error(`Unexpected token: ${this.currentToken.type}`);
    }
  }

  // 解析对象
  parseObject() {
    const obj = {};
    this.eat(TokenType.LEFT_BRACE);

    // 处理空对象
    if (this.currentToken.type === TokenType.RIGHT_BRACE) {
      this.eat(TokenType.RIGHT_BRACE);
      return obj;
    }

    // 解析键值对
    while (true) {
      // 解析键
      if (this.currentToken.type !== TokenType.STRING) {
        throw new Error('Expected string key in object');
      }
      const key = this.currentToken.value;
      this.eat(TokenType.STRING);
      
      // 解析冒号
      this.eat(TokenType.COLON);
      
      // 解析值
      const value = this.parseValue();
      obj[key] = value;

      // 检查是否还有更多键值对
      if (this.currentToken.type === TokenType.COMMA) {
        this.eat(TokenType.COMMA);
        // 检查尾随逗号
        if (this.currentToken.type === TokenType.RIGHT_BRACE) {
          throw new Error('Trailing comma in object');
        }
      } else if (this.currentToken.type === TokenType.RIGHT_BRACE) {
        break;
      } else {
        throw new Error('Expected comma or closing brace in object');
      }
    }

    this.eat(TokenType.RIGHT_BRACE);
    return obj;
  }

  // 解析数组
  parseArray() {
    const arr = [];
    this.eat(TokenType.LEFT_BRACKET);

    // 处理空数组
    if (this.currentToken.type === TokenType.RIGHT_BRACKET) {
      this.eat(TokenType.RIGHT_BRACKET);
      return arr;
    }

    // 解析数组元素
    while (true) {
      const value = this.parseValue();
      arr.push(value);

      // 检查是否还有更多元素
      if (this.currentToken.type === TokenType.COMMA) {
        this.eat(TokenType.COMMA);
        // 检查尾随逗号
        if (this.currentToken.type === TokenType.RIGHT_BRACKET) {
          throw new Error('Trailing comma in array');
        }
      } else if (this.currentToken.type === TokenType.RIGHT_BRACKET) {
        break;
      } else {
        throw new Error('Expected comma or closing bracket in array');
      }
    }

    this.eat(TokenType.RIGHT_BRACKET);
    return arr;
  }

  // 解析JSON
  parse() {
    const result = this.parseValue();
    
    // 确保没有多余的内容
    if (this.currentToken.type !== TokenType.EOF) {
      throw new Error('Unexpected content after JSON value');
    }
    
    return result;
  }
}

/**
 * JSON解析器主函数
 * @param {string} jsonString - 要解析的JSON字符串
 * @returns {any} - 解析后的JavaScript对象
 */
function parseJSON(jsonString) {
  if (typeof jsonString !== 'string') {
    throw new Error('Input must be a string');
  }
  
  if (jsonString.trim() === '') {
    throw new Error('Empty JSON string');
  }

  try {
    const lexer = new Lexer(jsonString);
    const parser = new Parser(lexer);
    return parser.parse();
  } catch (error) {
    throw new Error(`JSON Parse Error: ${error.message}`);
  }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { parseJSON, Lexer, Parser, TokenType };
} else if (typeof window !== 'undefined') {
  window.parseJSON = parseJSON;
}

// 如果直接运行此文件，执行测试
if (typeof require !== 'undefined' && require.main === module) {
  console.log('JSON Parser Implementation');
  console.log('========================');
  
  // 简单测试
  const testCases = [
    '{}',
    '[]',
    '"hello"',
    '123',
    'true',
    'false',
    'null',
    '{"name": "John", "age": 30}',
    '[1, 2, 3, "hello", true, null]',
    '{"users": [{"name": "Alice", "active": true}, {"name": "Bob", "active": false}]}'
  ];
  
  testCases.forEach((testCase, index) => {
    try {
      const result = parseJSON(testCase);
      console.log(`Test ${index + 1}: ✓`);
      console.log(`Input: ${testCase}`);
      console.log(`Output:`, result);
      console.log('---');
    } catch (error) {
      console.log(`Test ${index + 1}: ✗`);
      console.log(`Input: ${testCase}`);
      console.log(`Error: ${error.message}`);
      console.log('---');
    }
  });
}