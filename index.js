import {getArgumentValue, println} from './utils/index.js';
import os from 'os';
import readline from 'readline';
import { promises as fs } from 'fs';


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

const  goToDir = (path) => {
    console.log(path, '<--- path')
    process.chdir(path);
} 

const printInfo = (files) => `| (index) |      Name       |   Type    |
|---------|-----------------|-----------|   
${files.map(({index, name, type}) => println(`|${index.toString().padStart(5).padEnd(9)}|${name.padStart(14).padEnd(19)}|${type.padStart(5).padEnd(5)}|`)).join('')}`


class FileManager {

    constructor() {
        this.userName = ''
    }
    up(){
        goToDir('..');
    }

    cd(pathParam){
        const path = pathParam.replace('cd', '')
        goToDir(path)
    }

    async ls(){
        try{
            const directoryOrFilePath = process.cwd();
            const files = await fs.readdir(directoryOrFilePath);
            const stat = await fs.stat(directoryOrFilePath)
            const mappedFiles = files.map((file,index) => ({
                index,
                name: file,
                type: stat.isDirectory() ? 'directory' : 'file'

            }))
           process.stdout.write(printInfo(mappedFiles))
        } catch(e){
            console.log(e)
        }
    }
    init(){
        this.userName = getArgumentValue('--username')
        process.stdout.write(println(`Welcome to the File Manager, ${this.userName}!`))
        const homeDir = os.homedir()
        goToDir(homeDir);
    
        const promt = () => {
            process.stdout.write(println(`You are currently in ${process.cwd()}`))
    
            rl.question(println('Please print command or .exit or cntr+c for exit'), (input) => {
                const inpt = input.toLowerCase()
                if(inpt === '.exit') {
                    process.stdout.write(println(`Thank you for using File Manager, ${this.userName}, goodbye!`));
                    rl.close();
                    process.exit(0);
                } 

                if(inpt === 'up') {
                    this.up()
                }

                if(inpt.startsWith("cd")) {
                    this.cd(inpt)
                }
                if(inpt === 'ls') {
                    this.ls()
                }
              
                promt();
            })
        }
        promt()
    
        process.on('exit', () => {
            process.stdout.write(println(`Thank you for using File Manager, ${this.userName}, goodbye!`))
        })
    }
}

const fileManagerInst = new FileManager()
fileManagerInst.init()