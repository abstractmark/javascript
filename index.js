// Code for command line command
const cli = () => {
  const args = process.argv.slice(2)
    if(args.length > 0){
      let {Parse} = require('./src/parser');
      let file = args[0];
      // Check file extension
      if(!(file.endsWith('.am') || file.endsWith('.abstractmark'))) throw new Error('AbstractMark: only file with extension .am or .abstractmark is allowed')
      // Read file data
      const fs = require('fs');
      let data = fs.readFileSync(file, 'utf-8')
      console.log(Parse(data))
    }
}

const AbstractMark = (abstractmark) => {
  let {Parse} = require('./src/parser');
  let parsedData = Parse(abstractmark)
  return parsedData
}
module.exports = {cli, AbstractMark}