const packageInfo = require('./package.json');
var exec = require("child_process").exec;

function myTest() {
    const { extensionName, description, version } = packageInfo || {}
    return new Promise(function(resolve, reject) {

        var cmd = `npx hygen manifest new --version ${version} --extensionName ${extensionName} --description ${description}`;
        exec(cmd,{
            maxBuffer: 1024 * 2000
        }, function(err, stdout, stderr) {
            if (err) {
                console.log(err);
                reject(err);
            } else if (stderr.lenght > 0) {
                reject(new Error(stderr.toString()));
            } else {
                console.log(stdout);
                resolve();
            }
        });
    });
};

myTest();