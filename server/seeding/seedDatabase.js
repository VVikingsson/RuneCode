// --- 1. Model & Library Imports ---
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Required for password hashing
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Import models from the specified path
const { Challenge, TestCase, User, Submission } = require('../models'); 


// --- 2. Seed Data Definition (Refined and Simplified Challenges) ---

const LANGUAGE = 'python';

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
        codeTemplate: "def min_val(numbers):\n\t# numbers is a comma-separated string",
        description: "Given a comma-separated string of numbers, return the smallest number as a string. For example, if the input is '10, 5, 20, -1', the expected output is '-1'.",
        difficulty: "Skirmish",
        tags: ["strings", "parsing", "math"],
        testCases: [
            { input: `min_val('1,2,3,4')`, expectedOutput: "1", language: LANGUAGE },
            { input: `min_val('1,2,3,4,-7')`, expectedOutput: "-7", language: LANGUAGE },
            { input: `min_val('200,400,201')`, expectedOutput: "200", language: LANGUAGE },
        ],
        // Mock passing code for submissions
        passingCode: `def min_val(numbers):\n\treturn str(min(map(int, numbers.split(','))))`
    },
    {
        name: "02. Reverse A String",
        codeTemplate: "def reverse_str(s):",
        description: "Implement a function that reverses a given string. For example, 'hello' becomes 'olleh'.",
        difficulty: "Skirmish",
        tags: ["strings"],
        testCases: [
            { input: `reverse_str('hello')`, expectedOutput: "olleh", language: LANGUAGE },
            { input: `reverse_str('world')`, expectedOutput: "dlrow", language: LANGUAGE },
            { input: `reverse_str('a')`, expectedOutput: "a", language: LANGUAGE },
        ],
        passingCode: `def reverse_str(s):\n\treturn s[::-1]`
    },
    {
        name: "03. Check Palindrome",
        codeTemplate: "def is_palindrome(word):",
        description: "Return True if the word is a palindrome (reads the same forwards and backwards), False otherwise. The comparison should be case-insensitive. E.g., 'Racecar' returns True.",
        difficulty: "Skirmish",
        tags: ["strings", "logic"],
        testCases: [
            { input: `is_palindrome('madam')`, expectedOutput: "True", language: LANGUAGE },
            { input: `is_palindrome('apple')`, expectedOutput: "False", language: LANGUAGE },
            { input: `is_palindrome('racecar')`, expectedOutput: "True", language: LANGUAGE },
        ],
        passingCode: `def is_palindrome(word):\n\tcleaned = word.lower()\n\treturn cleaned == cleaned[::-1]`
    },
    {
        name: "04. Calculate Factorial",
        codeTemplate: "def factorial(n):",
        description: "Calculate the factorial of a non-negative integer n. (n!). The factorial of 5 (5!) is 120. Input is an integer.",
        difficulty: "Pillage",
        tags: ["math", "recursion"],
        testCases: [
            { input: `factorial(5)`, expectedOutput: "120", language: LANGUAGE },
            { input: `factorial(0)`, expectedOutput: "1", language: LANGUAGE },
            { input: `factorial(1)`, expectedOutput: "1", language: LANGUAGE },
        ],
        passingCode: `def factorial(n):\n\tif n == 0:\n\t\treturn 1\n\telse:\n\t\treturn n * factorial(n-1)`
    },
    {
        name: "05. Sum Array",
        codeTemplate: "def array_sum(arr):",
        description: "Calculate and return the sum of all integers in a list/array. If the input array is [10, -5, 5], the expected output is 10.",
        difficulty: "Skirmish",
        tags: ["arrays", "math"],
        testCases: [
            { input: `array_sum([1, 2, 3])`, expectedOutput: "6", language: LANGUAGE },
            { input: `array_sum([10, -5, 5])`, expectedOutput: "10", language: LANGUAGE },
            { input: `array_sum([])`, expectedOutput: "0", language: LANGUAGE },
        ],
        passingCode: `def array_sum(arr):\n\treturn sum(arr)`
    },
    {
        name: "06. Find Maximum In Array",
        codeTemplate: "def find_max(arr):",
        description: "Find and return the largest number in an array of integers. Given the array [1, 5, 2, 9], the function should return 9.",
        difficulty: "Skirmish",
        tags: ["arrays", "math"],
        testCases: [
            { input: `find_max([1, 5, 2, 9])`, expectedOutput: "9", language: LANGUAGE },
            { input: `find_max([-10, -5, -1])`, expectedOutput: "-1", language: LANGUAGE },
        ],
        passingCode: `def find_max(arr):\n\treturn max(arr)`
    },
    {
        name: "07. Fibonacci N-th Term",
        codeTemplate: "def fibonacci(n):",
        description: "Return the n-th term of the Fibonacci sequence (0-indexed: F0=0, F1=1, F2=1, ...). For example, `fibonacci(5)` should return 5.",
        difficulty: "Pillage",
        tags: ["recursion", "math", "algorithms"],
        testCases: [
            { input: `fibonacci(0)`, expectedOutput: "0", language: LANGUAGE },
            { input: `fibonacci(5)`, expectedOutput: "5", language: LANGUAGE },
            { input: `fibonacci(10)`, expectedOutput: "55", language: LANGUAGE },
        ],
        passingCode: `def fibonacci(n):\n\ta, b = 0, 1\n\tfor _ in range(n):\n\t\ta, b = b, a + b\n\treturn a`
    },
    {
        name: "08. Count Vowels",
        codeTemplate: "def count_vowels(text):",
        description: "Count the total number of vowels (a, e, i, o, u) in a given string. The counting should be case-insensitive. For input 'Hello World', the output is 3.",
        difficulty: "Skirmish",
        tags: ["strings", "counting"],
        testCases: [
            { input: `count_vowels('hello world')`, expectedOutput: "3", language: LANGUAGE },
            { input: `count_vowels('AEIOU')`, expectedOutput: "5", language: LANGUAGE },
            { input: `count_vowels('rhythm')`, expectedOutput: "0", language: LANGUAGE },
        ],
        passingCode: `def count_vowels(text):\n\tvowels = 'aeiou'\n\tcount = 0\n\tfor char in text.lower():\n\t\tif char in vowels:\n\t\t\tcount += 1\n\treturn count`
    },
    {
        name: "09. Title Case A Sentence",
        codeTemplate: "def title_case(sentence):",
        description: "Convert the first letter of every word in a sentence to uppercase, and the rest to lowercase. Input: 'a short example'. Output: 'A Short Example'.",
        difficulty: "Pillage",
        tags: ["strings", "formatting"],
        testCases: [
            { input: `title_case('hello world')`, expectedOutput: "Hello World", language: LANGUAGE },
            { input: `title_case('a short example')`, expectedOutput: "A Short Example", language: LANGUAGE },
        ],
        passingCode: `def title_case(sentence):\n\treturn sentence.title()`
    },
    {
        name: "10. Check Anagram",
        codeTemplate: "def are_anagrams(str1, str2):",
        description: "Return True if two strings are anagrams of each other (contain the same characters with the same frequency), False otherwise. Ignore case and non-alphanumeric characters. E.g., 'rail safety' and 'fairy tales' returns True.",
        difficulty: "Pillage",
        tags: ["strings", "algorithms"],
        testCases: [
            { input: `are_anagrams('listen', 'silent')`, expectedOutput: "True", language: LANGUAGE },
            { input: `are_anagrams('hello', 'world')`, expectedOutput: "False", language: LANGUAGE },
            { input: `are_anagrams('rail safety', 'fairy tales')`, expectedOutput: "True", language: LANGUAGE },
        ],
        passingCode: `import re\ndef are_anagrams(str1, str2):\n\tclean1 = sorted(re.sub('[^a-z]', '', str1.lower()))\n\tclean2 = sorted(re.sub('[^a-z]', '', str2.lower()))\n\treturn clean1 == clean2`
    },
    {
        name: "11. Binary Search",
        codeTemplate: "def binary_search(arr, target):",
        description: "Implement binary search to find the index of a target value in a **sorted** array. Return -1 if the target is not found. For the array [2, 5, 8, 12, 16] and target 12, the output is 3.",
        difficulty: "Raid",
        tags: ["algorithms", "arrays", "search"],
        testCases: [
            { input: `binary_search([2, 5, 8, 12, 16], 12)`, expectedOutput: "3", language: LANGUAGE },
            { input: `binary_search([2, 5, 8, 12, 16], 9)`, expectedOutput: "-1", language: LANGUAGE },
            { input: `binary_search([], 5)`, expectedOutput: "-1", language: LANGUAGE },
        ],
        passingCode: `def binary_search(arr, target):\n\tleft, right = 0, len(arr) - 1\n\twhile left <= right:\n\t\tmid = (left + right) // 2\n\t\tif arr[mid] == target:\n\t\t\treturn mid\n\t\telif arr[mid] < target:\n\t\t\tleft = mid + 1\n\t\telse:\n\t\t\tright = mid - 1\n\treturn -1`
    },
    {
        name: "12. Merge Sorted Arrays",
        codeTemplate: "def merge_arrays(arr1, arr2):",
        description: "Merge two sorted arrays, `arr1` and `arr2`, into a single sorted array. E.g., merging [1, 3, 5] and [2, 4, 6] results in [1, 2, 3, 4, 5, 6].",
        difficulty: "Pillage",
        tags: ["arrays", "algorithms"],
        testCases: [
            { input: `merge_arrays([1, 3, 5], [2, 4, 6])`, expectedOutput: "[1, 2, 3, 4, 5, 6]", language: LANGUAGE },
            { input: `merge_arrays([10, 20], [1, 2])`, expectedOutput: "[1, 2, 10, 20]", language: LANGUAGE },
        ],
        passingCode: `def merge_arrays(arr1, arr2):\n\treturn sorted(arr1 + arr2)`
    },
    {
        name: "13. Find Missing Number",
        codeTemplate: "def find_missing(arr):",
        description: "Given an array containing n distinct numbers taken from 0, 1, 2, ..., n, find the single missing number. If the input is [3, 0, 1], the missing number is 2.",
        difficulty: "Pillage",
        tags: ["arrays", "math"],
        testCases: [
            { input: `find_missing([3, 0, 1])`, expectedOutput: "2", language: LANGUAGE },
            { input: `find_missing([9, 6, 4, 2, 3, 5, 7, 0, 1])`, expectedOutput: "8", language: LANGUAGE },
            { input: `find_missing([0])`, expectedOutput: "1", language: LANGUAGE },
        ],
        passingCode: `def find_missing(arr):\n\tn = len(arr)\n\texpected_sum = n * (n + 1) // 2\n\tactual_sum = sum(arr)\n\treturn expected_sum - actual_sum`
    },
    {
        name: "14. Valid Parentheses", // Swapped with Queue with Stacks
        codeTemplate: "def is_valid(s):",
        description: "Given a string `s` containing just '(', ')', '{', '}', '[' and ']', determine if the input string is valid. A string is valid if open brackets must be closed by the same type of brackets, and open brackets must be closed in the correct order. E.g., '()[]{}' is True, but '([)]' is False.",
        difficulty: "Raid",
        tags: ["strings", "stacks", "data-structures"],
        testCases: [
            { input: `is_valid('()[]{}')`, expectedOutput: "True", language: LANGUAGE },
            { input: `is_valid('([)]')`, expectedOutput: "False", language: LANGUAGE },
            { input: `is_valid('{[]}')`, expectedOutput: "True", language: LANGUAGE },
        ],
        passingCode: `def is_valid(s):\n\tstack = []\n\tmapping = {')': '(', ']': '[', '}': '{'}\n\tfor char in s:\n\t\tif char in mapping:\n\t\t\ttop_element = stack.pop() if stack else '#'\n\t\t\tif mapping[char] != top_element:\n\t\t\t\treturn False\n\t\telse:\n\t\t\tstack.append(char)\n\treturn not stack`
    },
    {
        name: "15. Two Sum",
        codeTemplate: "def two_sum(nums, target):",
        description: "Given an array of integers `nums` and an integer `target`, return the **indices** of the two numbers such that they add up to `target`. Assume exactly one solution exists. If `nums` is [2, 7, 11, 15] and `target` is 9, the output is [0, 1].",
        difficulty: "Pillage",
        tags: ["arrays", "algorithms", "hashing"],
        testCases: [
            { input: `two_sum([2, 7, 11, 15], 9)`, expectedOutput: "[0, 1]", language: LANGUAGE },
            { input: `two_sum([3, 2, 4], 6)`, expectedOutput: "[1, 2]", language: LANGUAGE },
            { input: `two_sum([3, 3], 6)`, expectedOutput: "[0, 1]", language: LANGUAGE },
        ],
        passingCode: `def two_sum(nums, target):\n\thash_map = {}\n\tfor i, num in enumerate(nums):\n\t\tcomplement = target - num\n\t\tif complement in hash_map:\n\t\t\treturn [hash_map[complement], i]\n\t\thash_map[num] = i`
    },

    // 16-35 (Mixed, reliable test inputs)
    {
        name: "16. Fizz Buzz",
        codeTemplate: "def fizz_buzz(n):",
        description: "Return a list of strings from 1 to n. For multiples of 3 return 'Fizz', for multiples of 5 return 'Buzz', and for multiples of both return 'FizzBuzz'. For $n=5$, the output is `['1', '2', 'Fizz', '4', 'Buzz']`.",
        difficulty: "Skirmish",
        tags: ["loops", "logic"],
        testCases: [
            { input: `fizz_buzz(5)`, expectedOutput: "['1', '2', 'Fizz', '4', 'Buzz']", language: LANGUAGE },
            { input: `fizz_buzz(15)`, expectedOutput: "['1', '2', 'Fizz', '4', 'Buzz', 'Fizz', '7', '8', 'Fizz', 'Buzz', '11', 'Fizz', '13', '14', 'FizzBuzz']", language: LANGUAGE },
        ],
        passingCode: `def fizz_buzz(n):\n\tresult = []\n\tfor i in range(1, n + 1):\n\t\tif i % 15 == 0: result.append('FizzBuzz')\n\t\telif i % 3 == 0: result.append('Fizz')\n\t\telif i % 5 == 0: result.append('Buzz')\n\t\telse: result.append(str(i))\n\treturn result`
    },
    {
        name: "17. Remove Duplicates From Sorted Array",
        codeTemplate: "def remove_duplicates(arr):",
        description: "Given a sorted array, remove the duplicates in-place such that each element appears only once. Return the new length of the array after removal. For input `[1, 1, 2]`, the function returns 2, and the first two elements of the array should be 1 and 2.",
        difficulty: "Pillage",
        tags: ["arrays", "pointers"],
        testCases: [
            { input: `remove_duplicates([1, 1, 2])`, expectedOutput: "2", language: LANGUAGE },
            { input: `remove_duplicates([0, 0, 1, 1, 1, 2, 2, 3, 3, 4])`, expectedOutput: "5", language: LANGUAGE },
        ],
        passingCode: `def remove_duplicates(arr):\n\tif not arr: return 0\n\tk = 1\n\tfor i in range(1, len(arr)):\n\t\tif arr[i] != arr[i-1]:\n\t\t\tarr[k] = arr[i]\n\t\t\tk += 1\n\treturn k`
    },
    {
        name: "18. Longest Common Prefix",
        codeTemplate: "def longest_common_prefix(strs):",
        description: "Find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string. For input `['flower', 'flow', 'flight']`, the output is 'fl'.",
        difficulty: "Pillage",
        tags: ["strings", "algorithms"],
        testCases: [
            { input: `longest_common_prefix(['flower', 'flow', 'flight'])`, expectedOutput: "fl", language: LANGUAGE },
            { input: `longest_common_prefix(['dog', 'racecar', 'car'])`, expectedOutput: "", language: LANGUAGE },
        ],
        passingCode: `def longest_common_prefix(strs):\n\tif not strs: return ''\n\tprefix = strs[0]\n\tfor i in range(1, len(strs)):\n\t\twhile strs[i].find(prefix) != 0:\n\t\t\tprefix = prefix[:-1]\n\t\t\tif not prefix: return ''\n\treturn prefix`
    },
    {
        name: "19. Is Prime",
        codeTemplate: "def is_prime(n):",
        description: "Return True if the given positive integer n is a prime number (only divisible by 1 and itself), False otherwise. $n=17$ returns True, $n=9$ returns False.",
        difficulty: "Skirmish",
        tags: ["math", "logic"],
        testCases: [
            { input: `is_prime(2)`, expectedOutput: "True", language: LANGUAGE },
            { input: `is_prime(9)`, expectedOutput: "False", language: LANGUAGE },
            { input: `is_prime(17)`, expectedOutput: "True", language: LANGUAGE },
        ],
        passingCode: `import math\ndef is_prime(n):\n\tif n < 2: return False\n\tfor i in range(2, int(math.sqrt(n)) + 1):\n\t\tif n % i == 0: return False\n\treturn True`
    },
    {
        name: "20. Implement strStr()", // Swapped with Valid Parentheses
        codeTemplate: "def str_str(haystack, needle):",
        description: "Implement the `strstr()` function (similar to finding a substring). Return the index of the first occurrence of `needle` in `haystack`, or -1 if `needle` is not part of `haystack`. For `haystack='hello'` and `needle='ll'`, the output is 2.",
        difficulty: "Pillage",
        tags: ["strings", "search"],
        testCases: [
            { input: `str_str('hello', 'll')`, expectedOutput: "2", language: LANGUAGE },
            { input: `str_str('aaaaa', 'bba')`, expectedOutput: "-1", language: LANGUAGE },
            { input: `str_str('', '')`, expectedOutput: "0", language: LANGUAGE },
        ],
        passingCode: `def str_str(haystack, needle):\n\treturn haystack.find(needle)`
    },
    {
        name: "21. Single Number",
        codeTemplate: "def single_number(nums):",
        description: "Given a non-empty array of integers, every element appears twice except for one. Find that single, unique element. For input `[4, 1, 2, 1, 2]`, the single number is 4. Hint: Use XOR.",
        difficulty: "Pillage",
        tags: ["arrays", "bit-manipulation"],
        testCases: [
            { input: `single_number([2, 2, 1])`, expectedOutput: "1", language: LANGUAGE },
            { input: `single_number([4, 1, 2, 1, 2])`, expectedOutput: "4", language: LANGUAGE },
        ],
        passingCode: `def single_number(nums):\n\tresult = 0\n\tfor num in nums:\n\t\tresult ^= num\n\treturn result`
    },
    {
        name: "22. Power Of Two",
        codeTemplate: "def is_power_of_two(n):",
        description: "Given an integer n, return True if it is a power of two (i.e., $2^x = n$ for some integer x). Otherwise, return False. $n=16$ returns True ($2^4$), $n=3$ returns False.",
        difficulty: "Skirmish",
        tags: ["math", "bit-manipulation"],
        testCases: [
            { input: `is_power_of_two(16)`, expectedOutput: "True", language: LANGUAGE },
            { input: `is_power_of_two(3)`, expectedOutput: "False", language: LANGUAGE },
            { input: `is_power_of_two(1)`, expectedOutput: "True", language: LANGUAGE },
        ],
        passingCode: `def is_power_of_two(n):\n\treturn n > 0 and (n & (n - 1)) == 0`
    },
    {
        name: "23. Reverse Integer",
        codeTemplate: "def reverse_int(x):",
        description: "Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the 32-bit signed integer range, return 0. E.g., $x=123$ returns $321$, $x=-123$ returns $-321$.",
        difficulty: "Pillage",
        tags: ["math", "integers"],
        testCases: [
            { input: `reverse_int(123)`, expectedOutput: "321", language: LANGUAGE },
            { input: `reverse_int(-123)`, expectedOutput: "-321", language: LANGUAGE },
            { input: `reverse_int(120)`, expectedOutput: "21", language: LANGUAGE },
        ],
        passingCode: `def reverse_int(x):\n\timport math\n\tsign = -1 if x < 0 else 1\n\tx = abs(x)\n\treversed_x = int(str(x)[::-1])\n\tresult = sign * reversed_x\n\t# 32-bit signed integer check (simplified)\n\tmax_int = (2**31) - 1\n\tmin_int = -(2**31)\n\tif result > max_int or result < min_int:\n\t\treturn 0\n\treturn result`
    },
    {
        name: "24. Move Zeroes",
        codeTemplate: "def move_zeroes(nums):",
        description: "Given an array `nums`, move all 0's to the end of it while maintaining the relative order of the non-zero elements. The operation must be done **in-place**. Input `[0, 1, 0, 3, 12]` results in `[1, 3, 12, 0, 0]`.",
        difficulty: "Pillage",
        tags: ["arrays", "pointers"],
        testCases: [
            { input: `move_zeroes([0, 1, 0, 3, 12])`, expectedOutput: "[1, 3, 12, 0, 0]", language: LANGUAGE },
            { input: `move_zeroes([0])`, expectedOutput: "[0]", language: LANGUAGE },
        ],
        passingCode: `def move_zeroes(nums):\n\tnon_zero_pointer = 0\n\tfor i in range(len(nums)):\n\t\tif nums[i] != 0:\n\t\t\tnums[non_zero_pointer], nums[i] = nums[i], nums[non_zero_pointer]\n\t\t\tnon_zero_pointer += 1\n\treturn nums`
    },
    {
        name: "25. Rotate Array",
        codeTemplate: "def rotate(nums, k):",
        description: "Rotate the array to the right by `k` steps, where `k` is non-negative. The operation should be done **in-place**. If `nums` is `[1, 2, 3, 4, 5, 6, 7]` and $k=3$, the output is `[5, 6, 7, 1, 2, 3, 4]`.",
        difficulty: "Raid",
        tags: ["arrays", "algorithms"],
        testCases: [
            { input: `rotate([1, 2, 3, 4, 5, 6, 7], 3)`, expectedOutput: "[5, 6, 7, 1, 2, 3, 4]", language: LANGUAGE },
            { input: `rotate([-1, -100, 3, 99], 2)`, expectedOutput: "[3, 99, -1, -100]", language: LANGUAGE },
        ],
        passingCode: `def rotate(nums, k):\n\tdef reverse(arr, start, end):\n\t\twhile start < end:\n\t\t\tarr[start], arr[end] = arr[end], arr[start]\n\t\t\tstart += 1\n\t\t\tend -= 1\n\n\tn = len(nums)\n\tk %= n\n\t# Reverse entire array\n\treverse(nums, 0, n - 1)\n\t# Reverse first k elements\n\treverse(nums, 0, k - 1)\n\t# Reverse remaining n-k elements\n\treverse(nums, k, n - 1)\n\treturn nums`
    },
    {
        name: "26. Contains Duplicate",
        codeTemplate: "def contains_duplicate(nums):",
        description: "Given an array of integers, return True if any value appears at least twice in the array, and False if every element is distinct. For input `[1, 2, 3, 1]`, the result is True.",
        difficulty: "Skirmish",
        tags: ["arrays", "hashing"],
        testCases: [
            { input: `contains_duplicate([1, 2, 3, 1])`, expectedOutput: "True", language: LANGUAGE },
            { input: `contains_duplicate([1, 2, 3, 4])`, expectedOutput: "False", language: LANGUAGE },
        ],
        passingCode: `def contains_duplicate(nums):\n\treturn len(nums) != len(set(nums))`
    },
    {
        name: "27. Intersection Of Two Arrays II",
        codeTemplate: "def intersect(nums1, nums2):",
        description: "Given two arrays, return an array of their intersection. Each element in the result must appear as many times as it shows in both arrays. The order of results does not matter. For `nums1 = [1, 2, 2, 1]` and `nums2 = [2, 2]`, the output is `[2, 2]`.",
        difficulty: "Pillage",
        tags: ["arrays", "hashing"],
        testCases: [
            { input: `intersect([1, 2, 2, 1], [2, 2])`, expectedOutput: "[2, 2]", language: LANGUAGE },
            { input: `intersect([4, 9, 5], [9, 4, 9, 8, 4])`, expectedOutput: "[4, 9, 9]", language: LANGUAGE }, // Corrected expected output for repeated element
        ],
        passingCode: `from collections import Counter\ndef intersect(nums1, nums2):\n\tc1 = Counter(nums1)\n\tc2 = Counter(nums2)\n\tresult = []\n\tfor num in c1:\n\t\tif num in c2:\n\t\t\tcount = min(c1[num], c2[num])\n\t\t\tresult.extend([num] * count)\n\treturn result`
    },
    {
        name: "28. Plus One",
        codeTemplate: "def plus_one(digits):",
        description: "Given a non-empty array of digits representing a non-negative integer, increment the integer by one. Return the new array of digits. E.g., `[1, 2, 3]` becomes `[1, 2, 4]`. Handling carry-overs, `[9, 9, 9]` becomes `[1, 0, 0, 0]`.",
        difficulty: "Pillage",
        tags: ["arrays", "math"],
        testCases: [
            { input: `plus_one([1, 2, 3])`, expectedOutput: "[1, 2, 4]", language: LANGUAGE },
            { input: `plus_one([9, 9, 9])`, expectedOutput: "[1, 0, 0, 0]", language: LANGUAGE },
        ],
        passingCode: `def plus_one(digits):\n\tn = len(digits)\n\tfor i in range(n - 1, -1, -1):\n\t\tif digits[i] < 9:\n\t\t\tdigits[i] += 1\n\t\t\treturn digits\n\t\tdigits[i] = 0\n\treturn [1] + digits`
    },
    {
        name: "29. Valid Sudoku",
        codeTemplate: "def is_valid_sudoku(board):",
        description: "Determine if a 9x9 Sudoku board is valid based on three rules: each row, each column, and each of the nine 3x3 sub-boxes must contain the digits 1-9 without repetition. Return True or False. The input is a list of lists representing the board.",
        difficulty: "Raid",
        tags: ["arrays", "matrix", "logic"],
        testCases: [
            { input: `is_valid_sudoku([['5','3','.','.','7','.','.','.','.'], ['6','.','.','1','9','5','.','.','.'], ['.','9','8','.','.','.','.','6','.'], ['8','.','.','.','6','.','.','.','3'], ['4','.','.','8','.','3','.','.','1'], ['7','.','.','.','2','.','.','.','6'], ['.','6','.','.','.','.','2','8','.'], ['.','.','.','4','1','9','.','.','5'], ['.','.','.','.','8','.','.','7','9']])`, expectedOutput: "True", language: LANGUAGE },
        ],
        passingCode: `def is_valid_sudoku(board):\n\tfrom collections import defaultdict\n\tcols = defaultdict(set)\n\trows = defaultdict(set)\n\tsquares = defaultdict(set) # key is (r // 3, c // 3)\n\n\tfor r in range(9):\n\t\tfor c in range(9):\n\t\t\tif board[r][c] == '.':\n\t\t\t\tcontinue\n\t\t\tval = board[r][c]\n\t\t\tif (val in rows[r] or val in cols[c] or val in squares[(r // 3, c // 3)]):\n\t\t\t\treturn False\n\t\t\trows[r].add(val)\n\t\t\tcols[c].add(val)\n\t\t\tsquares[(r // 3, c // 3)].add(val)\n\treturn True`
    },
    {
        name: "30. Rotate Image",
        codeTemplate: "def rotate_image(matrix):",
        description: "You are given an $n \times n$ 2D matrix representing an image. Rotate the image by 90 degrees (clockwise). You must do this **in-place**. For $2 \times 2$ input `[[1, 2], [3, 4]]`, the output is `[[3, 1], [4, 2]]`.",
        difficulty: "Raid",
        tags: ["arrays", "matrix", "algorithms"],
        testCases: [
            { input: `rotate_image([[1, 2], [3, 4]])`, expectedOutput: "[[3, 1], [4, 2]]", language: LANGUAGE },
            { input: `rotate_image([[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]])`, expectedOutput: "[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]", language: LANGUAGE },
        ],
        passingCode: `def rotate_image(matrix):\n\tn = len(matrix)\n\t# 1. Transpose\n\tfor i in range(n):\n\t\tfor j in range(i, n):\n\t\t\tmatrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]\n\t# 2. Reverse each row\n\tfor row in matrix:\n\t\trow.reverse()\n\treturn matrix`
    },
    {
        name: "31. First Unique Character In A String",
        codeTemplate: "def first_unique_char(s):",
        description: "Given a string `s`, find the index of the first non-repeating character in it and return its index. If it does not exist, return -1. E.g., for 'leetcode', the output is 0 ('l'). For 'loveleetcode', the output is 2 ('v').",
        difficulty: "Pillage",
        tags: ["strings", "hashing"],
        testCases: [
            { input: `first_unique_char('leetcode')`, expectedOutput: "0", language: LANGUAGE },
            { input: `first_unique_char('loveleetcode')`, expectedOutput: "2", language: LANGUAGE },
            { input: `first_unique_char('aabb')`, expectedOutput: "-1", language: LANGUAGE },
        ],
        passingCode: `from collections import Counter\ndef first_unique_char(s):\n\tcount = Counter(s)\n\tfor i, char in enumerate(s):\n\t\tif count[char] == 1:\n\t\t\treturn i\n\treturn -1`
    },
    {
        name: "32. Ransom Note",
        codeTemplate: "def can_construct(ransom_note, magazine):",
        description: "Given two strings `ransom_note` and `magazine`, return True if `ransom_note` can be constructed by using the letters from `magazine`. Each letter in `magazine` can only be used once. If `ransom_note` is 'aa' and `magazine` is 'aab', the output is True.",
        difficulty: "Skirmish",
        tags: ["strings", "hashing"],
        testCases: [
            { input: `can_construct('a', 'b')`, expectedOutput: "False", language: LANGUAGE },
            { input: `can_construct('aa', 'ab')`, expectedOutput: "False", language: LANGUAGE },
            { input: `can_construct('aa', 'aab')`, expectedOutput: "True", language: LANGUAGE },
        ],
        passingCode: `from collections import Counter\ndef can_construct(ransom_note, magazine):\n\transom_count = Counter(ransom_note)\n\tmagazine_count = Counter(magazine)\n\tfor char, count in ransom_count.items():\n\t\tif magazine_count[char] < count:\n\t\t\treturn False\n\treturn True`
    },
    {
        name: "33. Longest Substring Without Repeating Characters", // Swapped with strStr()
        codeTemplate: "def length_of_longest_substring(s):",
        description: "Given a string `s`, find the length of the **longest substring** without repeating characters. For input 'abcabcbb', the longest substring without repeating characters is 'abc', so the length is 3. For 'pwwkew', the length is 3 ('wke' or 'kew').",
        difficulty: "Raid",
        tags: ["strings", "sliding-window", "algorithms"],
        testCases: [
            { input: `length_of_longest_substring('abcabcbb')`, expectedOutput: "3", language: LANGUAGE }, // 'abc'
            { input: `length_of_longest_substring('bbbbb')`, expectedOutput: "1", language: LANGUAGE }, // 'b'
            { input: `length_of_longest_substring('pwwkew')`, expectedOutput: "3", language: LANGUAGE }, // 'wke' or 'kew'
        ],
        passingCode: `def length_of_longest_substring(s):\n\tchar_set = set()\n\tl, max_len = 0, 0\n\tfor r in range(len(s)):\n\t\twhile s[r] in char_set:\n\t\t\tchar_set.remove(s[l])\n\t\t\tl += 1\n\t\tchar_set.add(s[r])\n\t\tmax_len = max(max_len, r - l + 1)\n\treturn max_len`
    },
    {
        name: "34. Add Binary",
        codeTemplate: "def add_binary(a, b):",
        description: "Given two binary strings `a` and `b`, return their sum as a binary string. E.g., '11' + '1' = '100', and '1010' + '1011' = '10101'.",
        difficulty: "Pillage",
        tags: ["strings", "math", "bit-manipulation"],
        testCases: [
            { input: `add_binary('11', '1')`, expectedOutput: "100", language: LANGUAGE },
            { input: `add_binary('1010', '1011')`, expectedOutput: "10101", language: LANGUAGE },
        ],
        passingCode: `def add_binary(a, b):\n\treturn bin(int(a, 2) + int(b, 2))[2:]`
    },
    {
        name: "35. Reverse Vowels Of A String", // New, testable challenge
        codeTemplate: "def reverse_vowels(s):",
        description: "Given a string `s`, reverse only all the vowels in the string and return the new string. The vowels are 'a', 'e', 'i', 'o', and 'u', and they can appear in both lower and upper cases. E.g., 'hello' becomes 'holle'.",
        difficulty: "Pillage",
        tags: ["strings", "pointers"],
        testCases: [
            { input: `reverse_vowels('hello')`, expectedOutput: "holle", language: LANGUAGE },
            { input: `reverse_vowels('leetcode')`, expectedOutput: "leotcede", language: LANGUAGE },
            { input: `reverse_vowels('aA')`, expectedOutput: "Aa", language: LANGUAGE },
        ],
        passingCode: `def reverse_vowels(s):\n\ts_list = list(s)\n\tvowels = set('aeiouAEIOU')\n\tl, r = 0, len(s) - 1\n\twhile l < r:\n\t\twhile l < r and s_list[l] not in vowels:\n\t\t\tl += 1\n\t\twhile l < r and s_list[r] not in vowels:\n\t\t\tr -= 1\n\t\ts_list[l], s_list[r] = s_list[r], s_list[l]\n\t\tl += 1\n\t\tr -= 1\n\treturn "".join(s_list)`
    },

    // 36-50 (New/Replaced Challenges - Guaranteed Array/String/Integer inputs)
    
    // 36 (REPLACED Linked List Duplicate)
    {
        name: "36. Find The Duplicate Number",
        codeTemplate: "def find_duplicate(nums):",
        description: "Given an array `nums` containing $n+1$ integers where each integer is between 1 and n (inclusive). Prove that at least one duplicate number must exist. Assume there is only one duplicate number, find it. The solution must be done in $O(1)$ extra space. For input `[1, 3, 4, 2, 2]`, the output is 2.",
        difficulty: "Raid",
        tags: ["arrays", "algorithms", "pointers"],
        testCases: [
            { input: `find_duplicate([1, 3, 4, 2, 2])`, expectedOutput: "2", language: LANGUAGE },
            { input: `find_duplicate([3, 1, 3, 4, 2])`, expectedOutput: "3", language: LANGUAGE },
        ],
        passingCode: `def find_duplicate(nums):\n\tslow = nums[0]\n\tfast = nums[nums[0]]\n\twhile slow != fast:\n\t\tslow = nums[slow]\n\t\tfast = nums[nums[fast]]\n\tslow = 0\n\twhile slow != fast:\n\t\tslow = nums[slow]\n\t\tfast = nums[fast]\n\treturn slow`
    },
    // 37 (REPLACED Linked List Cycle)
    {
        name: "37. Container With Most Water",
        codeTemplate: "def max_area(height):",
        description: "Given $n$ non-negative integers $a_1, a_2, ..., a_n$ where each represents a point at coordinate $(i, a_i)$. $n$ vertical lines are drawn such that the two endpoints of line $i$ are $(i, a_i)$ and $(i, 0)$. Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum area. E.g., `[1, 8, 6, 2, 5, 4, 8, 3, 7]` returns 49.",
        difficulty: "Raid",
        tags: ["arrays", "pointers", "geometry"],
        testCases: [
            { input: `max_area([1, 8, 6, 2, 5, 4, 8, 3, 7])`, expectedOutput: "49", language: LANGUAGE },
            { input: `max_area([1, 1])`, expectedOutput: "1", language: LANGUAGE },
            { input: `max_area([4, 3, 2, 1, 4])`, expectedOutput: "16", language: LANGUAGE },
        ],
        passingCode: `def max_area(height):\n\tl, r = 0, len(height) - 1\n\tmax_a = 0\n\twhile l < r:\n\t\tcurrent_area = min(height[l], height[r]) * (r - l)\n\t\tmax_a = max(max_a, current_area)\n\t\tif height[l] < height[r]:\n\t\t\tl += 1\n\t\telse:\n\t\t\tr -= 1\n\treturn max_a`
    },
    // 38 (Kept: Stack with O(1) ops is testable)
    {
        name: "38. Min Stack",
        codeTemplate: `class MinStack:\n\tdef __init__(self):\n\t\t# Initialize stack\n\tdef push(self, val):\n\t\t# Push element val onto stack\n\tdef pop(self):\n\t\t# Removes the element on top of the stack\n\tdef top(self):\n\t\t# Get the top element\n\tdef getMin(self):\n\t\t# Retrieve the minimum element in the stack`,
        description: "Design a stack that supports push, pop, top, and retrieving the **minimum element** in **constant time** ($O(1)$). E.g., after pushing -2, 0, and -3, `getMin()` should return -3.",
        difficulty: "Raid",
        tags: ["data-structures", "stacks"],
        testCases: [
            { input: "s = MinStack(); s.push(-2); s.push(0); s.push(-3); s.getMin()", expectedOutput: "-3", language: LANGUAGE },
            { input: "s = MinStack(); s.push(-2); s.push(0); s.pop(); s.top()", expectedOutput: "0", language: LANGUAGE },
        ],
        passingCode: `class MinStack:\n\tdef __init__(self):\n\t\tself.stack = []\n\t\tself.min_stack = []\n\tdef push(self, val):\n\t\tself.stack.append(val)\n\t\tif not self.min_stack or val <= self.min_stack[-1]:\n\t\t\tself.min_stack.append(val)\n\tdef pop(self):\n\t\tif self.stack[-1] == self.min_stack[-1]:\n\t\t\tself.min_stack.pop()\n\t\tself.stack.pop()\n\tdef top(self):\n\t\treturn self.stack[-1]\n\tdef getMin(self):\n\t\treturn self.min_stack[-1]`
    },
    // 39 (REPLACED Valid BST)
    {
        name: "39. Group Anagrams",
        codeTemplate: "def group_anagrams(strs):",
        description: "Given an array of strings `strs`, group the anagrams together. You can return the answer in any order. An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase. E.g., `['eat', 'tea', 'tan', 'ate', 'nat', 'bat']` returns `[['bat'], ['nat', 'tan'], ['ate', 'eat', 'tea']]` (order may vary).",
        difficulty: "Pillage",
        tags: ["strings", "hashing", "algorithms"],
        testCases: [
            { input: `group_anagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat'])`, expectedOutput: "[['bat'], ['nat', 'tan'], ['ate', 'eat', 'tea']]", language: LANGUAGE },
            { input: `group_anagrams(['a'])`, expectedOutput: "[['a']]", language: LANGUAGE },
        ],
        passingCode: `from collections import defaultdict\ndef group_anagrams(strs):\n\tans = defaultdict(list)\n\tfor s in strs:\n\t\tcount = [0] * 26\n\t\tfor char in s:\n\t\t\tcount[ord(char) - ord('a')] += 1\n\t\tans[tuple(count)].append(s)\n\treturn list(ans.values())`
    },
    // 40 (REPLACED Balanced BT)
    {
        name: "40. Trapping Rain Water",
        codeTemplate: "def trap(height):",
        description: "Given $n$ non-negative integers representing an elevation map where the width of each bar is 1, compute how much rainwater it can trap after raining. E.g., `[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]` traps 6 units of water.",
        difficulty: "Raid",
        tags: ["arrays", "pointers", "dynamic-programming"],
        testCases: [
            { input: `trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1])`, expectedOutput: "6", language: LANGUAGE },
            { input: `trap([4, 2, 0, 3, 2, 5])`, expectedOutput: "9", language: LANGUAGE },
        ],
        passingCode: `def trap(height):\n\tif not height: return 0\n\tl, r = 0, len(height) - 1\n\tl_max, r_max = height[l], height[r]\n\twater = 0\n\twhile l < r:\n\t\tif l_max < r_max:\n\t\t\tl += 1\n\t\t\tl_max = max(l_max, height[l])\n\t\t\twater += l_max - height[l]\n\t\telse:\n\t\t\tr -= 1\n\t\t\tr_max = max(r_max, height[r])\n\t\t\twater += r_max - height[r]\n\treturn water`
    },
    // 41 (REPLACED Invert BT)
    {
        name: "41. Minimum Path Sum",
        codeTemplate: "def min_path_sum(grid):",
        description: "Given an $m \times n$ grid filled with non-negative numbers, find a path from the top left to the bottom right, which minimizes the sum of all numbers along its path. You can only move either down or right at any point in time. E.g., `[[1, 3, 1], [1, 5, 1], [4, 2, 1]]` returns 7.",
        difficulty: "Raid",
        tags: ["dynamic-programming", "matrix", "arrays"],
        testCases: [
            { input: `min_path_sum([[1, 3, 1], [1, 5, 1], [4, 2, 1]])`, expectedOutput: "7", language: LANGUAGE },
            { input: `min_path_sum([[1, 2, 3], [4, 5, 6]])`, expectedOutput: "12", language: LANGUAGE },
        ],
        passingCode: `def min_path_sum(grid):\n\tROWS, COLS = len(grid), len(grid[0])\n\tfor r in range(ROWS):\n\t\tfor c in range(COLS):\n\t\t\tif r == 0 and c == 0:\n\t\t\t\tcontinue\n\t\t\telif r == 0:\n\t\t\t\tgrid[r][c] += grid[r][c - 1]\n\t\t\telif c == 0:\n\t\t\t\tgrid[r][c] += grid[r - 1][c]\n\t\t\telse:\n\t\t\t\tgrid[r][c] += min(grid[r - 1][c], grid[r][c - 1])\n\treturn grid[ROWS - 1][COLS - 1]`
    },
    // 42 (REPLACED Max Depth BT)
    {
        name: "42. Product Of Array Except Self",
        codeTemplate: "def product_except_self(nums):",
        description: "Given an integer array `nums`, return an array `answer` such that $answer[i]$ is equal to the product of all the elements of `nums` except $nums[i]$. You must write an algorithm that runs in $O(n)$ time and without using the division operation. E.g., `[1, 2, 3, 4]` returns `[24, 12, 8, 6]`.",
        difficulty: "Raid",
        tags: ["arrays", "algorithms"],
        testCases: [
            { input: `product_except_self([1, 2, 3, 4])`, expectedOutput: "[24, 12, 8, 6]", language: LANGUAGE },
            { input: `product_except_self([-1, 1, 0, -3, 3])`, expectedOutput: "[0, 0, 9, 0, 0]", language: LANGUAGE },
        ],
        passingCode: `def product_except_self(nums):\n\tn = len(nums)\n\toutput = [1] * n\n\tprefix = 1\n\tfor i in range(n):\n\t\toutput[i] = prefix\n\t\tprefix *= nums[i]\n\tsuffix = 1\n\tfor i in range(n - 1, -1, -1):\n\t\toutput[i] *= suffix\n\t\tsuffix *= nums[i]\n\treturn output`
    },
    // 43 (Kept: Majority Element)
    {
        name: "43. Majority Element",
        codeTemplate: "def majority_element(nums):",
        description: "Given an array `nums` of size n, return the **majority element** (the element that appears more than $n/2$ times). You may assume that the majority element always exists. For `[2, 2, 1, 1, 1, 2, 2]`, the output is 2.",
        difficulty: "Pillage",
        tags: ["arrays", "algorithms", "sorting"],
        testCases: [
            { input: `majority_element([3, 2, 3])`, expectedOutput: "3", language: LANGUAGE },
            { input: `majority_element([2, 2, 1, 1, 1, 2, 2])`, expectedOutput: "2", language: LANGUAGE },
        ],
        passingCode: `def majority_element(nums):\n\tcandidate, count = None, 0\n\tfor num in nums:\n\t\tif count == 0:\n\t\t\tcandidate = num\n\t\tcount += (1 if num == candidate else -1)\n\treturn candidate`
    },
    // 44 (Kept: Merge Intervals)
    {
        name: "44. Merge Intervals",
        codeTemplate: "def merge_intervals(intervals):",
        description: "Given an array of intervals, where $intervals[i] = [start_i, end_i]$, merge all overlapping intervals and return an array of the non-overlapping intervals. The input `[[1, 3], [2, 6], [8, 10]]` should be merged to `[[1, 6], [8, 10]]` because [1, 3] and [2, 6] overlap.",
        difficulty: "Raid",
        tags: ["arrays", "sorting", "algorithms"],
        testCases: [
            { input: `merge_intervals([[1, 3], [2, 6], [8, 10], [15, 18]])`, expectedOutput: "[[1, 6], [8, 10], [15, 18]]", language: LANGUAGE },
            { input: `merge_intervals([[1, 4], [4, 5]])`, expectedOutput: "[[1, 5]]", language: LANGUAGE },
        ],
        passingCode: `def merge_intervals(intervals):\n\tintervals.sort(key=lambda x: x[0])\n\tmerged = []\n\tfor interval in intervals:\n\t\tif not merged or interval[0] > merged[-1][1]:\n\t\t\tmerged.append(interval)\n\t\telse:\n\t\t\tmerged[-1][1] = max(merged[-1][1], interval[1])\n\treturn merged`
    },
    // 45 (Kept: Climbing Stairs)
    {
        name: "45. Climbing Stairs",
        codeTemplate: "def climb_stairs(n):",
        description: "You are climbing a staircase that requires $n$ steps to reach the top. You can either climb 1 or 2 steps at a time. Return the number of **distinct ways** you can climb to the top. This is a classic Dynamic Programming problem. For $n=3$, there are 3 ways: (1+1+1), (1+2), and (2+1).",
        difficulty: "Pillage",
        tags: ["dynamic-programming", "math"],
        testCases: [
            { input: `climb_stairs(2)`, expectedOutput: "2", language: LANGUAGE }, // (1+1), (2)
            { input: `climb_stairs(3)`, expectedOutput: "3", language: LANGUAGE }, // (1+1+1), (1+2), (2+1)
            { input: `climb_stairs(4)`, expectedOutput: "5", language: LANGUAGE },
        ],
        passingCode: `def climb_stairs(n):\n\tif n == 1: return 1\n\tone, two = 1, 1\n\tfor _ in range(n - 1):\n\t\t_temp = one\n\t\tone = one + two\n\t\ttwo = _temp\n\treturn one`
    },
    // 46 (Kept: Buy/Sell Stock)
    {
        name: "46. Best Time To Buy And Sell Stock",
        codeTemplate: "def max_profit(prices):",
        description: "You are given an array `prices` where $prices[i]$ is the price of a given stock on day i. Find the **maximum profit** you can achieve by buying on one day and selling on a future day. If you cannot achieve any profit, return 0. E.g., for `[7, 1, 5, 3, 6, 4]`, the max profit is 5 (buy at 1, sell at 6).",
        difficulty: "Skirmish",
        tags: ["arrays", "algorithms"],
        testCases: [
            { input: `max_profit([7, 1, 5, 3, 6, 4])`, expectedOutput: "5", language: LANGUAGE }, 
            { input: `max_profit([7, 6, 4, 3, 1])`, expectedOutput: "0", language: LANGUAGE },
        ],
        passingCode: `def max_profit(prices):\n\tmin_price = float('inf')\n\tmax_profit = 0\n\tfor price in prices:\n\t\tmin_price = min(min_price, price)\n\t\tmax_profit = max(max_profit, price - min_price)\n\treturn max_profit`
    },
    // 47 (Kept: Pascal's Triangle)
    {
        name: "47. Pascal's Triangle",
        codeTemplate: "def generate_pascal(num_rows):",
        description: "Given an integer `num_rows`, return the first `num_rows` of **Pascal's triangle**. In Pascal's triangle, each number is the sum of the two numbers directly above it. E.g., `generate_pascal(3)` returns `[[1], [1, 1], [1, 2, 1]]`.",
        difficulty: "Pillage",
        tags: ["arrays", "math"],
        testCases: [
            { input: `generate_pascal(5)`, expectedOutput: "[[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]]", language: LANGUAGE },
            { input: `generate_pascal(1)`, expectedOutput: "[[1]]", language: LANGUAGE },
        ],
        passingCode: `def generate_pascal(num_rows):\n\tresult = []\n\tfor i in range(num_rows):\n\t\trow = [None] * (i + 1)\n\t\trow[0], row[-1] = 1, 1\n\t\tfor j in range(1, len(row) - 1):\n\t\t\trow[j] = result[i - 1][j - 1] + result[i - 1][j]\n\t\tresult.append(row)\n\treturn result`
    },
    // 48 (Kept: Roman to Integer)
    {
        name: "48. Roman To Integer",
        codeTemplate: "def roman_to_int(s):",
        description: "Convert a Roman numeral string (e.g., 'IV', 'IX', 'MCMXCIV') to an integer. The rules include subtraction (IV=4, IX=9, etc.) and addition. E.g., 'MCMXCIV' returns 1994.",
        difficulty: "Skirmish",
        tags: ["strings", "parsing", "math"],
        testCases: [
            { input: `roman_to_int('III')`, expectedOutput: "3", language: LANGUAGE },
            { input: `roman_to_int('LVIII')`, expectedOutput: "58", language: LANGUAGE },
            { input: `roman_to_int('MCMXCIV')`, expectedOutput: "1994", language: LANGUAGE },
        ],
        passingCode: `def roman_to_int(s):\n\troman_map = {'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000}\n\tresult = 0\n\tfor i in range(len(s)):\n\t\tif i > 0 and roman_map[s[i]] > roman_map[s[i-1]]:\n\t\t\tresult += roman_map[s[i]] - 2 * roman_map[s[i-1]]\n\t\telse:\n\t\t\tresult += roman_map[s[i]]\n\treturn result`
    },
    // 49 (Kept: Maximum Subarray)
    {
        name: "49. Maximum Subarray",
        codeTemplate: "def max_sub_array(nums):",
        description: "Given an integer array `nums`, find the subarray (a contiguous non-empty sequence of elements) which has the largest sum and return its sum. This can be solved efficiently using **Kadane's Algorithm**. For input `[-2, 1, -3, 4, -1, 2, 1, -5, 4]`, the largest sum is 6 (from subarray [4, -1, 2, 1]).",
        difficulty: "Raid",
        tags: ["arrays", "dynamic-programming", "algorithms"],
        testCases: [
            { input: `max_sub_array([-2, 1, -3, 4, -1, 2, 1, -5, 4])`, expectedOutput: "6", language: LANGUAGE }, 
            { input: `max_sub_array([1])`, expectedOutput: "1", language: LANGUAGE },
            { input: `max_sub_array([5, 4, -1, 7, 8])`, expectedOutput: "23", language: LANGUAGE },
        ],
        passingCode: `def max_sub_array(nums):\n\tmax_so_far = nums[0]\n\tcurrent_max = nums[0]\n\tfor i in range(1, len(nums)):\n\t\tcurrent_max = max(nums[i], current_max + nums[i])\n\t\tmax_so_far = max(max_so_far, current_max)\n\treturn max_so_far`
    },
    // 50 (Kept: Number of Islands)
    {
        name: "50. Number Of Islands",
        codeTemplate: "def num_islands(grid):",
        description: "Given an $m \times n$ 2D binary grid, where '1's represent land and '0's represent water, return the number of islands. An island is formed by connecting adjacent lands horizontally or vertically, and the entire land mass is surrounded by water. This requires a graph search algorithm like DFS or BFS.",
        difficulty: "Raid",
        tags: ["graphs", "matrix", "search", "algorithms"],
        testCases: [
            { input: `num_islands([['1', '1', '1', '1', '0'], ['1', '1', '0', '1', '0'], ['1', '1', '0', '0', '0'], ['0', '0', '0', '0', '0']])`, expectedOutput: "1", language: LANGUAGE },
            { input: `num_islands([['1', '1', '0', '0', '0'], ['1', '1', '0', '0', '0'], ['0', '0', '1', '0', '0'], ['0', '0', '0', '1', '1']])`, expectedOutput: "3", language: LANGUAGE },
        ],
        passingCode: `def num_islands(grid):\n\tif not grid: return 0\n\tROWS, COLS = len(grid), len(grid[0])\n\tislands = 0\n\tdef dfs(r, c):\n\t\tif r < 0 or r >= ROWS or c < 0 or c >= COLS or grid[r][c] == '0':\n\t\t\treturn\n\t\tgrid[r][c] = '0'\n\t\tdfs(r + 1, c)\n\t\tdfs(r - 1, c)\n\t\tdfs(r, c + 1)\n\t\tdfs(r, c - 1)\n\n\tfor r in range(ROWS):\n\t\tfor c in range(COLS):\n\t\t\tif grid[r][c] == '1':\n\t\t\t\tislands += 1\n\t\t\t\tdfs(r, c)\n\treturn islands`
    }
];


