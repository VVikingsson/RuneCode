// --- 1. Model & Library Imports ---
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Required for password hashing
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Import models from the specified path
// NOTE: Assuming your models are updated to handle the new ChallengeSchema fields
const { Challenge, TestCase, User, Submission } = require('../models'); 


// --- 2. Seed Data Definition (Refined and Simplified Challenges) ---

const LANGUAGE = 'python'; // Kept for submission logic context, but not for templates

// CONSTANTS FOR POINTS & HASHING
const SALT_ROUNDS = 10;
const HASHED_PASSWORD = bcrypt.hashSync("seededUser", SALT_ROUNDS); // Password: "seededUser"

// Point values based on difficulty
const POINTS = {
    Skirmish: 50, // Easy
    Pillage: 100,  // Medium
    Raid: 200     // Hard
};

const DIFFICULTY_MAP = {
    Skirmish: 'easy',
    Pillage: 'medium',
    Raid: 'hard'
};

const challengesData = [
    // 01-15 (Standard challenges, descriptions and names updated)
    {
        name: "01. Find Minimum Value",
        codeTemplatePython: "def min_val(numbers):\n\t# numbers is a comma-separated string",
        codeTemplateJavascript: "const minVal = (numbers) => {\n\t// numbers is a comma-separated string\n};",
        description: "Given a comma-separated string of numbers, return the smallest number as a string. For example, if the input is '10, 5, 20, -1', the expected output is '-1'.",
        difficulty: "Skirmish",
        tags: ["strings", "parsing", "math"],
        testCases: [
            { input: `min_val('1,2,3,4')`, expectedOutput: "1", language: LANGUAGE },
            { input: `min_val('1,2,3,4,-7')`, expectedOutput: "-7", language: LANGUAGE },
            { input: `min_val('200,400,201')`, expectedOutput: "200", language: LANGUAGE },
            { input: `minVal('1,2,3,4')`, expectedOutput: "1", language: "javascript" },
            { input: `minVal('1,2,3,4,-7')`, expectedOutput: "-7", language: "javascript" },
            { input: `minVal('200,400,201')`, expectedOutput: "200", language: "javascript" },
        ],
        // Mock passing code for submissions
        passingCode: `def min_val(numbers):\n\treturn str(min(map(int, numbers.split(','))))`
    },
    {
        name: "02. Reverse A String",
        codeTemplatePython: "def reverse_str(s):",
        codeTemplateJavascript: "const reverseStr = (s) => {};",
        description: "Implement a function that reverses a given string. For example, 'hello' becomes 'olleh'.",
        difficulty: "Skirmish",
        tags: ["strings"],
        testCases: [
            { input: `reverse_str('hello')`, expectedOutput: "olleh", language: LANGUAGE },
            { input: `reverse_str('world')`, expectedOutput: "dlrow", language: LANGUAGE },
            { input: `reverse_str('a')`, expectedOutput: "a", language: LANGUAGE },
            { input: `reverseStr('hello')`, expectedOutput: "olleh", language: "javascript" },
            { input: `reverseStr('world')`, expectedOutput: "dlrow", language: "javascript" },
            { input: `reverseStr('a')`, expectedOutput: "a", language: "javascript" },
        ],
        passingCode: `def reverse_str(s):\n\treturn s[::-1]`
    },
    {
        name: "03. Check Palindrome",
        codeTemplatePython: "def is_palindrome(word):",
        codeTemplateJavascript: "const isPalindrome = (word) => {};",
        description: "Return True if the word is a palindrome (reads the same forwards and backwards), False otherwise. The comparison should be case-insensitive. E.g., 'Racecar' returns True.",
        difficulty: "Skirmish",
        tags: ["strings", "logic"],
        testCases: [
            { input: `is_palindrome('madam')`, expectedOutput: "True", language: LANGUAGE },
            { input: `is_palindrome('apple')`, expectedOutput: "False", language: LANGUAGE },
            { input: `is_palindrome('racecar')`, expectedOutput: "True", language: LANGUAGE },
            { input: `isPalindrome('madam')`, expectedOutput: "true", language: "javascript" },
            { input: `isPalindrome('apple')`, expectedOutput: "false", language: "javascript" },
            { input: `isPalindrome('racecar')`, expectedOutput: "true", language: "javascript" },
        ],
        passingCode: `def is_palindrome(word):\n\tcleaned = word.lower()\n\treturn cleaned == cleaned[::-1]`
    },
    {
        name: "04. Calculate Factorial",
        codeTemplatePython: "def factorial(n):",
        codeTemplateJavascript: "const factorial = (n) => {};",
        description: "Calculate the factorial of a non-negative integer n. (n!). The factorial of 5 (5!) is 120. Input is an integer.",
        difficulty: "Pillage",
        tags: ["math", "recursion"],
        testCases: [
            { input: `factorial(5)`, expectedOutput: "120", language: LANGUAGE },
            { input: `factorial(0)`, expectedOutput: "1", language: LANGUAGE },
            { input: `factorial(1)`, expectedOutput: "1", language: LANGUAGE },
            { input: `factorial(5)`, expectedOutput: "120", language: "javascript" },
            { input: `factorial(0)`, expectedOutput: "1", language: "javascript" },
            { input: `factorial(1)`, expectedOutput: "1", language: "javascript" },
        ],
        passingCode: `def factorial(n):\n\tif n == 0:\n\t\treturn 1\n\telse:\n\t\treturn n * factorial(n-1)`
    },
    {
        name: "05. Sum Array",
        codeTemplatePython: "def array_sum(arr):",
        codeTemplateJavascript: "const arraySum = (arr) => {};",
        description: "Calculate and return the sum of all integers in a list/array. If the input array is [10, -5, 5], the expected output is 10.",
        difficulty: "Skirmish",
        tags: ["arrays", "math"],
        testCases: [
            { input: `array_sum([1, 2, 3])`, expectedOutput: "6", language: LANGUAGE },
            { input: `array_sum([10, -5, 5])`, expectedOutput: "10", language: LANGUAGE },
            { input: `array_sum([])`, expectedOutput: "0", language: LANGUAGE },
            { input: `arraySum([1, 2, 3])`, expectedOutput: "6", language: "javascript" },
            { input: `arraySum([10, -5, 5])`, expectedOutput: "10", language: "javascript" },
            { input: `arraySum([])`, expectedOutput: "0", language: "javascript" },
        ],
        passingCode: `def array_sum(arr):\n\treturn sum(arr)`
    },
    {
        name: "06. Find Maximum In Array",
        codeTemplatePython: "def find_max(arr):",
        codeTemplateJavascript: "const findMax = (arr) => {};",
        description: "Find and return the largest number in an array of integers. Given the array [1, 5, 2, 9], the function should return 9.",
        difficulty: "Skirmish",
        tags: ["arrays", "math"],
        testCases: [
            { input: `find_max([1, 5, 2, 9])`, expectedOutput: "9", language: LANGUAGE },
            { input: `find_max([-10, -5, -1])`, expectedOutput: "-1", language: LANGUAGE },
            { input: `findMax([1, 5, 2, 9])`, expectedOutput: "9", language: "javascript" },
            { input: `findMax([-10, -5, -1])`, expectedOutput: "-1", language: "javascript" },
        ],
        passingCode: `def find_max(arr):\n\treturn max(arr)`
    },
    {
        name: "07. Fibonacci N-th Term",
        codeTemplatePython: "def fibonacci(n):",
        codeTemplateJavascript: "const fibonacci = (n) => {};",
        description: "Return the n-th term of the Fibonacci sequence (0-indexed: F0=0, F1=1, F2=1, ...). For example, `fibonacci(5)` should return 5.",
        difficulty: "Pillage",
        tags: ["recursion", "math", "algorithms"],
        testCases: [
            { input: `fibonacci(0)`, expectedOutput: "0", language: LANGUAGE },
            { input: `fibonacci(5)`, expectedOutput: "5", language: LANGUAGE },
            { input: `fibonacci(10)`, expectedOutput: "55", language: LANGUAGE },
            { input: `fibonacci(0)`, expectedOutput: "0", language: "javascript" },
            { input: `fibonacci(5)`, expectedOutput: "5", language: "javascript" },
            { input: `fibonacci(10)`, expectedOutput: "55", language: "javascript" },
        ],
        passingCode: `def fibonacci(n):\n\ta, b = 0, 1\n\tfor _ in range(n):\n\t\ta, b = b, a + b\n\treturn a`
    },
    {
        name: "08. Count Vowels",
        codeTemplatePython: "def count_vowels(text):",
        codeTemplateJavascript: "const countVowels = (text) => {};",
        description: "Count the total number of vowels (a, e, i, o, u) in a given string. The counting should be case-insensitive. For input 'Hello World', the output is 3.",
        difficulty: "Skirmish",
        tags: ["strings", "counting"],
        testCases: [
            { input: `count_vowels('hello world')`, expectedOutput: "3", language: LANGUAGE },
            { input: `count_vowels('AEIOU')`, expectedOutput: "5", language: LANGUAGE },
            { input: `count_vowels('rhythm')`, expectedOutput: "0", language: LANGUAGE },
            { input: `countVowels('hello world')`, expectedOutput: "3", language: "javascript" },
            { input: `countVowels('AEIOU')`, expectedOutput: "5", language: "javascript" },
            { input: `countVowels('rhythm')`, expectedOutput: "0", language: "javascript" },
        ],
        passingCode: `def count_vowels(text):\n\tvowels = 'aeiou'\n\tcount = 0\n\tfor char in text.lower():\n\t\tif char in vowels:\n\t\t\tcount += 1\n\treturn count`
    },
    {
        name: "09. Title Case A Sentence",
        codeTemplatePython: "def title_case(sentence):",
        codeTemplateJavascript: "const titleCase = (sentence) => {};",
        description: "Convert the first letter of every word in a sentence to uppercase, and the rest to lowercase. Input: 'a short example'. Output: 'A Short Example'.",
        difficulty: "Pillage",
        tags: ["strings", "formatting"],
        testCases: [
            { input: `title_case('hello world')`, expectedOutput: "Hello World", language: LANGUAGE },
            { input: `title_case('a short example')`, expectedOutput: "A Short Example", language: LANGUAGE },
            { input: `titleCase('hello world')`, expectedOutput: "Hello World", language: "javascript" },
            { input: `titleCase('a short example')`, expectedOutput: "A Short Example", language: "javascript" },
        ],
        passingCode: `def title_case(sentence):\n\treturn sentence.title()`
    },
    {
        name: "10. Check Anagram",
        codeTemplatePython: "def are_anagrams(str1, str2):",
        codeTemplateJavascript: "const areAnagrams = (str1, str2) => {};",
        description: "Return True if two strings are anagrams of each other (contain the same characters with the same frequency), False otherwise. Ignore case and non-alphanumeric characters. E.g., 'rail safety' and 'fairy tales' returns True.",
        difficulty: "Pillage",
        tags: ["strings", "algorithms"],
        testCases: [
            { input: `are_anagrams('listen', 'silent')`, expectedOutput: "True", language: LANGUAGE },
            { input: `are_anagrams('hello', 'world')`, expectedOutput: "False", language: LANGUAGE },
            { input: `are_anagrams('rail safety', 'fairy tales')`, expectedOutput: "True", language: LANGUAGE },
            { input: `areAnagrams('listen', 'silent')`, expectedOutput: "true", language: "javascript" },
            { input: `areAnagrams('hello', 'world')`, expectedOutput: "false", language: "javascript" },
            { input: `areAnagrams('rail safety', 'fairy tales')`, expectedOutput: "true", language: "javascript" },
        ],
        passingCode: `import re\ndef are_anagrams(str1, str2):\n\tclean1 = sorted(re.sub('[^a-z]', '', str1.lower()))\n\tclean2 = sorted(re.sub('[^a-z]', '', str2.lower()))\n\treturn clean1 == clean2`
    },
    {
        name: "11. Binary Search",
        codeTemplatePython: "def binary_search(arr, target):",
        codeTemplateJavascript: "const binarySearch = (arr, target) => {};",
        description: "Implement binary search to find the index of a target value in a **sorted** array. Return -1 if the target is not found. For the array [2, 5, 8, 12, 16] and target 12, the output is 3.",
        difficulty: "Raid",
        tags: ["algorithms", "arrays", "search"],
        testCases: [
            { input: `binary_search([2, 5, 8, 12, 16], 12)`, expectedOutput: "3", language: LANGUAGE },
            { input: `binary_search([2, 5, 8, 12, 16], 9)`, expectedOutput: "-1", language: LANGUAGE },
            { input: `binary_search([], 5)`, expectedOutput: "-1", language: LANGUAGE },
            { input: `binarySearch([2, 5, 8, 12, 16], 12)`, expectedOutput: "3", language: "javascript" },
            { input: `binarySearch([2, 5, 8, 12, 16], 9)`, expectedOutput: "-1", language: "javascript" },
            { input: `binarySearch([], 5)`, expectedOutput: "-1", language: "javascript" },
        ],
        passingCode: `def binary_search(arr, target):\n\tleft, right = 0, len(arr) - 1\n\twhile left <= right:\n\t\tmid = (left + right) // 2\n\t\tif arr[mid] == target:\n\t\t\treturn mid\n\t\telif arr[mid] < target:\n\t\t\tleft = mid + 1\n\t\telse:\n\t\t\tright = mid - 1\n\treturn -1`
    },
    {
        name: "12. Merge Sorted Arrays",
        codeTemplatePython: "def merge_arrays(arr1, arr2):",
        codeTemplateJavascript: "const mergeArrays = (arr1, arr2) => {};",
        description: "Merge two sorted arrays, `arr1` and `arr2`, into a single sorted array. E.g., merging [1, 3, 5] and [2, 4, 6] results in [1, 2, 3, 4, 5, 6].",
        difficulty: "Pillage",
        tags: ["arrays", "algorithms"],
        testCases: [
            { input: `merge_arrays([1, 3, 5], [2, 4, 6])`, expectedOutput: "[1, 2, 3, 4, 5, 6]", language: LANGUAGE },
            { input: `merge_arrays([10, 20], [1, 2])`, expectedOutput: "[1, 2, 10, 20]", language: LANGUAGE },
            { input: `mergeArrays([1, 3, 5], [2, 4, 6])`, expectedOutput: "[1, 2, 3, 4, 5, 6]", language: "javascript" },
            { input: `mergeArrays([10, 20], [1, 2])`, expectedOutput: "[1, 2, 10, 20]", language: "javascript" },
        ],
        passingCode: `def merge_arrays(arr1, arr2):\n\treturn sorted(arr1 + arr2)`
    },
    {
        name: "13. Find Missing Number",
        codeTemplatePython: "def find_missing(arr):",
        codeTemplateJavascript: "const findMissing = (arr) => {};",
        description: "Given an array containing n distinct numbers taken from 0, 1, 2, ..., n, find the single missing number. If the input is [3, 0, 1], the missing number is 2.",
        difficulty: "Pillage",
        tags: ["arrays", "math"],
        testCases: [
            { input: `find_missing([3, 0, 1])`, expectedOutput: "2", language: LANGUAGE },
            { input: `find_missing([9, 6, 4, 2, 3, 5, 7, 0, 1])`, expectedOutput: "8", language: LANGUAGE },
            { input: `find_missing([0])`, expectedOutput: "1", language: LANGUAGE },
            { input: `findMissing([3, 0, 1])`, expectedOutput: "2", language: "javascript" },
            { input: `findMissing([9, 6, 4, 2, 3, 5, 7, 0, 1])`, expectedOutput: "8", language: "javascript" },
            { input: `findMissing([0])`, expectedOutput: "1", language: "javascript" },
        ],
        passingCode: `def find_missing(arr):\n\tn = len(arr)\n\texpected_sum = n * (n + 1) // 2\n\tactual_sum = sum(arr)\n\treturn expected_sum - actual_sum`
    },
    {
        name: "14. Valid Parentheses", // Swapped with Queue with Stacks
        codeTemplatePython: "def is_valid(s):",
        codeTemplateJavascript: "const isValid = (s) => {};",
        description: "Given a string `s` containing just '(', ')', '{', '}', '[' and ']', determine if the input string is valid. A string is valid if open brackets must be closed by the same type of brackets, and open brackets must be closed in the correct order. E.g., '()[]{}' is True, but '([)]' is False.",
        difficulty: "Raid",
        tags: ["strings", "stacks", "data-structures"],
        testCases: [
            { input: `is_valid('()[]{}')`, expectedOutput: "True", language: LANGUAGE },
            { input: `is_valid('([)]')`, expectedOutput: "False", language: LANGUAGE },
            { input: `is_valid('{[]}')`, expectedOutput: "True", language: LANGUAGE },
            { input: `isValid('()[]{}')`, expectedOutput: "true", language: "javascript" },
            { input: `isValid('([)]')`, expectedOutput: "false", language: "javascript" },
            { input: `isValid('{[]}')`, expectedOutput: "true", language: "javascript" },
        ],
        passingCode: `def is_valid(s):\n\tstack = []\n\tmapping = {')': '(', ']': '[', '}': '{'}\n\tfor char in s:\n\t\tif char in mapping:\n\t\t\ttop_element = stack.pop() if stack else '#'\n\t\t\tif mapping[char] != top_element:\n\t\t\t\treturn False\n\t\telse:\n\t\t\tstack.append(char)\n\treturn not stack`
    },
    {
        name: "15. Two Sum",
        codeTemplatePython: "def two_sum(nums, target):",
        codeTemplateJavascript: "const twoSum = (nums, target) => {};",
        description: "Given an array of integers `nums` and an integer `target`, return the **indices** of the two numbers such that they add up to `target`. Assume exactly one solution exists. If `nums` is [2, 7, 11, 15] and `target` is 9, the output is [0, 1].",
        difficulty: "Pillage",
        tags: ["arrays", "algorithms", "hashing"],
        testCases: [
            { input: `two_sum([2, 7, 11, 15], 9)`, expectedOutput: "[0, 1]", language: LANGUAGE },
            { input: `two_sum([3, 2, 4], 6)`, expectedOutput: "[1, 2]", language: LANGUAGE },
            { input: `two_sum([3, 3], 6)`, expectedOutput: "[0, 1]", language: LANGUAGE },
            { input: `twoSum([2, 7, 11, 15], 9)`, expectedOutput: "[0, 1]", language: "javascript" },
            { input: `twoSum([3, 2, 4], 6)`, expectedOutput: "[1, 2]", language: "javascript" },
            { input: `twoSum([3, 3], 6)`, expectedOutput: "[0, 1]", language: "javascript" },
        ],
        passingCode: `def two_sum(nums, target):\n\thash_map = {}\n\tfor i, num in enumerate(nums):\n\t\tcomplement = target - num\n\t\tif complement in hash_map:\n\t\t\treturn [hash_map[complement], i]\n\t\thash_map[num] = i`
    },

    // 16-35 (Mixed, reliable test inputs)
    {
        name: "16. Fizz Buzz",
        codeTemplatePython: "def fizz_buzz(n):",
        codeTemplateJavascript: "const fizzBuzz = (n) => {};",
        description: "Return a list of strings from 1 to n. For multiples of 3 return 'Fizz', for multiples of 5 return 'Buzz', and for multiples of both return 'FizzBuzz'. For $n=5$, the output is `['1', '2', 'Fizz', '4', 'Buzz']`.",
        difficulty: "Skirmish",
        tags: ["loops", "logic"],
        testCases: [
            { input: `fizz_buzz(5)`, expectedOutput: "['1', '2', 'Fizz', '4', 'Buzz']", language: LANGUAGE },
            { input: `fizz_buzz(15)`, expectedOutput: "['1', '2', 'Fizz', '4', 'Buzz', 'Fizz', '7', '8', 'Fizz', 'Buzz', '11', 'Fizz', '13', '14', 'FizzBuzz']", language: LANGUAGE },
            { input: `fizzBuzz(5)`, expectedOutput: "['1', '2', 'Fizz', '4', 'Buzz']", language: "javascript" },
            { input: `fizzBuzz(15)`, expectedOutput: "['1', '2', 'Fizz', '4', 'Buzz', 'Fizz', '7', '8', 'Fizz', 'Buzz', '11', 'Fizz', '13', '14', 'FizzBuzz']", language: "javascript" },
        ],
        passingCode: `def fizz_buzz(n):\n\tresult = []\n\tfor i in range(1, n + 1):\n\t\tif i % 15 == 0: result.append('FizzBuzz')\n\t\telif i % 3 == 0: result.append('Fizz')\n\t\telif i % 5 == 0: result.append('Buzz')\n\t\telse: result.append(str(i))\n\treturn result`
    },
    {
        name: "17. Remove Duplicates From Sorted Array",
        codeTemplatePython: "def remove_duplicates(arr):",
        codeTemplateJavascript: "const removeDuplicates = (arr) => {};",
        description: "Given a sorted array, remove the duplicates in-place such that each element appears only once. Return the new length of the array after removal. For input `[1, 1, 2]`, the function returns 2, and the first two elements of the array should be 1 and 2.",
        difficulty: "Pillage",
        tags: ["arrays", "pointers"],
        testCases: [
            { input: `remove_duplicates([1, 1, 2])`, expectedOutput: "2", language: LANGUAGE },
            { input: `remove_duplicates([0, 0, 1, 1, 1, 2, 2, 3, 3, 4])`, expectedOutput: "5", language: LANGUAGE },
            { input: `removeDuplicates([1, 1, 2])`, expectedOutput: "2", language: "javascript" },
            { input: `removeDuplicates([0, 0, 1, 1, 1, 2, 2, 3, 3, 4])`, expectedOutput: "5", language: "javascript" },
        ],
        passingCode: `def remove_duplicates(arr):\n\tif not arr: return 0\n\tk = 1\n\tfor i in range(1, len(arr)):\n\t\tif arr[i] != arr[i-1]:\n\t\t\tarr[k] = arr[i]\n\t\t\tk += 1\n\treturn k`
    },
    {
        name: "18. Longest Common Prefix",
        codeTemplatePython: "def longest_common_prefix(strs):",
        codeTemplateJavascript: "const longestCommonPrefix = (strs) => {};",
        description: "Find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string. For input `['flower', 'flow', 'flight']`, the output is 'fl'.",
        difficulty: "Pillage",
        tags: ["strings", "algorithms"],
        testCases: [
            { input: `longest_common_prefix(['flower', 'flow', 'flight'])`, expectedOutput: "fl", language: LANGUAGE },
            { input: `longest_common_prefix(['dog', 'racecar', 'car'])`, expectedOutput: "", language: LANGUAGE },
            { input: `longestCommonPrefix(['flower', 'flow', 'flight'])`, expectedOutput: "fl", language: "javascript" },
            { input: `longestCommonPrefix(['dog', 'racecar', 'car'])`, expectedOutput: "", language: "javascript" },
        ],
        passingCode: `def longest_common_prefix(strs):\n\tif not strs: return ''\n\tprefix = strs[0]\n\tfor i in range(1, len(strs)):\n\t\twhile strs[i].find(prefix) != 0:\n\t\t\tprefix = prefix[:-1]\n\t\t\tif not prefix: return ''\n\treturn prefix`
    },
    {
        name: "19. Is Prime",
        codeTemplatePython: "def is_prime(n):",
        codeTemplateJavascript: "const isPrime = (n) => {};",
        description: "Return True if the given positive integer n is a prime number (only divisible by 1 and itself), False otherwise. $n=17$ returns True, $n=9$ returns False.",
        difficulty: "Skirmish",
        tags: ["math", "logic"],
        testCases: [
            { input: `is_prime(2)`, expectedOutput: "True", language: LANGUAGE },
            { input: `is_prime(9)`, expectedOutput: "False", language: LANGUAGE },
            { input: `is_prime(17)`, expectedOutput: "True", language: LANGUAGE },
            { input: `isPrime(2)`, expectedOutput: "true", language: "javascript" },
            { input: `isPrime(9)`, expectedOutput: "false", language: "javascript" },
            { input: `isPrime(17)`, expectedOutput: "true", language: "javascript" },
        ],
        passingCode: `import math\ndef is_prime(n):\n\tif n < 2: return False\n\tfor i in range(2, int(math.sqrt(n)) + 1):\n\t\tif n % i == 0: return False\n\treturn True`
    },
    {
        name: "20. Implement strStr()", // Swapped with Valid Parentheses
        codeTemplatePython: "def str_str(haystack, needle):",
        codeTemplateJavascript: "const strStr = (haystack, needle) => {};",
        description: "Implement the `strstr()` function (similar to finding a substring). Return the index of the first occurrence of `needle` in `haystack`, or -1 if `needle` is not part of `haystack`. For `haystack='hello'` and `needle='ll'`, the output is 2.",
        difficulty: "Pillage",
        tags: ["strings", "search"],
        testCases: [
            { input: `str_str('hello', 'll')`, expectedOutput: "2", language: LANGUAGE },
            { input: `str_str('aaaaa', 'bba')`, expectedOutput: "-1", language: LANGUAGE },
            { input: `str_str('', '')`, expectedOutput: "0", language: LANGUAGE },
            { input: `strStr('hello', 'll')`, expectedOutput: "2", language: "javascript" },
            { input: `strStr('aaaaa', 'bba')`, expectedOutput: "-1", language: "javascript" },
            { input: `strStr('', '')`, expectedOutput: "0", language: "javascript" },
        ],
        passingCode: `def str_str(haystack, needle):\n\treturn haystack.find(needle)`
    },
    {
        name: "21. Single Number",
        codeTemplatePython: "def single_number(nums):",
        codeTemplateJavascript: "const singleNumber = (nums) => {};",
        description: "Given a non-empty array of integers, every element appears twice except for one. Find that single, unique element. For input `[4, 1, 2, 1, 2]`, the single number is 4. Hint: Use XOR.",
        difficulty: "Pillage",
        tags: ["arrays", "bit-manipulation"],
        testCases: [
            { input: `single_number([2, 2, 1])`, expectedOutput: "1", language: LANGUAGE },
            { input: `single_number([4, 1, 2, 1, 2])`, expectedOutput: "4", language: LANGUAGE },
            { input: `singleNumber([2, 2, 1])`, expectedOutput: "1", language: "javascript" },
            { input: `singleNumber([4, 1, 2, 1, 2])`, expectedOutput: "4", language: "javascript" },
        ],
        passingCode: `def single_number(nums):\n\tresult = 0\n\tfor num in nums:\n\t\tresult ^= num\n\treturn result`
    },
    {
        name: "22. Power Of Two",
        codeTemplatePython: "def is_power_of_two(n):",
        codeTemplateJavascript: "const isPowerOfTwo = (n) => {};",
        description: "Given an integer n, return True if it is a power of two (i.e., $2^x = n$ for some integer x). Otherwise, return False. $n=16$ returns True ($2^4$), $n=3$ returns False.",
        difficulty: "Skirmish",
        tags: ["math", "bit-manipulation"],
        testCases: [
            { input: `is_power_of_two(16)`, expectedOutput: "True", language: LANGUAGE },
            { input: `is_power_of_two(3)`, expectedOutput: "False", language: LANGUAGE },
            { input: `is_power_of_two(1)`, expectedOutput: "True", language: LANGUAGE },
            { input: `isPowerOfTwo(16)`, expectedOutput: "true", language: "javascript" },
            { input: `isPowerOfTwo(3)`, expectedOutput: "false", language: "javascript" },
            { input: `isPowerOfTwo(1)`, expectedOutput: "true", language: "javascript" },
        ],
        passingCode: `def is_power_of_two(n):\n\treturn n > 0 and (n & (n - 1)) == 0`
    },
    {
        name: "23. Reverse Integer",
        codeTemplatePython: "def reverse_int(x):",
        codeTemplateJavascript: "const reverseInt = (x) => {};",
        description: "Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the 32-bit signed integer range, return 0. E.g., $x=123$ returns $321$, $x=-123$ returns $-321$.",
        difficulty: "Pillage",
        tags: ["math", "integers"],
        testCases: [
            { input: `reverse_int(123)`, expectedOutput: "321", language: LANGUAGE },
            { input: `reverse_int(-123)`, expectedOutput: "-321", language: LANGUAGE },
            { input: `reverse_int(120)`, expectedOutput: "21", language: LANGUAGE },
            { input: `reverseInt(123)`, expectedOutput: "321", language: "javascript" },
            { input: `reverseInt(-123)`, expectedOutput: "-321", language: "javascript" },
            { input: `reverseInt(120)`, expectedOutput: "21", language: "javascript" },
        ],
        passingCode: `def reverse_int(x):\n\timport math\n\tsign = -1 if x < 0 else 1\n\tx = abs(x)\n\treversed_x = int(str(x)[::-1])\n\tresult = sign * reversed_x\n\t# 32-bit signed integer check (simplified)\n\tmax_int = (2**31) - 1\n\tmin_int = -(2**31)\n\tif result > max_int or result < min_int:\n\t\treturn 0\n\treturn result`
    },
    {
        name: "24. Move Zeroes",
        codeTemplatePython: "def move_zeroes(nums):",
        codeTemplateJavascript: "const moveZeroes = (nums) => {};",
        description: "Given an array `nums`, move all 0's to the end of it while maintaining the relative order of the non-zero elements. The operation must be done **in-place**. Input `[0, 1, 0, 3, 12]` results in `[1, 3, 12, 0, 0]`.",
        difficulty: "Pillage",
        tags: ["arrays", "pointers"],
        testCases: [
            { input: `move_zeroes([0, 1, 0, 3, 12])`, expectedOutput: "[1, 3, 12, 0, 0]", language: LANGUAGE },
            { input: `move_zeroes([0])`, expectedOutput: "[0]", language: LANGUAGE },
            { input: `moveZeroes([0, 1, 0, 3, 12])`, expectedOutput: "[1, 3, 12, 0, 0]", language: "javascript" },
            { input: `moveZeroes([0])`, expectedOutput: "[0]", language: "javascript" },
        ],
        passingCode: `def move_zeroes(nums):\n\tnon_zero_pointer = 0\n\tfor i in range(len(nums)):\n\t\tif nums[i] != 0:\n\t\t\tnums[non_zero_pointer], nums[i] = nums[i], nums[non_zero_pointer]\n\t\t\tnon_zero_pointer += 1\n\treturn nums`
    },
    {
        name: "25. Rotate Array",
        codeTemplatePython: "def rotate(nums, k):",
        codeTemplateJavascript: "const rotate = (nums, k) => {};",
        description: "Rotate the array to the right by `k` steps, where `k` is non-negative. The operation should be done **in-place**. If `nums` is `[1, 2, 3, 4, 5, 6, 7]` and $k=3$, the output is `[5, 6, 7, 1, 2, 3, 4]`.",
        difficulty: "Raid",
        tags: ["arrays", "algorithms"],
        testCases: [
            { input: `rotate([1, 2, 3, 4, 5, 6, 7], 3)`, expectedOutput: "[5, 6, 7, 1, 2, 3, 4]", language: LANGUAGE },
            { input: `rotate([-1, -100, 3, 99], 2)`, expectedOutput: "[3, 99, -1, -100]", language: LANGUAGE },
            { input: `rotate([1, 2, 3, 4, 5, 6, 7], 3)`, expectedOutput: "[5, 6, 7, 1, 2, 3, 4]", language: "javascript" },
            { input: `rotate([-1, -100, 3, 99], 2)`, expectedOutput: "[3, 99, -1, -100]", language: "javascript" },
        ],
        passingCode: `def rotate(nums, k):\n\tdef reverse(arr, start, end):\n\t\twhile start < end:\n\t\t\tarr[start], arr[end] = arr[end], arr[start]\n\t\t\tstart += 1\n\t\t\tend -= 1\n\n\tn = len(nums)\n\tk %= n\n\t# Reverse entire array\n\treverse(nums, 0, n - 1)\n\t# Reverse first k elements\n\treverse(nums, 0, k - 1)\n\t# Reverse remaining n-k elements\n\treverse(nums, k, n - 1)\n\treturn nums`
    },
    {
        name: "26. Best Time to Buy and Sell Stock (One Transaction)", // Same as 46, but keeping for sequential check
        codeTemplatePython: "def max_profit(prices):",
        codeTemplateJavascript: "const maxProfit = (prices) => {};",
        description: "Given an array `prices` where $prices[i]$ is the price of a given stock on day i. Find the **maximum profit** you can achieve by buying on one day and selling on a future day. If you cannot achieve any profit, return 0. E.g., for `[7, 1, 5, 3, 6, 4]`, the max profit is 5 (buy at 1, sell at 6).",
        difficulty: "Skirmish",
        tags: ["arrays", "algorithms"],
        testCases: [
            { input: `max_profit([7, 1, 5, 3, 6, 4])`, expectedOutput: "5", language: LANGUAGE },
            { input: `max_profit([7, 6, 4, 3, 1])`, expectedOutput: "0", language: LANGUAGE },
            { input: `maxProfit([7, 1, 5, 3, 6, 4])`, expectedOutput: "5", language: "javascript" },
            { input: `maxProfit([7, 6, 4, 3, 1])`, expectedOutput: "0", language: "javascript" },
        ],
        passingCode: `def max_profit(prices):\n\tmin_price = float('inf')\n\tmax_profit = 0\n\tfor price in prices:\n\t\tmin_price = min(min_price, price)\n\t\tmax_profit = max(max_profit, price - min_price)\n\treturn max_profit`
    },
    {
        name: "27. Intersection of Two Arrays II",
        codeTemplatePython: "def intersect(nums1, nums2):",
        codeTemplateJavascript: "const intersect = (nums1, nums2) => {};",
        description: "Given two arrays, write a function to compute their intersection. Each element in the result should appear as many times as it shows in both arrays. E.g., `[1, 2, 2, 1]` and `[2, 2]`, the output is `[2, 2]`.",
        difficulty: "Pillage",
        tags: ["arrays", "hashing"],
        testCases: [
            { input: `intersect([1, 2, 2, 1], [2, 2])`, expectedOutput: "[2, 2]", language: LANGUAGE },
            { input: `intersect([4, 9, 5], [9, 4, 9, 8, 4])`, expectedOutput: "[4, 9, 9]", language: LANGUAGE }, // Corrected expected output for repeated element
            { input: `intersect([1, 2, 2, 1], [2, 2])`, expectedOutput: "[2, 2]", language: "javascript" },
            { input: `intersect([4, 9, 5], [9, 4, 9, 8, 4])`, expectedOutput: "[4, 9, 9]", language: "javascript" },
        ],
        passingCode: `from collections import Counter\ndef intersect(nums1, nums2):\n\tc1 = Counter(nums1)\n\tc2 = Counter(nums2)\n\tresult = []\n\tfor num in c1:\n\t\tif num in c2:\n\t\t\tcount = min(c1[num], c2[num])\n\t\t\tresult.extend([num] * count)\n\treturn result`
    },
    {
        name: "28. Plus One",
        codeTemplatePython: "def plus_one(digits):",
        codeTemplateJavascript: "const plusOne = (digits) => {};",
        description: "Given a non-empty array of digits representing a non-negative integer, increment the integer by one. Return the new array of digits. E.g., `[1, 2, 3]` becomes `[1, 2, 4]`. Handling carry-overs, `[9, 9, 9]` becomes `[1, 0, 0, 0]`.",
        difficulty: "Pillage",
        tags: ["arrays", "math"],
        testCases: [
            { input: `plus_one([1, 2, 3])`, expectedOutput: "[1, 2, 4]", language: LANGUAGE },
            { input: `plus_one([9, 9, 9])`, expectedOutput: "[1, 0, 0, 0]", language: LANGUAGE },
            { input: `plusOne([1, 2, 3])`, expectedOutput: "[1, 2, 4]", language: "javascript" },
            { input: `plusOne([9, 9, 9])`, expectedOutput: "[1, 0, 0, 0]", language: "javascript" },
        ],
        passingCode: `def plus_one(digits):\n\tn = len(digits)\n\tfor i in range(n - 1, -1, -1):\n\t\tif digits[i] < 9:\n\t\t\tdigits[i] += 1\n\t\t\treturn digits\n\t\tdigits[i] = 0\n\tdigits.insert(0, 1)\n\treturn digits`
    },
    {
        name: "29. String to Integer (atoi)",
        codeTemplatePython: "def my_atoi(s):",
        codeTemplateJavascript: "const myAtoi = (s) => {};",
        description: "Implement the `myAtoi(string s)` function, which converts a string to a 32-bit signed integer (similar to C/C++'s `atoi` function). The algorithm must handle optional whitespace, an optional sign, and integer overflow/clamping to the 32-bit range. E.g., '42' returns 42, ' -42' returns -42, '4193 with words' returns 4193.",
        difficulty: "Raid",
        tags: ["strings", "parsing"],
        testCases: [
            { input: `my_atoi('42')`, expectedOutput: "42", language: LANGUAGE },
            { input: `my_atoi(' -42')`, expectedOutput: "-42", language: LANGUAGE },
            { input: `my_atoi('4193 with words')`, expectedOutput: "4193", language: LANGUAGE },
            { input: `myAtoi('42')`, expectedOutput: "42", language: "javascript" },
            { input: `myAtoi(' -42')`, expectedOutput: "-42", language: "javascript" },
            { input: `myAtoi('4193 with words')`, expectedOutput: "4193", language: "javascript" },
        ],
        passingCode: `def my_atoi(s):\n\timport re\n\tINT_MAX = 2**31 - 1\n\tINT_MIN = -2**31\n\n\ts = s.lstrip()\n\tmatch = re.match(r"^[+-]?\d+", s)\n\n\tif not match:\n\t\treturn 0\n\n\tnum_str = match.group(0)\n\tresult = int(num_str)\n\n\t# Clamping\n\tif result > INT_MAX:\n\t\treturn INT_MAX\n\tif result < INT_MIN:\n\t\treturn INT_MIN\n\n\treturn result`
    },
    {
        name: "30. Rotate Image",
        codeTemplatePython: "def rotate_image(matrix):",
        codeTemplateJavascript: "const rotateImage = (matrix) => {};",
        description: "Given an $n \times n$ 2D matrix representing an image, rotate the image by 90 degrees (clockwise). You must do this **in-place**. For $2 \times 2$ input `[[1, 2], [3, 4]]`, the output is `[[3, 1], [4, 2]]`.",
        difficulty: "Raid",
        tags: ["arrays", "matrix", "algorithms"],
        testCases: [
            { input: `rotate_image([[1, 2], [3, 4]])`, expectedOutput: "[[3, 1], [4, 2]]", language: LANGUAGE },
            { input: `rotate_image([[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]])`, expectedOutput: "[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]", language: LANGUAGE },
            { input: `rotateImage([[1, 2], [3, 4]])`, expectedOutput: "[[3, 1], [4, 2]]", language: "javascript" },
            { input: `rotateImage([[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]])`, expectedOutput: "[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]", language: "javascript" },
        ],
        passingCode: `def rotate_image(matrix):\n\tn = len(matrix)\n\t# 1. Transpose\n\tfor i in range(n):\n\t\tfor j in range(i, n):\n\t\t\tmatrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]\n\t# 2. Reverse each row\n\tfor row in matrix:\n\t\trow.reverse()\n\treturn matrix`
    },
    {
        name: "31. First Unique Character In A String",
        codeTemplatePython: "def first_unique_char(s):",
        codeTemplateJavascript: "const firstUniqueChar = (s) => {};",
        description: "Given a string `s`, find the index of the first non-repeating character in it and return its index. If it does not exist, return -1. E.g., for 'leetcode', the output is 0 ('l').",
        difficulty: "Pillage",
        tags: ["strings", "hashing"],
        testCases: [
            { input: `first_unique_char('leetcode')`, expectedOutput: "0", language: LANGUAGE },
            { input: `first_unique_char('loveleetcode')`, expectedOutput: "2", language: LANGUAGE },
            { input: `first_unique_char('aabb')`, expectedOutput: "-1", language: LANGUAGE },
            { input: `firstUniqueChar('leetcode')`, expectedOutput: "0", language: "javascript" },
            { input: `firstUniqueChar('loveleetcode')`, expectedOutput: "2", language: "javascript" },
            { input: `firstUniqueChar('aabb')`, expectedOutput: "-1", language: "javascript" },
        ],
        passingCode: `from collections import Counter\ndef first_unique_char(s):\n\tcount = Counter(s)\n\tfor i, char in enumerate(s):\n\t\tif count[char] == 1:\n\t\t\treturn i\n\treturn -1`
    },
    {
        name: "32. Reverse Linked List",
        codeTemplatePython: "def reverse_list(head):",
        codeTemplateJavascript: "const reverseList = (head) => {};",
        description: "Reverse a singly linked list. The function takes the head of the list and should return the new head. Input format: Array representing the list. Output format: Array representing the reversed list. E.g., [1, 2, 3] becomes [3, 2, 1].",
        difficulty: "Pillage",
        tags: ["linked-lists", "pointers", "algorithms"],
        testCases: [
            { input: `reverse_list([1, 2, 3, 4, 5])`, expectedOutput: "[5, 4, 3, 2, 1]", language: LANGUAGE },
            { input: `reverse_list([1, 2])`, expectedOutput: "[2, 1]", language: LANGUAGE },
            { input: `reverse_list([])`, expectedOutput: "[]", language: LANGUAGE },
            { input: `reverseList([1, 2, 3, 4, 5])`, expectedOutput: "[5, 4, 3, 2, 1]", language: "javascript" },
            { input: `reverseList([1, 2])`, expectedOutput: "[2, 1]", language: "javascript" },
            { input: `reverseList([])`, expectedOutput: "[]", language: "javascript" },
        ],
        passingCode: `def reverse_list(head):\n\tprev = None\n\tcurrent = head\n\twhile current:\n\t\tnext_node = current.next\n\t\tcurrent.next = prev\n\t\tprev = current\n\t\tcurrent = next_node\n\treturn prev` // Note: Actual LL logic is abstracted for test cases
    },
    {
        name: "33. Longest Substring Without Repeating Characters",
        codeTemplatePython: "def length_of_longest_substring(s):",
        codeTemplateJavascript: "const lengthOfLongestSubstring = (s) => {};",
        description: "Given a string `s`, find the length of the longest substring without repeating characters. For 'pwwkew', the length is 3 ('wke' or 'kew').",
        difficulty: "Raid",
        tags: ["strings", "sliding-window", "algorithms"],
        testCases: [
            { input: `length_of_longest_substring('abcabcbb')`, expectedOutput: "3", language: LANGUAGE }, // 'abc'
            { input: `length_of_longest_substring('bbbbb')`, expectedOutput: "1", language: LANGUAGE }, // 'b'
            { input: `length_of_longest_substring('pwwkew')`, expectedOutput: "3", language: LANGUAGE }, // 'wke' or 'kew'
            { input: `lengthOfLongestSubstring('abcabcbb')`, expectedOutput: "3", language: "javascript" },
            { input: `lengthOfLongestSubstring('bbbbb')`, expectedOutput: "1", language: "javascript" },
            { input: `lengthOfLongestSubstring('pwwkew')`, expectedOutput: "3", language: "javascript" },
        ],
        passingCode: `def length_of_longest_substring(s):\n\tchar_set = set()\n\tl, max_len = 0, 0\n\tfor r in range(len(s)):\n\t\twhile s[r] in char_set:\n\t\t\tchar_set.remove(s[l])\n\t\t\tl += 1\n\t\tchar_set.add(s[r])\n\t\tmax_len = max(max_len, r - l + 1)\n\treturn max_len`
    },
    {
        name: "34. Add Binary",
        codeTemplatePython: "def add_binary(a, b):",
        codeTemplateJavascript: "const addBinary = (a, b) => {};",
        description: "Given two binary strings `a` and `b`, return their sum as a binary string. E.g., '11' + '1' = '100', and '1010' + '1011' = '10101'.",
        difficulty: "Pillage",
        tags: ["strings", "math", "bit-manipulation"],
        testCases: [
            { input: `add_binary('11', '1')`, expectedOutput: "100", language: LANGUAGE },
            { input: `add_binary('1010', '1011')`, expectedOutput: "10101", language: LANGUAGE },
            { input: `addBinary('11', '1')`, expectedOutput: "100", language: "javascript" },
            { input: `addBinary('1010', '1011')`, expectedOutput: "10101", language: "javascript" },
        ],
        passingCode: `def add_binary(a, b):\n\t# Convert to int, sum, convert back to binary string\n\treturn bin(int(a, 2) + int(b, 2))[2:]`
    },
    {
        name: "35. Valid Anagram", // Swapped with Longest Palindrome
        codeTemplatePython: "def is_anagram(s, t):",
        codeTemplateJavascript: "const isAnagram = (s, t) => {};",
        description: "Given two strings `s` and `t`, return True if `t` is an anagram of `s`, and False otherwise. An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once. E.g., 'anagram' and 'nagaram' returns True.",
        difficulty: "Skirmish",
        tags: ["strings", "hashing"],
        testCases: [
            { input: `is_anagram('anagram', 'nagaram')`, expectedOutput: "True", language: LANGUAGE },
            { input: `is_anagram('rat', 'car')`, expectedOutput: "False", language: LANGUAGE },
            { input: `isAnagram('anagram', 'nagaram')`, expectedOutput: "true", language: "javascript" },
            { input: `isAnagram('rat', 'car')`, expectedOutput: "false", language: "javascript" },
        ],
        passingCode: `from collections import Counter\ndef is_anagram(s, t):\n\treturn Counter(s) == Counter(t)`
    },
    {
        name: "36. Find the Duplicate Number",
        codeTemplatePython: "def find_duplicate(nums):",
        codeTemplateJavascript: "const findDuplicate = (nums) => {};",
        description: "Given an array of integers `nums` containing $n+1$ integers where each integer is between 1 and $n$ inclusive. Since there is only one duplicate number, find it. The solution must be done in $O(1)$ extra space. For input `[1, 3, 4, 2, 2]`, the output is 2.",
        difficulty: "Raid",
        tags: ["arrays", "algorithms", "pointers"],
        testCases: [
            { input: `find_duplicate([1, 3, 4, 2, 2])`, expectedOutput: "2", language: LANGUAGE },
            { input: `find_duplicate([3, 1, 3, 4, 2])`, expectedOutput: "3", language: LANGUAGE },
            { input: `findDuplicate([1, 3, 4, 2, 2])`, expectedOutput: "2", language: "javascript" },
            { input: `findDuplicate([3, 1, 3, 4, 2])`, expectedOutput: "3", language: "javascript" },
        ],
        passingCode: `def find_duplicate(nums):\n\tslow = nums[0]\n\tfast = nums[nums[0]]\n\twhile slow != fast:\n\t\tslow = nums[slow]\n\t\tfast = nums[nums[fast]]\n\tslow = 0\n\twhile slow != fast:\n\t\tslow = nums[slow]\n\t\tfast = nums[fast]\n\treturn slow`
    },
    {
        name: "37. Container With Most Water",
        codeTemplatePython: "def max_area(height):",
        codeTemplateJavascript: "const maxArea = (height) => {};",
        description: "Given $n$ non-negative integers $a_1, a_2, ..., a_n$ where each represents a point at coordinate $(i, a_i)$. $n$ vertical lines are drawn such that the two endpoints of line $i$ are $(i, a_i)$ and $(i, 0)$. Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum area. E.g., `[1, 8, 6, 2, 5, 4, 8, 3, 7]` returns 49.",
        difficulty: "Raid",
        tags: ["arrays", "pointers", "geometry"],
        testCases: [
            { input: `max_area([1, 8, 6, 2, 5, 4, 8, 3, 7])`, expectedOutput: "49", language: LANGUAGE },
            { input: `max_area([1, 1])`, expectedOutput: "1", language: LANGUAGE },
            { input: `maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7])`, expectedOutput: "49", language: "javascript" },
            { input: `maxArea([1, 1])`, expectedOutput: "1", language: "javascript" },
        ],
        passingCode: `def max_area(height):\n\tmax_area = 0\n\tleft, right = 0, len(height) - 1\n\twhile left < right:\n\t\tcurrent_area = min(height[left], height[right]) * (right - left)\n\t\tmax_area = max(max_area, current_area)\n\t\tif height[left] < height[right]:\n\t\t\tleft += 1\n\t\telse:\n\t\t\tright -= 1\n\treturn max_area`
    },
    {
        name: "38. Min Stack",
        codeTemplatePython: `class MinStack:\n\tdef __init__(self):\n\t\tself.stack = []\n\t\tself.min_stack = []\n\tdef push(self, val):\n\t\tpass\n\tdef pop(self):\n\t\tpass\n\tdef top(self):\n\t\tpass\n\tdef getMin(self):\n\t\tpass`,
        codeTemplateJavascript: `class MinStack {\n\tconstructor() {\n\t\tthis.stack = [];\n\t\tthis.minStack = [];\n\t}\n\n\tpush(val) {}\n\n\tpop() {}\n\n\ttop() {}\n\n\tgetMin() {}\n}`,
        description: "Design a stack that supports `push`, `pop`, `top`, and retrieving the minimum element in constant time. The test cases are an operation sequence. For a sequence involving pushing -2, 0, and -3, `getMin()` should return -3.",
        difficulty: "Raid",
        tags: ["data-structures", "stacks"],
        testCases: [
            { input: "s = MinStack(); s.push(-2); s.push(0); s.push(-3); s.getMin()", expectedOutput: "-3", language: LANGUAGE },
            { input: "s = MinStack(); s.push(-2); s.push(0); s.pop(); s.top()", expectedOutput: "0", language: LANGUAGE },
            { input: "s = MinStack(); s.push(-2); s.push(0); s.push(-3); s.getMin()", expectedOutput: "-3", language: "javascript" },
            { input: "s = MinStack(); s.push(-2); s.push(0); s.pop(); s.top()", expectedOutput: "0", language: "javascript" },
        ],
        passingCode: `class MinStack:\n\tdef __init__(self):\n\t\tself.stack = []\n\t\tself.min_stack = []\n\tdef push(self, val):\n\t\tself.stack.append(val)\n\t\tif not self.min_stack or val <= self.min_stack[-1]:\n\t\t\tself.min_stack.append(val)\n\tdef pop(self):\n\t\tif self.stack and self.min_stack and self.stack[-1] == self.min_stack[-1]:\n\t\t\tself.min_stack.pop()\n\t\tif self.stack:\n\t\t\tself.stack.pop()\n\tdef top(self):\n\t\treturn self.stack[-1]\n\tdef getMin(self):\n\t\treturn self.min_stack[-1]`
    },
    {
        name: "39. Group Anagrams",
        codeTemplatePython: "def group_anagrams(strs):",
        codeTemplateJavascript: "const groupAnagrams = (strs) => {};",
        description: "Given an array of strings `strs`, group the anagrams together. You can return the answer in any order. An anagram is a word or phrase formed by rearranging the letters of a different word or phrase. E.g., `['eat', 'tea', 'tan', 'ate', 'nat', 'bat']` returns `[['bat'], ['nat', 'tan'], ['ate', 'eat', 'tea']]`.",
        difficulty: "Pillage",
        tags: ["arrays", "strings", "hashing"],
        testCases: [
            { input: `group_anagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat'])`, expectedOutput: "[['bat'], ['nat', 'tan'], ['ate', 'eat', 'tea']]", language: LANGUAGE }, // Output order doesn't matter, but for testing, use a canonical one.
            { input: `group_anagrams([''])`, expectedOutput: "[['']]", language: LANGUAGE },
            { input: `groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat'])`, expectedOutput: "[['bat'], ['nat', 'tan'], ['ate', 'eat', 'tea']]", language: "javascript" },
            { input: `groupAnagrams([''])`, expectedOutput: "[['']]", language: "javascript" },
        ],
        passingCode: `from collections import defaultdict\ndef group_anagrams(strs):\n\tdict = defaultdict(list)\n\tfor s in strs:\n\t\tdict["".join(sorted(s))].append(s)\n\t# Output is sorted by first element of each inner list for canonical comparison\n\tresult = sorted(dict.values(), key=lambda x: x[0])\n\treturn result`
    },
    {
        name: "40. Combination Sum", // Re-inserted
        codeTemplatePython: "def combination_sum(candidates, target):",
        codeTemplateJavascript: "const combinationSum = (candidates, target) => {};",
        description: "Given a set of candidate numbers `candidates` (without duplicates) and a target number `target`, find all unique combinations in `candidates` where the candidate numbers sum to `target`. The same repeated number may be chosen from `candidates` an unlimited number of times. Return the result as an array of arrays. E.g., `candidates=[2, 3, 6, 7]`, `target=7` returns `[[7], [2, 2, 3]]`.",
        difficulty: "Raid",
        tags: ["arrays", "backtracking", "dynamic-programming"],
        testCases: [
            { input: `combination_sum([2, 3, 6, 7], 7)`, expectedOutput: "[[2, 2, 3], [7]]", language: "python" },
            { input: `combination_sum([2, 3, 5], 8)`, expectedOutput: "[[2, 2, 2, 2], [2, 3, 3], [3, 5]]", language: "python" },
            { input: `combinationSum([2, 3, 6, 7], 7)`, expectedOutput: "[[2, 2, 3], [7]]", language: "javascript" },
            { input: `combinationSum([2, 3, 5], 8)`, expectedOutput: "[[2, 2, 2, 2], [2, 3, 3], [3, 5]]", language: "javascript" },
        ],
        passingCode: `def combination_sum(candidates, target):\n\tdef backtrack(combination, remaining, start):\n\t\tif remaining == 0:\n\t\t\tresult.append(list(combination))\n\t\t\treturn\n\t\tif remaining < 0:\n\t\t\treturn\n\t\tfor i in range(start, len(candidates)):\n\t\t\tcombination.append(candidates[i])\n\t\t\tbacktrack(combination, remaining - candidates[i], i)\n\t\t\tcombination.pop()\n\tresult = []\n\tcandidates.sort()\n\tbacktrack([], target, 0)\n\treturn result`
    },
    {
        name: "41. Minimum Path Sum",
        codeTemplatePython: "def min_path_sum(grid):",
        codeTemplateJavascript: "const minPathSum = (grid) => {};",
        description: "Given an $m \times n$ grid filled with non-negative numbers, find a path from the top left to the bottom right, which minimizes the sum of all numbers along its path. You can only move either down or right at any point in time. E.g., `[[1, 3, 1], [1, 5, 1], [4, 2, 1]]` returns 7.",
        difficulty: "Raid",
        tags: ["dynamic-programming", "matrix", "arrays"],
        testCases: [
            { input: `min_path_sum([[1, 3, 1], [1, 5, 1], [4, 2, 1]])`, expectedOutput: "7", language: LANGUAGE },
            { input: `min_path_sum([[1, 2, 3], [4, 5, 6]])`, expectedOutput: "12", language: LANGUAGE },
            { input: `minPathSum([[1, 3, 1], [1, 5, 1], [4, 2, 1]])`, expectedOutput: "7", language: "javascript" },
            { input: `minPathSum([[1, 2, 3], [4, 5, 6]])`, expectedOutput: "12", language: "javascript" },
        ],
        passingCode: `def min_path_sum(grid):\n\tROWS, COLS = len(grid), len(grid[0])\n\tfor r in range(ROWS):\n\t\tfor c in range(COLS):\n\t\t\tif r == 0 and c == 0:\n\t\t\t\tcontinue\n\t\t\telif r == 0:\n\t\t\t\tgrid[r][c] += grid[r][c - 1]\n\t\t\telif c == 0:\n\t\t\t\tgrid[r][c] += grid[r - 1][c]\n\t\t\telse:\n\t\t\t\tgrid[r][c] += min(grid[r - 1][c], grid[r][c - 1])\n\treturn grid[ROWS - 1][COLS - 1]`
    },
    {
        name: "42. Trapping Rain Water", // Re-inserted
        codeTemplatePython: "def trap(height):",
        codeTemplateJavascript: "const trap = (height) => {};",
        description: "Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much rain water it can trap after raining. E.g., for `[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]`, the output is 6.",
        difficulty: "Raid",
        tags: ["arrays", "dynamic-programming", "pointers"],
        testCases: [
            { input: `trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1])`, expectedOutput: "6", language: "python" },
            { input: `trap([4, 2, 0, 3, 2, 5])`, expectedOutput: "9", language: "python" },
            { input: `trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1])`, expectedOutput: "6", language: "javascript" },
            { input: `trap([4, 2, 0, 3, 2, 5])`, expectedOutput: "9", language: "javascript" },
        ],
        passingCode: `def trap(height):\n\tif not height: return 0\n\tleft, right = 0, len(height) - 1\n\tmax_left, max_right = height[left], height[right]\n\ttrapped_water = 0\n\twhile left < right:\n\t\tif max_left < max_right:\n\t\t\tleft += 1\n\t\t\tmax_left = max(max_left, height[left])\n\t\t\ttrapped_water += max_left - height[left]\n\t\telse:\n\t\t\tright -= 1\n\t\t\tmax_right = max(max_right, height[right])\n\t\t\ttrapped_water += max_right - height[right]\n\treturn trapped_water`
    },
    {
        name: "43. Majority Element",
        codeTemplatePython: "def majority_element(nums):",
        codeTemplateJavascript: "const majorityElement = (nums) => {};",
        description: "Given an array `nums` of size $n$, return the *majority element*. The majority element is the element that appears more than $\lfloor n/2 \rfloor$ times. This can be solved efficiently using **Boyer-Moore Voting Algorithm**. For input `[3, 2, 3]`, the output is 3.",
        difficulty: "Pillage",
        tags: ["arrays", "algorithms", "sorting"],
        testCases: [
            { input: `majority_element([3, 2, 3])`, expectedOutput: "3", language: LANGUAGE },
            { input: `majority_element([2, 2, 1, 1, 1, 2, 2])`, expectedOutput: "2", language: LANGUAGE },
            { input: `majorityElement([3, 2, 3])`, expectedOutput: "3", language: "javascript" },
            { input: `majorityElement([2, 2, 1, 1, 1, 2, 2])`, expectedOutput: "2", language: "javascript" },
        ],
        passingCode: `def majority_element(nums):\n\tcandidate, count = None, 0\n\tfor num in nums:\n\t\tif count == 0:\n\t\t\tcandidate = num\n\t\tcount += (1 if num == candidate else -1)\n\treturn candidate`
    },
    {
        name: "44. Merge Intervals",
        codeTemplatePython: "def merge_intervals(intervals):",
        codeTemplateJavascript: "const mergeIntervals = (intervals) => {};",
        description: "Given an array of intervals, where $intervals[i] = [start_i, end_i]$, merge all overlapping intervals and return an array of the non-overlapping intervals. The input `[[1, 3], [2, 6], [8, 10]]` should be merged to `[[1, 6], [8, 10]]` because [1, 3] and [2, 6] overlap.",
        difficulty: "Raid",
        tags: ["arrays", "sorting", "algorithms"],
        testCases: [
            { input: `merge_intervals([[1, 3], [2, 6], [8, 10], [15, 18]])`, expectedOutput: "[[1, 6], [8, 10], [15, 18]]", language: LANGUAGE },
            { input: `merge_intervals([[1, 4], [4, 5]])`, expectedOutput: "[[1, 5]]", language: LANGUAGE },
            { input: `mergeIntervals([[1, 3], [2, 6], [8, 10], [15, 18]])`, expectedOutput: "[[1, 6], [8, 10], [15, 18]]", language: "javascript" },
            { input: `mergeIntervals([[1, 4], [4, 5]])`, expectedOutput: "[[1, 5]]", language: "javascript" },
        ],
        passingCode: `def merge_intervals(intervals):\n\tintervals.sort(key=lambda x: x[0])\n\tmerged = []\n\tfor interval in intervals:\n\t\tif not merged or merged[-1][1] < interval[0]:\n\t\t\tmerged.append(interval)\n\t\telse:\n\t\t\tmerged[-1][1] = max(merged[-1][1], interval[1])\n\treturn merged`
    },
    {
        name: "45. Jump Game", // Re-inserted
        codeTemplatePython: "def can_jump(nums):",
        codeTemplateJavascript: "const canJump = (nums) => {};",
        description: "Given an array of non-negative integers `nums`, where each element represents your maximum jump length at that position. Return True if you can reach the last index, or False otherwise. E.g., `[2, 3, 1, 1, 4]` returns True, `[3, 2, 1, 0, 4]` returns False.",
        difficulty: "Raid",
        tags: ["arrays", "greedy", "dynamic-programming"],
        testCases: [
            { input: `can_jump([2, 3, 1, 1, 4])`, expectedOutput: "True", language: "python" },
            { input: `can_jump([3, 2, 1, 0, 4])`, expectedOutput: "False", language: "python" },
            { input: `can_jump([0])`, expectedOutput: "True", language: "python" },
            { input: `canJump([2, 3, 1, 1, 4])`, expectedOutput: "true", language: "javascript" },
            { input: `canJump([3, 2, 1, 0, 4])`, expectedOutput: "false", language: "javascript" },
            { input: `canJump([0])`, expectedOutput: "true", language: "javascript" },
        ],
        passingCode: `def can_jump(nums):\n\tgoal = len(nums) - 1\n\tfor i in range(len(nums) - 2, -1, -1):\n\t\tif i + nums[i] >= goal:\n\t\t\tgoal = i\n\treturn goal == 0`
    },
    {
        name: "46. Best Time to Buy and Sell Stock (One Transaction)",
        codeTemplatePython: "def max_profit(prices):",
        codeTemplateJavascript: "const maxProfit = (prices) => {};",
        description: "Given an array `prices` where $prices[i]$ is the price of a given stock on day i. Find the **maximum profit** you can achieve by buying on one day and selling on a future day. If you cannot achieve any profit, return 0. E.g., for `[7, 1, 5, 3, 6, 4]`, the max profit is 5 (buy at 1, sell at 6).",
        difficulty: "Skirmish",
        tags: ["arrays", "algorithms"],
        testCases: [
            { input: `max_profit([7, 1, 5, 3, 6, 4])`, expectedOutput: "5", language: LANGUAGE },
            { input: `max_profit([7, 6, 4, 3, 1])`, expectedOutput: "0", language: LANGUAGE },
            { input: `maxProfit([7, 1, 5, 3, 6, 4])`, expectedOutput: "5", language: "javascript" },
            { input: `maxProfit([7, 6, 4, 3, 1])`, expectedOutput: "0", language: "javascript" },
        ],
        passingCode: `def max_profit(prices):\n\tmin_price = float('inf')\n\tmax_profit = 0\n\tfor price in prices:\n\t\tmin_price = min(min_price, price)\n\t\tmax_profit = max(max_profit, price - min_price)\n\treturn max_profit`
    },
    {
        name: "47. Pascal's Triangle",
        codeTemplatePython: "def generate_pascal(num_rows):",
        codeTemplateJavascript: "const generatePascal = (numRows) => {};",
        description: "Given an integer `num_rows`, return the first `num_rows` of **Pascal's triangle**. In Pascal's triangle, each number is the sum of the two numbers directly above it. E.g., `generate_pascal(5)` returns `[[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]]`.",
        difficulty: "Pillage",
        tags: ["arrays", "math", "algorithms"],
        testCases: [
            { input: `generate_pascal(5)`, expectedOutput: "[[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]]", language: LANGUAGE },
            { input: `generate_pascal(1)`, expectedOutput: "[[1]]", language: LANGUAGE },
            { input: `generatePascal(5)`, expectedOutput: "[[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]]", language: "javascript" },
            { input: `generatePascal(1)`, expectedOutput: "[[1]]", language: "javascript" },
        ],
        passingCode: `def generate_pascal(num_rows):\n\tresult = []\n\tfor i in range(num_rows):\n\t\trow = [None] * (i + 1)\n\t\trow[0], row[-1] = 1, 1\n\t\tfor j in range(1, len(row) - 1):\n\t\t\trow[j] = result[i - 1][j - 1] + result[i - 1][j]\n\t\tresult.append(row)\n\treturn result`
    },
    {
        name: "48. Roman to Integer", // Re-inserted (User requested)
        codeTemplatePython: "def roman_to_int(s):",
        codeTemplateJavascript: "const romanToInt = (s) => {};",
        description: "Convert a Roman numeral string `s` (I, V, X, L, C, D, M) into an integer. Roman numerals are usually written largest to smallest from left to right, but for numbers like 4 (IV) and 9 (IX), the smaller value precedes the larger value. E.g., 'III' returns 3, 'LVIII' returns 58, and 'MCMXCIV' returns 1994.",
        difficulty: "Pillage",
        tags: ["strings", "math"],
        testCases: [
            { input: `roman_to_int('III')`, expectedOutput: "3", language: "python" },
            { input: `roman_to_int('LVIII')`, expectedOutput: "58", language: "python" },
            { input: `roman_to_int('MCMXCIV')`, expectedOutput: "1994", language: "python" },
            { input: `romanToInt('III')`, expectedOutput: "3", language: "javascript" },
            { input: `romanToInt('LVIII')`, expectedOutput: "58", language: "javascript" },
            { input: `romanToInt('MCMXCIV')`, expectedOutput: "1994", language: "javascript" },
        ],
        passingCode: `def roman_to_int(s):\n\troman_map = {'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000}\n\tresult = 0\n\tfor i in range(len(s)):\n\t\tif i + 1 < len(s) and roman_map[s[i]] < roman_map[s[i+1]]:\n\t\t\tresult -= roman_map[s[i]]\n\t\telse:\n\t\t\tresult += roman_map[s[i]]\n\treturn result`
    },
    {
        name: "49. Maximum Subarray",
        codeTemplatePython: "def max_sub_array(nums):",
        codeTemplateJavascript: "const maxSubArray = (nums) => {};",
        description: "Given an integer array `nums`, find the subarray (a contiguous non-empty sequence of elements) which has the largest sum and return its sum. This can be solved efficiently using **Kadane's Algorithm**. For input `[-2, 1, -3, 4, -1, 2, 1, -5, 4]`, the largest sum is 6 (from subarray [4, -1, 2, 1]).",
        difficulty: "Raid",
        tags: ["arrays", "dynamic-programming", "algorithms"],
        testCases: [
            { input: `max_sub_array([-2, 1, -3, 4, -1, 2, 1, -5, 4])`, expectedOutput: "6", language: LANGUAGE },
            { input: `max_sub_array([1])`, expectedOutput: "1", language: LANGUAGE },
            { input: `max_sub_array([5, 4, -1, 7, 8])`, expectedOutput: "23", language: LANGUAGE },
            { input: `maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])`, expectedOutput: "6", language: "javascript" },
            { input: `maxSubArray([1])`, expectedOutput: "1", language: "javascript" },
            { input: `maxSubArray([5, 4, -1, 7, 8])`, expectedOutput: "23", language: "javascript" },
        ],
        passingCode: `def max_sub_array(nums):\n\tmax_so_far = nums[0]\n\tcurrent_max = nums[0]\n\tfor i in range(1, len(nums)):\n\t\tcurrent_max = max(nums[i], current_max + nums[i])\n\t\tmax_so_far = max(max_so_far, current_max)\n\treturn max_so_far`
    },
    {
        name: "50. Number of 1 Bits",
        codeTemplatePython: "def hamming_weight(n):",
        codeTemplateJavascript: "const hammingWeight = (n) => {};",
        description: "Write a function that takes an unsigned integer and returns the number of '1' bits it has (also known as the Hamming weight). Note that in some environments, signed integers are used, and this challenge should still count the number of set bits. E.g., $n=11$ (binary 1011) returns 3.",
        difficulty: "Skirmish",
        tags: ["bit-manipulation"],
        testCases: [
            { input: `hamming_weight(11)`, expectedOutput: "3", language: LANGUAGE },
            { input: `hamming_weight(128)`, expectedOutput: "1", language: LANGUAGE },
            { input: `hammingWeight(11)`, expectedOutput: "3", language: "javascript" },
            { input: `hammingWeight(128)`, expectedOutput: "1", language: "javascript" },
        ],
        passingCode: `def hamming_weight(n):\n\tcount = 0\n\twhile n != 0:\n\t\tn &= (n - 1)\n\t\tcount += 1\n\treturn count`
    }
];

