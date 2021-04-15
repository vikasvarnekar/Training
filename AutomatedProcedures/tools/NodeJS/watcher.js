const watcher = require('node-watch-changes');
const path = require('path');
const fs = require('fs');
const rootDir = path.resolve(process.cwd(), '../../..');
const clientFolder = '/Innovator/Client';
const instanceName = process.argv[2];
const instanceNameFolder = rootDir + '\\Instances\\' + instanceName;

if (!instanceName) {
	throw 'Instance name not specified!';
}

const onChange = async (events, spawn) => {
	function copyChanges(pathToFile, pathToFolder) {
		spawn('xcopy /E /C /I /F /Y "' + pathToFile + '" "' + path.dirname(pathToFile.replace(rootDir, pathToFolder)) + '\\"');
	}

	function unlinkData(pathToFile, pathToFolder) {
		const filePath = pathToFile.replace(rootDir, pathToFolder);
		if (fs.existsSync(filePath)) {
			console.log(`Delete file: ${filePath}`);
			fs.unlinkSync(filePath, (err) => {
				if (err) {
					console.log(err.message);
				}
			});
		}
	}

	if (events.add || events.change) {
		const filesForProcessing = events.add ? events.add : events.change;
		for (const filePath of filesForProcessing) {
			await copyChanges(filePath, instanceNameFolder);
		}
	}

	if (events.unlink) {
		for (const filePath of events.unlink) {
			unlinkData(filePath, instanceNameFolder);
		}
	}
};

watcher({
	directory: rootDir + clientFolder,
	delay: 400,
	verbosity: 'minimal',
	onChange: onChange,
	onStart: () => console.log('Watcher is running...'),
	onEnd: () => console.log('Watcher is terminating.')
});