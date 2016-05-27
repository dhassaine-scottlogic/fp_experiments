const fs = require('fs');
const child_process = require('child_process');

function spawnProcess(id) {
	function childProcessStdout(data) {
		console.log('stdout: ' + data);
	}

	function childProcessStderr(data) {
		console.log('stderr: ' + data);
	}

	function childProcessClose(exitCode) {
		console.log('child process exited with code: ' + exitCode);
	}
	
	const cp = child_process.spawn('node', ['support.js', id]);
	cp.stdout.on('data', childProcessStdout);
	cp.stderr.on('data', childProcessStderr);
	cp.on('close', childProcessClose);
	
}


function exitChild(code) {
	console.log('Child process exited with exit code ' + code);
}

for (var i = 0; i < 3; i++) {
	spawnProcess(i);
}
