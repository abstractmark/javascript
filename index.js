// Code for command line command
const cli = () => {
  const args = process.argv.slice(2)
    if(args.length > 0){
      let {Tokenize} = require('./src/tokenizer');
      let file = args[0];
      // Check file extension
      if(!(file.endsWith('.am') || file.endsWith('.abstractmark'))) throw new Error('AbstractMark: only file with extension .am or .abstractmark is allowed')
      // Read file data
      const fs = require('fs');
      let data = fs.readFileSync(file, 'utf-8')
      console.log(Tokenize(data))
    }
}

const AbstractMark = (abstractmark) => {
  let {Tokenize} = require('./src/tokenizer');
  let TokenizedData = Tokenize(abstractmark)
  return TokenizedData
}
module.exports = {cli, AbstractMark}