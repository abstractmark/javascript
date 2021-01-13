const {Tokenize} = require('./src/tokenizer');
const {Lex} = require('./src/lexer');
// Code for command line command
const cli = () => {
  const args = process.argv.slice(2)
    if(args.length > 0){
      let file = args[0];
      // Check file extension
      if(!(file.endsWith('.am') || file.endsWith('.abstractmark'))) throw new Error('\x1b[31mAbstractMark: only file with extension .am or .abstractmark is allowed\x1b[0m')
      // Read file data
      const fs = require('fs');
      let data = fs.readFileSync(file, 'utf-8')
      const tokenizedData = Tokenize(data)
      console.log(tokenizedData)
      Lex(tokenizedData)
    }
}

const AbstractMark = (abstractmark) => {
  let TokenizedData = Tokenize(abstractmark)
  return TokenizedData
}
module.exports = {cli, AbstractMark}