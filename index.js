const {Tokenize} = require('./src/tokenizer');
const {Lex} = require('./src/lexer');
const { Parse } = require('./src/parser');
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
      const lexedData = Lex(tokenizedData)
      const parsedData = Parse(lexedData)
      console.log(parsedData)
    }
}

const AbstractMark = (abstractmark) => {
  const TokenizedData = Tokenize(abstractmark)
  const lexedData = Lex(TokenizedData)
  const parsedData = Parse(lexedData)
  return parsedData
}
module.exports = {cli, AbstractMark}