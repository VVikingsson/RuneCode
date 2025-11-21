const fs = require('node:fs');
const path = require('path');
const { spawn } = require("child_process"); // child_process is a module that allows us to run shell commands through js
// nodejs.org/api/child_process.html

async function devTest() {
    const userCode = `def add(x,y):
    return x+y`;
    const language = 'python';
    let testCases = [{input: "add(3,5)", expectedOutput: "8", language: "python" }, {input: "add(15,4)", expectedOutput: "19", language: "python"}, {input: "add(-9,-9)", expectedOutput: "-18", language: "python"}]

    
    const {result, passed} = await containerizeAndTestCode(userCode, testCases, language);
    console.log("RESULT: " + result);
}

async function containerizeAndTestCode(userCode, testCases, language) {
    // Compose code and define 
    let suffix;
    let code;
    let runtime;
    if (language.toLowerCase() === 'python') {
        code = composePythonCode(userCode);
        suffix = 'py';
        runtime = 'python3';
    } else if (language.toLowerCase() === 'javascript') {
        code = composeJavascriptCode(userCode);
        suffix = 'js';
        runtime = 'node';
    }

    testCases = parseTestCases(testCases);

    const {tempDir, filePath, fileName} = await createFilePath(suffix);
    await fs.promises.writeFile(filePath, code);

    const {input, expectedOutput} = testCases;
    const numberOfCases = input.length;

    const {containerOutput, containerError, num} = await runInContainer(tempDir, fileName, input, runtime);
    let outPutList = containerOutput.trim().split('\n'); // Remove last \n from output and listify output
    const testResults = outPutList.slice(outPutList.length - input.length) // Remove any potential user prints

    let result = 'All ' + numberOfCases + ' tests pass.';
    let passed = true;
    
    for (let i = 0; i < testResults.length; i++) {
        if (testResults[i] != expectedOutput[i]) {
            result = 'Failed: ' + i + ' tests passed before ' + input[i] + ' returned ' + testResults[i] + ', expected ' + expectedOutput[i] + '.';
            passed = false;
            break;
        }
    }
    // TODO: Container not actually running OR container not producing any output
    console.log(containerOutput);
    console.log(containerError);
    deleteDirIfExists(tempDir);
    return {result, passed};
}

async function runInContainer(tempDir, fileName, testCaseInput, runtime) {
    // The return value of this function will be a 'pending promise' untill it gets resolved.
    // Resolving the promise provides the result asynchronously, similar to returning a value in a synchronous function.
    return new Promise((resolve, reject) => {

        // Run the container
        const process = spawn("docker", [
            "run",
            "--rm",
            "--network=none",
            "-v", `${tempDir}:/sandbox`, // Make the folder at tempDir appear in the container at /sandbox.
            "-i", // Keeps stdin open so we can write input to the container
            "group05_sandbox:latest",    // Choose image (this is our image resulting from docker build on our Dockerfile)
            runtime,
            `/sandbox/${fileName}` // Execute the python/js file
        ]);

        // Variables for collecting output
        let containerOutput = "";
        let containerError = "";

        // On the event that something is printed to the standard output stream in this process, save it to our variables
        process.stdout.on("data", data => containerOutput += data.toString());
        process.stderr.on("data", data => containerError += data.toString());

        // Feed test cases to the program through the standard input stream
        for (const testCase of testCaseInput) {
            process.stdin.write(testCase + "\n");
        }

        // Send EOF (end of file) to the process. This signals to the process not to wait for more input, 
        // so it indirectly ends the process.
        process.stdin.end();

        // When the container exits, resolve the promise with the captured output
        process.on("close", () => {
            resolve({ containerOutput, containerError});
        });
    });
}

function deleteDirIfExists(dir) {
    fs.rm(dir, { recursive: true, force: true }, (err) => {
    if (err) throw err
    console.log('Directory deleted successfully')
    });
}

function parseTestCases(testCases) {
    let inputs = [];
    let expectedOutputs = []
    for (testCase of testCases) {
        inputs.push(testCase.input);
        expectedOutputs.push(testCase.expectedOutput);
    }
    testCases = {input: inputs, expectedOutput: expectedOutputs};
    return testCases;
}

async function createFilePath(suffix) {
    const fileName = 'script.' + suffix;
    const tempDir = path.join(__dirname, "temp", Date.now().toString());
    console.log(tempDir);
    fs.mkdirSync(tempDir, { recursive: true });
    const filePath = path.join(tempDir, fileName);
    return {tempDir, filePath, fileName};
}

function composePythonCode(userCode) {
    const pythonWrapper = `
import sys
# We have to make sure to grab only the returned values and ignore any other prints.
# Therefore, make it predictable by ensuring the relevant prints are always the last prints.
to_print = []
for line in sys.stdin:
    to_print.append(eval(line))

for val in to_print:
    print(val)
`;

    return userCode + pythonWrapper;
}

// Not yet implemented
function composeJavascriptCode(userCode) {
    const jsWrapperTop = 'To be defined';
    const jsWrapperBot = 'To be defined';

    return jsWrapperTop + userCode + jsWrapperBot;
}

module.exports = {containerizeAndTestCode}