// --- 3. User Templates ---
const TOTAL_USERS = 50; // Total users to seed
const adminUser = {
    username: 'admin',
    email: 'admin@codehub.com',
    hashedPassword: HASHED_PASSWORD,
    isAdmin: true,
    points: 0,
    bio: 'The system administrator.',
    completed: { easy: 0, medium: 0, hard: 0 }
};

const userTemplates = [adminUser];
for (let i = 1; i <= TOTAL_USERS; i++) {
    const userNumber = String(i).padStart(3, '0');
    userTemplates.push({
        username: `s_user_${userNumber}_s`,
        email: `user_${userNumber}@seeded.com`,
        hashedPassword: HASHED_PASSWORD,
        isAdmin: false,
        points: 0,
        bio: `Seeded user number ${i}.`,
        completed: { easy: 0, medium: 0, hard: 0 }
    });
}


// --- 4. Database Seeding Logic ---
// Replace with your actual MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/exampleDB';

/**
 * Connects to MongoDB, clears existing data, and seeds all documents.
 */
async function seedDatabase() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB connected successfully.');

        // 1. Clear existing data
        console.log('🗑️ Clearing existing Challenges, TestCases, Users, and Submissions...');
        await Challenge.deleteMany({});
        await TestCase.deleteMany({});
        await User.deleteMany({});
        await Submission.deleteMany({});
        console.log('   Data cleared.');

        // 2. Process and Seed Challenges
        const seededChallenges = [];
        let n = 1;
        console.log('\n⚙️ Seeding Challenges and Test Cases...');
        for (const challenge of challengesData) {
            console.log("Current challenge:", n);

            // a) Create Challenge
            const newChallenge = new Challenge({
                ...challenge,
                // Assign difficulty-based points and standardize difficulty string
                points: POINTS[challenge.difficulty],
                difficulty: DIFFICULTY_MAP[challenge.difficulty],
                // Clear in-line testCases to prevent duplication in Challenge model
                testCases: [] 
            });

            // b) Create Test Cases & Link to Challenge
            const seededTestCases = await TestCase.insertMany(challenge.testCases.map(tc => ({
                ...tc,
                challengeId: newChallenge._id // Link TC to Challenge ID
            })));
            
            // c) Update Challenge with Test Case IDs
            newChallenge.testCases = seededTestCases.map(tc => tc._id);
            await newChallenge.save();

            seededChallenges.push(newChallenge);
            n++;
        }
        console.log(`   Total challenges created: ${seededChallenges.length}`);
        console.log(`   Total test cases created: ${seededChallenges.reduce((acc, c) => acc + c.testCases.length, 0)}`);


        // 3. Seed Users
        console.log('\n👤 Seeding Users...');
        const seededUsers = await User.insertMany(userTemplates);
        console.log(`   Total users created: ${seededUsers.length}`);


        // 4. Generate and Seed Submissions
        console.log('\n📝 Generating and Seeding Submissions...');

        // Initialize a dictionary to track user stats, including completed challenge IDs
        const userStats = {};
        for (const user of seededUsers) {
            userStats[user._id] = {
                points: 0,
                completed: { easy: 0, medium: 0, hard: 0 },
                completedChallenges: new Set(), // Track challenges completed to avoid duplicate submissions for the same challenge
            };
        }

        // --- Submission Logic ---
        // Seed 10 random challenges for the first 10 users, and 5 random challenges for the next 10 users
        const submissions = [];
        const numToSubmit = 10;
        const totalChallenges = seededChallenges.length;

        for (let i = 0; i < 20; i++) { // Target the first 20 users for submissions
            const user = seededUsers[i];
            const stats = userStats[user._id];
            const submissionCount = (i < 10) ? numToSubmit : numToSubmit / 2; // 10 for first 10, 5 for next 10

            // Select random unique challenges
            const challengeIndices = new Set();
            while (challengeIndices.size < submissionCount && challengeIndices.size < totalChallenges) {
                challengeIndices.add(Math.floor(Math.random() * totalChallenges));
            }

            for (const index of challengeIndices) {
                const challenge = seededChallenges[index];
                const difficultyKey = challenge.difficulty; // 'easy', 'medium', 'hard'
                const pointValue = POINTS[Object.keys(DIFFICULTY_MAP).find(key => DIFFICULTY_MAP[key] === difficultyKey)];

                // **ERROR FIX: Ensure challenge.passingCode is not undefined**
                const submissionCode = challenge.passingCode || challenge.codeTemplatePython || challenge.codeTemplateJavascript || 'No passing code provided';


                // 1. Create Submission
                submissions.push({
                    author: user._id,
                    challenge: challenge._id,
                    code: submissionCode, // Use the guaranteed code string
                    language: LANGUAGE,
                    authorNote: "I am so smort I solve this challenge yey"
                });

                // 2. Update User Stats (Points & Completed)
                stats.points += pointValue;
                stats.completed[difficultyKey] += 1;
                stats.completedChallenges.add(challenge._id.toString());
            }
        }
        
        // Final Submission Insert
        const seededSubmissions = await Submission.insertMany(submissions);
        console.log(`   Total submissions created: ${seededSubmissions.length}`);


        // 5. Update Users with Final Stats
        console.log('📊 Updating Users with calculated points and completion counts...');
        const updatePromises = seededUsers.map(user => {
            const stats = userStats[user._id];
            return User.findByIdAndUpdate(user._id, {
                points: stats.points,
                completed: stats.completed,
                // The 'select: false' for hashedPassword means it won't be returned here anyway
            });
        });

        await Promise.all(updatePromises);
        console.log('   User statistics updated successfully.');

    } catch (error) {
        console.error('❌ Database seeding failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('➡️ MongoDB connection closed.');
    }
}

// Check if bcrypt is loaded before calling seedDatabase
if (!bcrypt) {
    console.error('FATAL ERROR: bcryptjs library not found. Please run "npm install bcryptjs"');
} else {
    seedDatabase();
}