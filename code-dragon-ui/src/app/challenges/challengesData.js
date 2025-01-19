export const challengesData = [
  {
    id: "two-sum",
    title: "Two Sum",
    signature: "def two_sum(nums, target):",
    description: `Given an array of integers nums and an integer target, return indices of 
the two numbers that add up to target. You may not use the same element twice.`,
    tests: [
      {
        input: "([2, 7, 11, 15], 9)",
        expectedOutput: "0 1",
      },
      {
        input: "([3, 2, 4], 6)",
        expectedOutput: "1 2",
      },
    ],
  },
  {
    id: "reverse-string",
    title: "Reverse String",
    signature: "def reverse_string(s):",
    description: `Given a string s, return it reversed.`,
    tests: [
      {
        input: '("hello",)',
        expectedOutput: "olleh",
      },
      {
        input: '("CodeDragon",)',
        expectedOutput: "nogarDedoC",
      },
    ],
  },
  {
    id: "is-palindrome",
    title: "Is Palindrome",
    signature: "def is_palindrome(s):",
    description: `Check if a string s is a palindrome. Return True if it reads 
the same backward and forward, otherwise False.`,
    tests: [
      {
        input: '("racecar",)',
        expectedOutput: "True",
      },
      {
        input: '("hello",)',
        expectedOutput: "False",
      },
    ],
  },
  {
    id: "max-subarray-sum",
    title: "Max Subarray Sum",
    signature: "def max_subarray_sum(nums):",
    description: `Given an integer array nums, find the contiguous subarray 
which has the largest sum, and return the sum.`,
    tests: [
      {
        input: "([-2,1,-3,4,-1,2,1,-5,4],)",
        expectedOutput: "6", // subarray [4,-1,2,1]
      },
      {
        input: "([1,2,3,4],)",
        expectedOutput: "10",
      },
    ],
  },
  {
    id: "fizz-buzz",
    title: "Fizz Buzz",
    signature: "def fizz_buzz(n):",
    description: `Print the numbers from 1 to n. For multiples of 3, print 'Fizz'; 
for multiples of 5, print 'Buzz'; for multiples of both, print 'FizzBuzz'. 
Return all outputs as a single string, separated by spaces.`,
    tests: [
      {
        input: "(15,)",
        expectedOutput:
          "1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz",
      },
      {
        input: "(5,)",
        expectedOutput: "1 2 Fizz 4 Buzz",
      },
    ],
  },
  {
    id: "count-vowels",
    title: "Count Vowels",
    signature: "def count_vowels(s):",
    description: `Return the number of vowels (a, e, i, o, u) in the string s. 
Consider lowercase and uppercase letters as vowels.`,
    tests: [
      {
        input: '("Hello",)',
        expectedOutput: "2",
      },
      {
        input: '("CODE DRAGON",)',
        expectedOutput: "4",
      },
    ],
  },
  {
    id: "longest-word",
    title: "Longest Word",
    signature: "def longest_word(sentence):",
    description: `Given a sentence, return the longest word. If there are multiple 
words of the same length, return the first one encountered.`,
    tests: [
      {
        input: '("The quick brown fox jumped over the lazy dog",)',
        expectedOutput: "jumped",
      },
      {
        input: '("Code Dragon platform",)',
        expectedOutput: "Dragon",
      },
    ],
  },
  {
    id: "rotate-array",
    title: "Rotate Array",
    signature: "def rotate_array(nums, k):",
    description: `Rotate the array nums to the right by k steps, where k is non-negative. 
The array length is always at least 1. Return the modified array (or print it).`,
    tests: [
      {
        input: "([1,2,3,4,5,6,7], 3)",
        expectedOutput: "5 6 7 1 2 3 4",
      },
      {
        input: "([-1,-100,3,99], 2)",
        expectedOutput: "3 99 -1 -100",
      },
    ],
  },
];
