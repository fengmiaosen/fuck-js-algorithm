/**
 * JSON解析器测试文件
 * 测试各种JSON格式和边界情况
 */

const { parseJSON } = require('./json-parser.js');

// 测试结果统计
let totalTests = 0;
let passedTests = 0;

// 测试辅助函数
function test(description, testFn) {
  totalTests++;
  try {
    testFn();
    console.log(`✓ ${description}`);
    passedTests++;
  } catch (error) {
    console.log(`✗ ${description}`);
    console.log(`  Error: ${error.message}`);
  }
}

// 深度比较函数
function deepEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;
  
  if (typeof a === 'object') {
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    
    if (keysA.length !== keysB.length) return false;
    
    for (let key of keysA) {
      if (!keysB.includes(key)) return false;
      if (!deepEqual(a[key], b[key])) return false;
    }
    
    return true;
  }
  
  return false;
}

// 断言函数
function assertEqual(actual, expected, message = '') {
  if (!deepEqual(actual, expected)) {
    throw new Error(`${message}\nExpected: ${JSON.stringify(expected)}\nActual: ${JSON.stringify(actual)}`);
  }
}

function assertThrows(fn, expectedError = '') {
  try {
    fn();
    throw new Error('Expected function to throw an error');
  } catch (error) {
    if (expectedError && !error.message.includes(expectedError)) {
      throw new Error(`Expected error containing "${expectedError}", got "${error.message}"`);
    }
  }
}

console.log('JSON Parser Tests');
console.log('=================\n');

// 基本数据类型测试
console.log('1. 基本数据类型测试');
console.log('-------------------');

test('解析字符串', () => {
  assertEqual(parseJSON('"hello"'), 'hello');
  assertEqual(parseJSON('""'), '');
  assertEqual(parseJSON('"Hello, World!"'), 'Hello, World!');
});

test('解析数字', () => {
  assertEqual(parseJSON('123'), 123);
  assertEqual(parseJSON('0'), 0);
  assertEqual(parseJSON('-123'), -123);
  assertEqual(parseJSON('123.45'), 123.45);
  assertEqual(parseJSON('-123.45'), -123.45);
  assertEqual(parseJSON('1.23e10'), 1.23e10);
  assertEqual(parseJSON('1.23E-10'), 1.23E-10);
});

test('解析布尔值', () => {
  assertEqual(parseJSON('true'), true);
  assertEqual(parseJSON('false'), false);
});

test('解析null', () => {
  assertEqual(parseJSON('null'), null);
});

// 数组测试
console.log('\n2. 数组测试');
console.log('------------');

test('解析空数组', () => {
  assertEqual(parseJSON('[]'), []);
});

test('解析简单数组', () => {
  assertEqual(parseJSON('[1, 2, 3]'), [1, 2, 3]);
  assertEqual(parseJSON('["a", "b", "c"]'), ['a', 'b', 'c']);
});

test('解析混合类型数组', () => {
  assertEqual(parseJSON('[1, "hello", true, null, false]'), [1, 'hello', true, null, false]);
});

test('解析嵌套数组', () => {
  assertEqual(parseJSON('[[1, 2], [3, 4]]'), [[1, 2], [3, 4]]);
  assertEqual(parseJSON('[1, [2, [3, 4]], 5]'), [1, [2, [3, 4]], 5]);
});

// 对象测试
console.log('\n3. 对象测试');
console.log('------------');

test('解析空对象', () => {
  assertEqual(parseJSON('{}'), {});
});

test('解析简单对象', () => {
  assertEqual(parseJSON('{"name": "John"}'), { name: 'John' });
  assertEqual(parseJSON('{"age": 30}'), { age: 30 });
});

test('解析多属性对象', () => {
  assertEqual(parseJSON('{"name": "John", "age": 30, "active": true}'), {
    name: 'John',
    age: 30,
    active: true
  });
});

test('解析嵌套对象', () => {
  assertEqual(parseJSON('{"user": {"name": "John", "profile": {"age": 30}}}'), {
    user: {
      name: 'John',
      profile: {
        age: 30
      }
    }
  });
});

// 复杂结构测试
console.log('\n4. 复杂结构测试');
console.log('----------------');

test('解析对象数组', () => {
  const input = '[{"name": "Alice", "age": 25}, {"name": "Bob", "age": 30}]';
  const expected = [
    { name: 'Alice', age: 25 },
    { name: 'Bob', age: 30 }
  ];
  assertEqual(parseJSON(input), expected);
});

test('解析包含数组的对象', () => {
  const input = '{"users": ["Alice", "Bob"], "count": 2}';
  const expected = {
    users: ['Alice', 'Bob'],
    count: 2
  };
  assertEqual(parseJSON(input), expected);
});

test('解析复杂嵌套结构', () => {
  const input = `{
    "company": "TechCorp",
    "employees": [
      {
        "name": "Alice",
        "department": "Engineering",
        "skills": ["JavaScript", "Python"],
        "active": true
      },
      {
        "name": "Bob",
        "department": "Design",
        "skills": ["Photoshop", "Figma"],
        "active": false
      }
    ],
    "founded": 2020,
    "public": null
  }`;
  
  const expected = {
    company: 'TechCorp',
    employees: [
      {
        name: 'Alice',
        department: 'Engineering',
        skills: ['JavaScript', 'Python'],
        active: true
      },
      {
        name: 'Bob',
        department: 'Design',
        skills: ['Photoshop', 'Figma'],
        active: false
      }
    ],
    founded: 2020,
    public: null
  };
  
  assertEqual(parseJSON(input), expected);
});

