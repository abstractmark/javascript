// Default css style
const DEFAULT_STYLE = `
html, head, body{
    display: block !important;
    width: auto !important;
    visibility: initial !important;
}
body{
    margin: 0 50px;
    padding: 0;
    font-size: 15px;
    font-family: system-ui, Georgia, Palatino, 'Palatino Linotype', Times, 'Times New Roman', serif;
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
pre code{
    padding: 0;
}
a{
    color: #0645ad;
    text-decoration: none;
}
a:visited {
    color: #3123c5;
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
    padding-left: 1.8em;
    border-left: 0.5em #cccccc solid;
    line-height: 2em;
}
table {
    padding: 0;
    width: 100%;
}
table tr {
    border-top: 1px solid #cccccc;
    background-color: white;
    margin: 0;
    padding: 0;
}

table tr:nth-child(2n) {
    background-color: #f8f8f8;
}

table tr th {
    font-weight: bold;
    border: 1px solid #cccccc;
    text-align: left;
    margin: 0;
    padding: 6px 13px;
}

table tr td {
    border: 1px solid #cccccc;
    text-align: left;
    margin: 0;
    padding: 6px 13px;
}

table tr th :first-child, table tr td :first-child {
    margin-top: 0;
}

table tr th :last-child, table tr td :last-child {
    margin-bottom: 0;
}
img{
    width: inherit;
    max-width: 100%;
}
@media only screen and (max-width: 600px){
    body{
        margin: 0 15px !important;
    }
}
`.replace(/(\r\n|\n|\r)/g, '')// Remove all whitespace

module.exports =  DEFAULT_STYLE;