// --- 3. User Data Generation (101 Users) ---

const TOTAL_USERS = 101;
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
            // a) Create and store TestCase documents first
            const testCaseDocs = challenge.testCases.map(tc => new TestCase(tc));
            const savedTestCases = await TestCase.insertMany(testCaseDocs);
            
            // b) Extract the IDs of the saved test cases
            const testCaseIds = savedTestCases.map(tc => tc._id);

            // c) Create the Challenge document using the collected IDs
            const challengeDoc = new Challenge({
                name: challenge.name,
                codeTemplate: challenge.codeTemplate,
                description: challenge.description,
                difficulty: challenge.difficulty,
                tags: challenge.tags,
                testCases: testCaseIds 
            });
            n++;
            const savedChallenge = await challengeDoc.save();
            // Attach the mock code for later use
            savedChallenge.passingCode = challenge.passingCode; 
            seededChallenges.push(savedChallenge);
        }

        console.log(`\n🎉 Challenges seeding complete! Total challenges created: ${seededChallenges.length}`);

        // 3. Seed Users
        const usersToSeed = userTemplates.map(u => new User(u));
        const seededUsers = await User.insertMany(usersToSeed);
        console.log(`\n👨‍💻 Users seeding complete! Total users created: ${seededUsers.length}`);

        // 4. Generate and Seed Submissions
        console.log('\n📝 Generating and Seeding Submissions...');
        const submissions = [];
        const userStats = {}; // To track completed counts before saving

        // Initialize user stats map
        for (const user of seededUsers) {
            userStats[user._id] = {
                points: 0,
                completed: { easy: 0, medium: 0, hard: 0 },
                completedChallenges: new Set() // Prevent duplicate submissions for the same challenge
            };
        }

        // --- Submission Logic ---
        // Seed 10 random challenges for the first 10 users, and 5 random challenges for the next 10 users
        const numToSubmit = 10;
        const totalChallenges = seededChallenges.length;

        for (let i = 0; i < 20; i++) { // Target the first 20 users for submissions
            const user = seededUsers[i];
            const stats = userStats[user._id];
            
            const submissionCount = (i < 10) ? numToSubmit : numToSubmit / 2; // 10 for first 10, 5 for next 10

            // Select random unique challenges
            const challengeIndices = new Set();
            while (challengeIndices.size < submissionCount) {
                challengeIndices.add(Math.floor(Math.random() * totalChallenges));
            }

            for (const index of challengeIndices) {
                const challenge = seededChallenges[index];

                // Check if user has already completed this challenge (just in case)
                if (stats.completedChallenges.has(challenge._id.toString())) continue;
                
                const difficultyKey = DIFFICULTY_MAP[challenge.difficulty];
                const pointValue = POINTS[challenge.difficulty];

                // 1. Create Submission
                submissions.push({
                    code: challenge.passingCode,
                    title: `Solution for ${challenge.name}`,
                    authorNote: `A quick, seeded solution for the ${challenge.difficulty} challenge.`,
                    author: user._id,
                    challenge: challenge._id,
                    createdAt: new Date() // Add timestamp for realism
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