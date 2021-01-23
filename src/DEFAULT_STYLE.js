// Default css style
const DEFAULT_STYLE = `
body{
    margin: 0 50px;
    padding: 0;
    font-size: 15px;
    font-family: system-ui, Georgia, Palatino, 'Palatino Linotype', Times, 'Times New Roman', serif;;
}

h1, h2, h3, h4, h5, h6{
    margin-top: 24px;
    margin-bottom: 16px;
    font-weight: 600;
    line-height: 1.25;
    padding-bottom: .3em;
}
h1, h2, h3{
    border-bottom: 1px solid #e2e2e2;
}
h1 {
    font-size: 2.5em;
}

h2 {
    font-size: 2em;
}

h3 {
    font-size: 1.5em;
}

h4 {
    font-size: 1.2em;
}

h5 {
    font-size: 1em;
}

h6 {
    font-size: 0.9em;
}
pre{
    padding: 16px;
    overflow: auto;
    font-size: 85%;
    background-color: #eaeaea;
    border-radius: 6px;
}
code{
    padding: .2em .4em;
    margin: 0;
    font-size: 85%;
    background-color: #eaeaea;
    border-radius: 6px;
}
a{
    color: #0645ad;
    text-decoration: none;
}
a:visited {
    color: #0b0080;
}

a:hover {
    color: #06e;
}

a:active {
    color: #faa700;
}

a:focus {
    outline: thin dotted;
}

a:hover,a:active {
    outline: 0;
}

::-moz-selection {
    background: rgba(255, 255, 0, 0.3);
    color: #000;
}

::selection {
    background: rgba(255, 255, 0, 0.3);
    color: #000;
}

a::-moz-selection {
    background: rgba(255, 255, 0, 0.3);
    color: #0645ad;
}

a::selection {
    background: rgba(255, 255, 0, 0.3);
    color: #0645ad;
}
blockquote {
    color: #666666;
    margin: 0;
    padding-left: 2.5em;
    border-left: 0.5em #cccccc solid;
}
`.replace(/(\r\n|\n|\r)/g, '')// Remove all whitespace

module.exports =  DEFAULT_STYLE;