// 字符串转义测试
console.log('\n5. 字符串转义测试');
console.log('------------------');

test('解析转义字符', () => {
  assertEqual(parseJSON('"Hello\\nWorld"'), 'Hello\nWorld');
  assertEqual(parseJSON('"Quote: \\"Hello\\""'), 'Quote: "Hello"');
  assertEqual(parseJSON('"Tab:\\tSpace"'), 'Tab:\tSpace');
  assertEqual(parseJSON('"Backslash: \\\\"'), 'Backslash: \\');
});

test('解析Unicode转义', () => {
  assertEqual(parseJSON('"\\u0048\\u0065\\u006C\\u006C\\u006F"'), 'Hello');
  assertEqual(parseJSON('"\\u4E2D\\u6587"'), '中文');
});

// 空白字符处理测试
console.log('\n6. 空白字符处理测试');
console.log('--------------------');

test('处理空白字符', () => {
  assertEqual(parseJSON('  {  "name"  :  "John"  }  '), { name: 'John' });
  assertEqual(parseJSON('\n[\n  1,\n  2,\n  3\n]\n'), [1, 2, 3]);
  assertEqual(parseJSON('\t{\t"key"\t:\t"value"\t}\t'), { key: 'value' });
});

// 错误处理测试
console.log('\n7. 错误处理测试');
console.log('----------------');

test('检测语法错误', () => {
  assertThrows(() => parseJSON('{"name": }'), 'Unexpected token');
  assertThrows(() => parseJSON('[1, 2, ]'), 'Trailing comma');
  assertThrows(() => parseJSON('{"name": "John",}'), 'Trailing comma');
  assertThrows(() => parseJSON('{name: "John"}'), 'Invalid keyword');
});

test('检测未闭合的结构', () => {
  assertThrows(() => parseJSON('[1, 2, 3'), 'Expected comma or closing bracket');
  assertThrows(() => parseJSON('{"name": "John"'), 'Expected comma or closing brace');
  assertThrows(() => parseJSON('"unclosed string'), 'Unterminated string');
});

test('检测无效的数字格式', () => {
  assertThrows(() => parseJSON('01'), 'Invalid number format');
  assertThrows(() => parseJSON('1.'), 'Invalid number format');
  assertThrows(() => parseJSON('1e'), 'Invalid number format');
});

test('检测无效的关键字', () => {
  assertThrows(() => parseJSON('True'), 'Unexpected character');
  assertThrows(() => parseJSON('FALSE'), 'Unexpected character');
  assertThrows(() => parseJSON('NULL'), 'Unexpected character');
  assertThrows(() => parseJSON('undefined'), 'Unexpected character');
});

test('检测空输入', () => {
  assertThrows(() => parseJSON(''), 'Empty JSON string');
  assertThrows(() => parseJSON('   '), 'Empty JSON string');
});

test('检测非字符串输入', () => {
  assertThrows(() => parseJSON(123), 'Input must be a string');
  assertThrows(() => parseJSON(null), 'Input must be a string');
  assertThrows(() => parseJSON(undefined), 'Input must be a string');
});

test('检测多余内容', () => {
  assertThrows(() => parseJSON('123 456'), 'Unexpected content after JSON value');
  assertThrows(() => parseJSON('{"a": 1} {"b": 2}'), 'Unexpected content after JSON value');
});

// 与原生JSON.parse对比测试
console.log('\n8. 与原生JSON.parse对比测试');
console.log('-----------------------------');

const comparisonTests = [
  '{}',
  '[]',
  '"hello"',
  '123',
  'true',
  'false',
  'null',
  '{"name": "John", "age": 30}',
  '[1, 2, 3, "hello", true, null]',
  '{"users": [{"name": "Alice"}, {"name": "Bob"}]}',
  '[{"a": 1}, {"b": [2, 3]}]'
];

comparisonTests.forEach((testCase, index) => {
  test(`对比测试 ${index + 1}: ${testCase}`, () => {
    const ourResult = parseJSON(testCase);
    const nativeResult = JSON.parse(testCase);
    assertEqual(ourResult, nativeResult, `Results should match for: ${testCase}`);
  });
});

// 性能测试
console.log('\n9. 性能测试');
console.log('------------');

test('大型JSON解析性能', () => {
  // 生成大型JSON字符串
  const largeArray = Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    name: `User ${i}`,
    active: i % 2 === 0,
    score: Math.random() * 100
  }));
  
  const largeJSON = JSON.stringify(largeArray);
  
  const startTime = Date.now();
  const result = parseJSON(largeJSON);
  const endTime = Date.now();
  
  console.log(`  解析 ${largeJSON.length} 字符的JSON用时: ${endTime - startTime}ms`);
  
  // 验证结果正确性
  assertEqual(result.length, 1000);
  assertEqual(result[0].id, 0);
  assertEqual(result[999].id, 999);
});

// 测试总结
console.log('\n测试总结');
console.log('========');
console.log(`总测试数: ${totalTests}`);
console.log(`通过测试: ${passedTests}`);
console.log(`失败测试: ${totalTests - passedTests}`);
console.log(`成功率: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

if (passedTests === totalTests) {
  console.log('\n🎉 所有测试通过！JSON解析器实现正确。');
} else {
  console.log('\n❌ 部分测试失败，请检查实现。');
  process.exit(1);
}