/**
 * JSON解析器使用示例
 * 演示如何使用自定义JSON解析器
 */

const { parseJSON } = require('./json-parser.js');

console.log('JSON解析器使用示例');
console.log('==================\n');

// 示例1: 解析基本数据类型
console.log('1. 基本数据类型解析');
console.log('-------------------');

const examples = [
  { name: '字符串', json: '"Hello, World!"' },
  { name: '数字', json: '42' },
  { name: '浮点数', json: '3.14159' },
  { name: '科学计数法', json: '1.23e-4' },
  { name: '布尔值(true)', json: 'true' },
  { name: '布尔值(false)', json: 'false' },
  { name: 'null值', json: 'null' }
];

examples.forEach(example => {
  try {
    const result = parseJSON(example.json);
    console.log(`${example.name}: ${example.json} → ${JSON.stringify(result)} (${typeof result})`);
  } catch (error) {
    console.log(`${example.name}: ${example.json} → 错误: ${error.message}`);
  }
});

// 示例2: 解析数组
console.log('\n2. 数组解析');
console.log('------------');

const arrayExamples = [
  '[]',
  '[1, 2, 3]',
  '["apple", "banana", "cherry"]',
  '[true, false, null]',
  '[1, "hello", true, null, [1, 2]]',
  '[[1, 2], [3, 4], [5, 6]]'
];

arrayExamples.forEach((json, index) => {
  try {
    const result = parseJSON(json);
    console.log(`数组${index + 1}: ${json}`);
    console.log(`结果: ${JSON.stringify(result)}`);
    console.log(`长度: ${result.length}`);
    console.log('---');
  } catch (error) {
    console.log(`数组${index + 1}: ${json} → 错误: ${error.message}`);
  }
});

// 示例3: 解析对象
console.log('\n3. 对象解析');
console.log('------------');

const objectExamples = [
  '{}',
  '{"name": "张三"}',
  '{"name": "李四", "age": 25, "active": true}',
  '{"user": {"name": "王五", "profile": {"email": "wang@example.com"}}}'
];

objectExamples.forEach((json, index) => {
  try {
    const result = parseJSON(json);
    console.log(`对象${index + 1}: ${json}`);
    console.log(`结果: ${JSON.stringify(result, null, 2)}`);
    console.log(`键数量: ${Object.keys(result).length}`);
    console.log('---');
  } catch (error) {
    console.log(`对象${index + 1}: ${json} → 错误: ${error.message}`);
  }
});

// 示例4: 复杂嵌套结构
console.log('\n4. 复杂嵌套结构');
console.log('----------------');

const complexJSON = `{
  "company": "科技公司",
  "employees": [
    {
      "id": 1,
      "name": "张三",
      "department": "工程部",
      "skills": ["JavaScript", "Python", "Go"],
      "contact": {
        "email": "zhang@company.com",
        "phone": "13800138000"
      },
      "active": true,
      "salary": 15000.50
    },
    {
      "id": 2,
      "name": "李四",
      "department": "设计部",
      "skills": ["Photoshop", "Figma", "Sketch"],
      "contact": {
        "email": "li@company.com",
        "phone": "13900139000"
      },
      "active": false,
      "salary": 12000.00
    }
  ],
  "founded": 2020,
  "locations": ["北京", "上海", "深圳"],
  "public": null,
  "metadata": {
    "version": "1.0.0",
    "lastUpdated": "2024-01-15T10:30:00Z"
  }
}`;

try {
  console.log('原始JSON:');
  console.log(complexJSON);
  console.log('\n解析结果:');
  
  const result = parseJSON(complexJSON);
  console.log(JSON.stringify(result, null, 2));
  
  console.log('\n数据访问示例:');
  console.log(`公司名称: ${result.company}`);
  console.log(`员工数量: ${result.employees.length}`);
  console.log(`第一个员工: ${result.employees[0].name}`);
  console.log(`第一个员工技能: ${result.employees[0].skills.join(', ')}`);
  console.log(`办公地点: ${result.locations.join(', ')}`);
  
} catch (error) {
  console.log(`复杂结构解析错误: ${error.message}`);
}

// 示例5: 字符串转义处理
console.log('\n5. 字符串转义处理');
console.log('------------------');

const escapeExamples = [
  '"普通字符串"',
  '"包含\\"引号\\"的字符串"',
  '"换行符\\n和制表符\\t"',
  '"反斜杠\\\\字符"',
  '"Unicode字符\\u4E2D\\u6587"',
  '"路径C:\\\\Users\\\\Documents"'
];

escapeExamples.forEach((json, index) => {
  try {
    const result = parseJSON(json);
    console.log(`转义${index + 1}: ${json}`);
    console.log(`结果: "${result}"`);
    console.log('---');
  } catch (error) {
    console.log(`转义${index + 1}: ${json} → 错误: ${error.message}`);
  }
});

// 示例6: 错误处理演示
console.log('\n6. 错误处理演示');
console.log('----------------');

const errorExamples = [
  { name: '语法错误', json: '{"name": }' },
  { name: '未闭合数组', json: '[1, 2, 3' },
  { name: '未闭合对象', json: '{"name": "test"' },
  { name: '尾随逗号', json: '[1, 2, 3,]' },
  { name: '无效数字', json: '01' },
  { name: '无效关键字', json: 'undefined' },
  { name: '未闭合字符串', json: '"unclosed' },
  { name: '多余内容', json: '123 456' }
];

errorExamples.forEach(example => {
  try {
    const result = parseJSON(example.json);
    console.log(`${example.name}: ${example.json} → 意外成功: ${JSON.stringify(result)}`);
  } catch (error) {
    console.log(`${example.name}: ${example.json} → 错误: ${error.message}`);
  }
});

// 示例7: 性能对比
console.log('\n7. 性能对比');
console.log('------------');

const performanceTestJSON = JSON.stringify({
  data: Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    name: `用户${i}`,
    email: `user${i}@example.com`,
    active: i % 2 === 0,
    score: Math.random() * 100,
    tags: [`tag${i}`, `category${i % 10}`]
  }))
});

console.log(`测试数据大小: ${performanceTestJSON.length} 字符`);

// 测试我们的解析器
const startTime1 = Date.now();
try {
  const result1 = parseJSON(performanceTestJSON);
  const endTime1 = Date.now();
  console.log(`自定义解析器: ${endTime1 - startTime1}ms (解析了${result1.data.length}条记录)`);
} catch (error) {
  console.log(`自定义解析器错误: ${error.message}`);
}

// 测试原生解析器
const startTime2 = Date.now();
try {
  const result2 = JSON.parse(performanceTestJSON);
  const endTime2 = Date.now();
  console.log(`原生解析器: ${endTime2 - startTime2}ms (解析了${result2.data.length}条记录)`);
} catch (error) {
  console.log(`原生解析器错误: ${error.message}`);
}

console.log('\n🎉 JSON解析器示例演示完成！');
console.log('\n特性总结:');
console.log('- ✅ 支持所有标准JSON数据类型');
console.log('- ✅ 完整的字符串转义处理');
console.log('- ✅ 严格的语法验证');
console.log('- ✅ 详细的错误信息');
console.log('- ✅ 良好的性能表现');
console.log('- ✅ 与原生JSON.parse兼容的API');