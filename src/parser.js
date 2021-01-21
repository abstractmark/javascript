// Replace all special characters with it's corresponding html entity
const replaceSpecialCharacters = str => str.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
// Parse typography inside every data(bold, italic, underline and strikethrough)
const parseTypography = data => data
    .replace(/\*\*(.*?)\*\*/gim, "<b>$1</b>")
    .replace(/_(.*?)_/gim, "<i>$1</i>")
    .replace(/%(.*?)%/gim, "<u>$1</u>")
    .replace(/\~\~(.*)\~\~/gim, "<del>$1</del>")
    .replace(/\`([^\`]+)\`/gim, (_, code) => `<code>${replaceSpecialCharacters(code)}</code>`)

const Parse = lexedData => {
    let parsedData = [];
    // Assign Paragraph Variable
    let endParagraph = false;
    let paragraphValue = [];
    // First, split lexed Data by paragraph
    for(let index = 0; index< lexedData.length; index++){
        let data = lexedData[index];
        if(data.value === "" && endParagraph) endParagraph = false;
        else if(data.value === "" && !endParagraph) endParagraph = true;
        else{
            let newData = {};
            // Replace all escape characters to it's html entities
            data.value = data.value.replace(/\\\*/g, '&ast;')
            data.value = data.value.replace(/\\\&/g, '&amp;')
            data.value = data.value.replace(/\\\</g, '&lt;')
            data.value = data.value.replace(/\\\>/g, '&gt;')
            data.value = data.value.replace(/\\\"/g, '&quot;')
            data.value = data.value.replace(/\\\'/g, '&#39;')
            data.value = data.value.replace(/\\\%/g, '&percnt;')
            data.value = data.value.replace(/\\\_/g, '&UnderBar;')
            data.value = data.value.replace(/\\\`/g, '&#96;')
            // parse typography of the value
            data.value = parseTypography(data.value)
            // Checking the type of each data
            if(data.includes.fencedCodeBlock){
                newData.type = "fencedCodeBlock";
                newData.value = "";
                for(let j = index + 1; j< lexedData.length; j++){
                    // Check if the line is a fenced code block close tag
                    if(lexedData[j].includes.fencedCodeBlock){
                        index = j;
                        // Check if fenced code block close tag is also end of the file
                        if(lexedData[j].lastElement) endParagraph = true
                        break;
                    }else{
                        newData.value += `${replaceSpecialCharacters(lexedData[j].value)}<br />` // Add a <br> tag in the end of each line
                    }
                }
                paragraphValue.push(newData)
            }
            else if(data.includes.defineClass){
                newData.type = "defineClass";
                newData.value = "";
                // Find the close tag of define class
                for(let i = index + 1; i< lexedData.length; i++){
                    if(lexedData[i].value === "---"){
                        index = i;
                        // Check if define class close tag is also end of the file
                        if(lexedData[i].lastElement) endParagraph = true
                        break;
                    }
                    else newData.value += lexedData[i].value;
                }
                paragraphValue.push(newData)
            }
            else if(data.includes.horizontalRule){
                newData.type = "plain"
                newData.value = "<hr />"
                paragraphValue.push(newData)
            }
            else if(data.includes.heading){
                newData.type = "heading";
                newData.headingLevel = 0;
                for(let j = 0; j< data.value.length; j++){
                    // Stop the loop when the character is NOT "#"
                    if(data.value[j] !== "#") break
                    // Otherwise, add a heading level for the heading
                    else newData.headingLevel += 1
                }
                newData.value = data.value.substring(newData.headingLevel + 1)
                // Check if the heading includes heading Id
                if(data.includes.headingId){
                    newData.headingId = "";
                    for(let i = 0; i< data.value.length; i++){
                        // Check whether if a heading containt '{#' and ends with '}'
                        if(data.value[i] === "{" && data.value[i + 1] === "#"){
                            newData.value = newData.value.substr(0, i-newData.headingLevel-1).trim()
                            for(let j = i + 2; j< data.value.length; j++){
                                if(data.value[j] === "}")break;
                                else newData.headingId += data.value[j]
                            }
                        }
                    }
                    //Remove unnecessary space form heading Id
                    newData.headingId = newData.headingId.trim()
                }else{
                    // Default heading id
                    newData.headingId = newData.value.replace(/<\/?[^>]+(>|$)/g, "").replace(/ /g, '-').replace(/[^a-zA-Z0-6-]/g, '').toLowerCase().substring(0, 50)
                }
                //Push result to the variables
                paragraphValue.push(newData)
            }
            // Check if it is a plain text
            else if(Object.values(data.includes).indexOf(true) === -1){
                newData.type = "plain"
                newData.value = data.value
                paragraphValue.push(newData)
            }
            // Plain text
            else paragraphValue.push(data)
        }
        // If it's the end of paragraph or it's end of the file
        if(endParagraph || data.lastElement){
            //Reset Variable to Default
            endParagraph = false
            //Push Pragraph information to parsedData
            //console.log(paragraphValue)
            parsedData.push(paragraphValue)
            paragraphValue = []
        }
    }
    //console.log(parsedData)
    let parsedStyleTag = [];
    // Convert parsed data to HTML tags
    const toHTML = (data) => {
        let htmlData = ""
        for(let i = 0; i< data.length; i++){
            // Check if whether it is a plain text, heading, fenced code block or define class
            if(data[i].type === "plain"){
                // Add br tags if there is next line inside the paragraph
                if(data[i + 1]) htmlData += `${data[i].value}<br />`
                else htmlData += data[i].value
            }else if(data[i].type === "heading"){
                // Check if the heading has its id
                if(data[i].headingId) htmlData += `<h${data[i].headingLevel} id = "${data[i].headingId}">${data[i].value}</h${data[i].headingLevel}>`
                else htmlData += `<h${data[i].headingLevel}>${data[i].value}</h${data[i].headingLevel}>`
            }else if(data[i].type === "fencedCodeBlock"){
                // Insert fenced code block value inside <code> and <pre> tags
                htmlData += `<pre><code>${data[i].value}</code></pre>`
            }else if(data[i].type === "defineClass"){
                parsedStyleTag.push(data[i].value)
            }
        }
        return htmlData
    }
    //Gather all parsed information info html tags
    let parsedHtml = "";
    for(let i = 0; i< parsedData.length; i++){
        toHTML(parsedData[i])? parsedHtml += `<p>${toHTML(parsedData[i])}</p>`: null;
    }
    return {body: parsedHtml, head: parsedStyleTag};
}

module.exports = { Parse }