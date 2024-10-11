import {getArgumentValue, println, expandTildePath} from './utils/index.js';
import { pipeline } from 'stream/promises';
import os from 'os';
import readline from 'readline';
import  fs  from 'fs/promises';
import fsCallback from 'fs';
import path from 'path'

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
        const readStream = fsCallback.createReadStream(path, 'utf8');
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

    async rn(from, to){
      
        try {
            await fs.rename(from, to[0])
            console.log(`${from} is renamed ${to}`)
        } catch (error) {
            console.log(`Cant rename file from ${from} to ${to}`)
        }
    }

    async cp(source, dist){
 
        const readStream = fsCallback.createReadStream(source);
        const writeStream = fsCallback.createWriteStream(dist[0]);

        try {
            await pipeline(readStream, writeStream);
        } catch (error) {
            console.log(`Cant copy file`, error)
        }
        
    }

    rm(filepath){
        fsCallback.unlink(filepath, (err) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    console.error(`File not found: ${filePath}`);
                } else {
                    console.error(`Error deleting file ${filePath}:`, err);
                }
                 
            } else {
                console.log(`File deleted successfully: ${filePath}`);
           
            }
        });
    }

    async mv(source, distParam){
        const dist = distParam[0]
         
        try {

            await fs.access(source);
            await fs.access(dist);

            const fileName = path.basename(source);
            const destinationPath = path.join(dist, fileName);
            await fs.rename(source, destinationPath);
            
            console.log(`File moved successfully from ${source} to ${dist}`);
        } catch (error) {
            console.log(`cant be moved from ${source} to ${dist}`,error)
        }
       
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
            cat: this.filesMethodes.cat,
            rn: this.filesMethodes.rn,
            cp: this.filesMethodes.cp,
            mv: this.filesMethodes.mv
        }
    }

    up(){
        goToDir('..');
    }

    async cd(pathParam){
        console.log(pathParam)
        const path = expandTildePath(pathParam);
        await goToDir(path)
    }

    async ls(){
        try{
            const directoryOrFilePath =  process.cwd();
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
                const [cmd, param,  ...rest] =  input.split(' ');
                if(cmd.toLowerCase() === '.exit') {
                    process.stdout.write(println(`Thank you for using File Manager, ${this.userName}, goodbye!`));
                    rl.close();
                    process.exit(0);
                } 

                const f = async () => {
                   await this.methods[cmd.toLowerCase()](param, rest)
                }
                this.methods[cmd.toLowerCase()] && f()
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