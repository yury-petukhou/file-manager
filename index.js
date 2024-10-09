import {getArgumentValue, println} from './utils/index.js';
import os from 'os';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

const  goToDir = (path) => {
    console.log(path, '<--- path')
    process.chdir(path);
} 

const init = () => {
    const userName = getArgumentValue('--username')
    process.stdout.write(println(`Welcome to the File Manager, ${userName}!`))
    const homeDir = os.homedir()
    goToDir(homeDir);

    const promt = () => {
        process.stdout.write(println(`You are currently in ${process.cwd()}`))

        rl.question(println('Please print command or .exit or cntr+c for exit'), (input) => {
            if(input.toLowerCase() === '.exit') {
                process.stdout.write(println(`Thank you for using File Manager, ${userName}, goodbye!`));
                rl.close();
                process.exit(0);
            } else {
                goToDir(input)
                
                promt();
            }
        })
    }
    promt()

    process.on('exit', () => {
        process.stdout.write(println(`Thank you for using File Manager, ${userName}, goodbye!`))
    })
}


init()