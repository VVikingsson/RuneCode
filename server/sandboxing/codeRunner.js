const fs = require('node:fs');
const path = require('path');
const { spawn } = require("child_process");
const { builtinModules } = require('node:module');

async function devTest() {
    const userCode = `def add(x,y):
    return x+y`;
    const language = 'python';
    let testCases = [{input: "add(3,5)", expectedOutput: "8", language: "python" }, {input: "add(15,4)", expectedOutput: "19", language: "python"}, {input: "add(-9,-9)", expectedOutput: "-18", language: "python"}]

    let inputs = [];
    let expectedOutputs = []
    for (testCase of testCases) {
        inputs.push(testCase.input);
        expectedOutputs.push(testCase.expectedOutput);
    }

    testCases = {input: inputs, expectedOutput: expectedOutputs};

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

    const {tempDir, filePath, fileName} = await createFilePath(suffix);
    await fs.promises.writeFile(filePath, code);

    const {input, expectedOutput} = testCases;
    const numberOfCases = input.length
    // What if error in container?
    const {containerOutput, containerError} = await runInContainer(tempDir, fileName, input, runtime);
    const totalLength = containerOutput.length;
    let result = 'All ' + numberOfCases + ' tests pass.';
    let passed = true;
    for (let i = totalLength - numberOfCases; i < totalLength; i++) {
        if (containerOutput[i] != expectedOutput[i - (totalLength - numberOfCases)]) {
            result = 'Failed: ' + i + ' tests passed before ' + testCases[i] + ' returned ' + containerOutput[i] + ', expected ' + expectedOutput[i] + '.';
            passed = false;
            break;
        }
    }
    // TODO: Container not actually running OR container not producing any output
    console.log(containerOutput);
    console.log(containerError);
    return {result, passed};
}

async function runInContainer(tempDir, fileName, testCaseInput, runtime) {
    // Return a promise that will eventually be resolved
    return new Promise((resolve, reject) => {

        // Run the container
        const process = spawn("docker", [
            "run",
            "--network=none",
            "-v", `${tempDir}:/sandbox`, // Mount the volume (add folder to container)
            "group05_sandbox:latest",    // Choose image (this is our image resulting from docker build on our Dockerfile)
            runtime,
            `/sandbox/${fileName}` // Execute the file
        ]);

        // Collect output
        let containerOutput = [];
        let containerError = "";

        process.stdout.on("data", data => containerOutput.push(data.toString()));
        process.stderr.on("data", data => containerError += data.toString());

        // Feed test cases to the program
        for (const testCase of testCaseInput) {
            process.stdin.write(testCase + "\n");
        }
        process.stdin.end();

        process.on("close", () => {
            // When the container finishes execution, resolve the promise
            resolve({ containerOutput, containerError});
        });
    });
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
    // Code wrappers
    const pythonWrapper = `
import sys
# We have to make sure to grab only the returned values and ignore any other prints.
# Therefore, make it predictable by ensuring the relevant prints are always the last prints.
to_print = []
for line in sys.stdin:
    to_print.append(eval(line))

for val in to_print:
    print(val)
    
open("./maybe.txt", "w")`;

    return userCode + pythonWrapper;
}

function composeJavascriptCode(userCode) {
    const jsWrapperTop = 'To be defined';
    const jsWrapperBot = 'To be defined';

    return jsWrapperTop + userCode + jsWrapperBot;
}

devTest();

module.exports = {containerizeAndTestCode}