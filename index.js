const {Tokenize} = require('./src/tokenizer');
const {Lex} = require('./src/lexer');
const { Parse } = require('./src/parser');
const {exec} = require('child_process');
const version = require('./package.json').version;
// Code for command line command

const HELP_TEXT = `
Usage:
 » For Converting Abstractmark : run "abstractmark [abstractmark file] [abstractmark options] [args]"
 » For Abstractmark's Information : run "abstractmark [option]"
Example:
 » (Convert Markdown to HTML) abstractmark example.am
 » (Convert Markdown to certain HTML file name) abstractmark example.am myfile.html
 » (Checking the Current Version of Abstractmark) abstractmark -v

Abstractmark information options:
 -v, --version ........... show abstractmark current version
 --help .................. informations about AbstractMark CLI

Abstractmark converting options:
 -open ................... Open html file in browser after finish converting.
`
// Clear last line output on CLI.
const CLEAR_LAST_LINE = () => {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
}

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
        // Write convert result into html file
        let htmlFileName = null;
        for(let i = 1; i< args.length; i++){
          if(!args[i].startsWith('-')) htmlFileName = args[i];
        }
        process.stdout.write('Converting...')
        // If user doesn't provide file name
        if(!htmlFileName) htmlFileName = `${file.split('.').shift()}.html`
        fs.writeFile(htmlFileName, parsedData, (err) => {
          if(err) throw new Error(err)
          else{
            CLEAR_LAST_LINE()
            process.stdout.write(`\nSuccessfully converted ${file} to ${htmlFileName}\n`)
            for(let i = 1; i< args.length; i++){
              if(args[i] === "-open"){
                process.stdout.write(`Opening ${htmlFileName} on your browser.`)
                exec(htmlFileName);
                CLEAR_LAST_LINE()
                process.stdout.write(`Opened ${htmlFileName} on your browser.\n`)
              }
            }
          }
        })
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