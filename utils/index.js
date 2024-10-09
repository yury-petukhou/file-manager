const args = process.argv.slice(2);

export function println(message) {
  return `${message}\n`;
}

export function getArgumentValue(argName) {
  const arg = args.find(arg => arg.startsWith(`${argName}=`));
  return arg ? arg.split('=')[1] : null;
}