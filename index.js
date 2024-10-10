import {getArgumentValue, println, expandTildePath} from './utils/index.js';
import os from 'os';
import readline from 'readline';
import  fs  from 'fs';


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

const  goToDir = (path) => {
    process.chdir(path);
} 

const printInfo = (files) => `| (index) |      Name       |   Type    |
|---------|-----------------|-----------|   
${files.map(({index, name, type}) => println(`|${index.toString().padStart(5).padEnd(9)}|${name.padStart(14).padEnd(19)}|${type.padStart(5).padEnd(5)}|`)).join('')}`


class FilesMethodes {
    constructor(){}

     cat(path){
        const readStream = fs.createReadStream(path, 'utf8');
        let str = '';

        readStream.on('data', (chunk) => {
            str+=chunk
        });

        readStream.on('end', () => {
            process.stdout.write(println(str))
        });

        readStream.on('error', (error) => {
             console.error('Somthing went wrong:', error);
        });
        
    }
}

class FileManager {

    constructor() {
        this.userName = ''
        
        this.filesMethodes = new FilesMethodes()
        this.methods = {
            up: this.up,
            cd: this.cd,
            ls: this.ls,
            cat: this.filesMethodes.cat
        }
    }

    up(){
        goToDir('..');
    }

    cd(pathParam){
        const path = expandTildePath(pathParam);
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
                const [cmd, param] =  input.split(' ')
                console.log(cmd, param)
                if(cmd.toLowerCase() === '.exit') {
                    process.stdout.write(println(`Thank you for using File Manager, ${this.userName}, goodbye!`));
                    rl.close();
                    process.exit(0);
                } 

                this.methods[cmd.toLowerCase()](param)
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