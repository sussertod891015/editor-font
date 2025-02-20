/**
 * 示例文件：用于展示不同字体的显示效果
 * Demo file: showcase different font displays
 */

// 计算数组元素的和
function calculateSum(numbers) {
  // 使用 reduce 方法进行累加计算
  return numbers.reduce((sum, current) => {
    return sum + current;
  }, 0);
}

// 创建测试数据并调用函数
const numbers = [1, 2, 3, 4, 5];
const result = calculateSum(numbers);

// 输出计算结果到控制台
console.log(`Sum of array: ${result}`);

// 字体显示测试：中文注释、英文代码、数字
console.log('The quick brown fox jumps over the lazy dog'); 