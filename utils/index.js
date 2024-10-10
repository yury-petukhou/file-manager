import path from 'path'
import os from 'os'

const args = process.argv.slice(2);

export function println(message) {
  return `${message}\n`;
}

export function getArgumentValue(argName) {
  const arg = args.find(arg => arg.startsWith(`${argName}=`));
  return arg ? arg.split('=')[1] : null;
}

export function expandTildePath(filepath) {
    
    if (filepath.split('/')[0] === '~') {
      return path.join(os.homedir(), filepath.slice(1));
    }
    return filepath;
  }