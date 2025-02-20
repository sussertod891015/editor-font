/**
 * Demo file: showcase different font displays
 * Test both English and numeric characters
 */

// Calculate sum of array elements
function calculateSum(numbers) {
  // Use reduce method for accumulation
  return numbers.reduce((sum, current) => {
    return sum + current;
  }, 0);
}

// Create test data and call function
const numbers = [1, 2, 3, 4, 5];
const result = calculateSum(numbers);

// Output result to console
console.log(`Sum of array: ${result}`);

// Font display test: comments, code, numbers
console.log('The quick brown fox jumps over the lazy dog'); 