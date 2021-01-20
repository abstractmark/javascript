const {Tokenize} = require('./src/tokenizer');
const {Lex} = require('./src/lexer');
const { Parse } = require('./src/parser');
const version = require('./package.json').version;
// Code for command line command

const HELP_TEXT = `
Usage:
 » For Converting Abstractmark : run "abstractmark [abstractmark file] [abstractmark options] [args]"
 » For Abstractmark's Information : run "abstractmark [option]"
Example:
 » (Convert Markdown to HTML) abstractmark example.am -o example.html
 » (Checking the Current Version of Abstractmark) abstractmark -v

Abstractmark information options:
 -v, --version ........... show abstractmark current version
 --help .................. informations about AbstractMark CLI

Abstractmark converting options:
 -o, -output ............. Convert to a specific file name, syntax: "abstractmark [abstractmark source] -o [output file name]"
`
const cli = () => {
  const args = process.argv.slice(2)
    if(args.length > 0){
      // Check whether the first args is option
      if(args[0].startsWith('-')){
        // If the client is asking help
        if(args[0] === "-help") console.log("\x1b[33mAbstractMark warning: -help is not a abstractmark command.\x1b[0m\n » Did you mean \"abstractmark --help\"?")
        else if(args[0] === "--help"){
          console.log(HELP_TEXT)
        }
        // If the client is asking the version of AbstractMark
        else if(args[0] === "-v" || args[0] === "-version" || args[0] === "--v" || args[0] === "--version") console.log(version)
        else console.log("Usage: abstractmark [abstractmark file] [abstractmark options] [args]\n\nSee \"abstractmark --help\" for more.")
      }else{
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
        if(args[1] === "-o" || args[1] === "-output" && args[2]){
          fs.writeFile(args[2], parsedData, (err) => {
            if(err) throw new Error(err)
            else console.log(`Sucess converted ${file} to ${args[2]}`)
          })
        }
      }
    }else{
      console.log("Usage: abstractmark [abstractmark file] [abstractmark options] [args]\n\nSee \"abstractmark --help\" for more.")
    }
}

const AbstractMark = (abstractmark) => {
  const TokenizedData = Tokenize(abstractmark)
  const lexedData = Lex(TokenizedData)
  const parsedData = Parse(lexedData)
  return parsedData
}
module.exports = {cli, AbstractMark}