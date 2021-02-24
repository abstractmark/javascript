const {Tokenize} = require('./src/tokenizer');
const {Lex} = require('./src/lexer');
const { Parse } = require('./src/parser');
const version = require('./package.json').version;
const DEFAULT_STYLE = require('./src/DEFAULT_STYLE');

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
 -t, --tags .............. Convert to only HTML file which contains only corresponding tags. (Note that AbstractMark CLI converts to full HTML file as default)
 -unstyled ............... Convert to only HTML tags without any style on it.
`
// Clear last line output on CLI.
const CLEAR_LAST_LINE = () => {
  // Check if this script run on node js
  if(typeof window === "undefined"){
    const readline = require('readline')
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
  }
}

const CONVERT_STYLESHEET = stylesheets => {
  let stylesheetTags = "";
  for(let i = 0; i< stylesheets.length; i++){
    stylesheetTags += `<link rel="stylesheet" href ="${stylesheets[i]}">`
  }
  return stylesheetTags
}

const CONVERT_SCRIPTS = scripts => {
  let scriptTags = "";
  for(let i = 0; i< scripts.length; i++){
    scriptTags += `<script src="${scripts[i]}"></script>`
  }
  return scriptTags;
}


const CONVERT_STYLE_TAGS = styles => {
  let styletags = ''
  for(let i = 0; i< styles.length; i++){
    styletags += `<style>${styles[i]}</style>`
  }
  return styletags
}
const CONVERT_TO_FULL_HTML = data => {
  return `<!DOCTYPE html>\
<html lang="en">\
<head>\
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">\
${CONVERT_STYLE_TAGS(data["styles"])}\
${CONVERT_STYLESHEET(data["stylesheets"])}\
${CONVERT_SCRIPTS(data["scripts"])}\
</head>\
<body>${data["body"]}</body>\
</html>`
}

// Code for command line command
const cli = () => {
  // CHeck if this script run on node js or browser
  if(typeof window !== "undefined") throw new Error("AbstractMark CLI not avavilable on browser")
  const open = require('open');
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
        let sourceData = fs.readFileSync(file, 'utf-8')
        const tokenizedData = Tokenize(sourceData)
        const lexedData = Lex(tokenizedData)
        const parsedData = Parse(lexedData)
        // Write convert result into html file
        let htmlFileName = null;
        for(let i = 1; i< args.length; i++){
          if(!args[i].startsWith('-')) htmlFileName = args[i];
        }
        process.stdout.write('Converting...')
        // If user doesn't provide file name
        if(!htmlFileName) htmlFileName = `${file.split('.').slice(0, -1).join('.')}.html`
        // Check CLI args
        let styled = true
        let fullHtmlTags = true
        for(let i = 1; i< args.length; i++){
          if(args[i] === "-t" || args[i] === "--tags") fullHtmlTags = false
          else if(args[i] === "-unstyled" || args[i] === "--unstyled") styled = false
        }
        // Default css style
        if(styled) parsedData['styles'].push(DEFAULT_STYLE)
        let data;
        if(fullHtmlTags) data = CONVERT_TO_FULL_HTML(parsedData)
        else data = `${CONVERT_STYLE_TAGS(parsedData['styles'])}${parsedData['body']}`
        // Write converted data into file.
        fs.writeFile(htmlFileName, data, (err) => {
          if(err) throw new Error(err)
          else{
            CLEAR_LAST_LINE()
            process.stdout.write(`\nSuccessfully converted ${file} to ${htmlFileName}\n`)
            for(let i = 1; i< args.length; i++){
              if(args[i] === "-open"){
                process.stdout.write(`Opening ${htmlFileName} on your browser.`)
                // Open Converted file using "open" module
                const openFile = async (htmlFileName) => {
                  await open(htmlFileName)
                  return true;
                }
                openFile(htmlFileName).then(() => {
                  CLEAR_LAST_LINE()
                  process.stdout.write(`Opened ${htmlFileName} on your browser.\n`)
                })
              }
            }
          }
        })
      }
    }else{
      console.log("Usage: abstractmark [abstractmark file] [abstractmark options] [args]\n\nSee \"abstractmark --help\" for more.")
    }
}

const AbstractMark = (source, options) => {
  let tokenizedData = Tokenize(source)
  let lexedData = Lex(tokenizedData)
  let parsedData = Parse(lexedData)
  if(options && options.styled) parsedData['styles'].push(DEFAULT_STYLE)
  if(options && options.fullHTMLTags) return CONVERT_TO_FULL_HTML(parsedData)
  return `${CONVERT_STYLE_TAGS(parsedData['styles'])}${CONVERT_STYLESHEET(parsedData['stylesheets'])}${CONVERT_SCRIPTS(parsedData["scripts"])}${parsedData['body']}`
}

module.exports = {cli, AbstractMark}