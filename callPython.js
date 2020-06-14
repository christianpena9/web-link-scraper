// const {spawn} = require('child_process');
// Use child_process.spawn method from
// child_process module and assign it
// to variable spawn
var spawn = require("child_process").spawn;

function callPythonScript(url) {
    var dataToSend = 'empty-string';
    // spawn new child process to call the python script
    var process = spawn('python', ['./public/python/fetchURL.py', url]);
    // Takes stdout data from script which executed
    // with arguments and send this data to res object
    process.stdout.on('data', function(data) {
        console.log(data.toString());
    });
}

module.exports.callPythonScript = callPythonScript;
