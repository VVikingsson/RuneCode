const fs = require('node:fs');

const userInput = `def add(x,y):
    return 5`;
const testCases = ["add(2,3)", "add(5,5)", "add(3,-8)"];
const expectedOutput = ["5", "10", "-5"];

const python = 'import sys\n' + userInput + `
for line in sys.stdin:
    print(eval(line))`;

fs.writeFile('../server/sandbox/script.py', python, err => {
    if (err) {
        console.log("Error writing python file\n" + err);
    } else {
        console.log("Wrote python file");
    }
});

const { PythonShell } = require('python-shell');

async function runPython() {
    return new Promise((resolve, reject) => {
        let pyshell = new PythonShell('./sandbox/script.py');

        // Send a message to Python (optional)
        for (testCase of testCases) {
            pyshell.send(testCase);
        }

        let results = []
        pyshell.on('message', (message) => {
            results.push(message);
        });

        pyshell.end((err) => {
            if (err) reject(err);
            for (let i = 0; i < results.length; i++) {
                if (results[i] != expectedOutput[i]) {
                    console.log(i, 'tests passed before', testCases[i] + ' returned ' + results[i] + ', expected ' + expectedOutput[i]);
                    return;
                }
            }
            console.log('All tests pass');
        });
    });
}

runPython().then(res => console.log(res));


