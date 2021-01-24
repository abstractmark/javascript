// Replace all special characters with it's corresponding html entity
const replaceSpecialCharacters = str => str.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
// Parse typography inside every data(bold, italic, underline and strikethrough)
const parseTypography = data => data
    .replace(/\*\*(.*?)\*\*/gim, "<b>$1</b>")
    .replace(/_(.*?)_/gim, "<i>$1</i>")
    .replace(/%(.*?)%/gim, "<u>$1</u>")
    .replace(/\~\~(.*)\~\~/gim, "<del>$1</del>")
    .replace(/\`([^\`]+)\`/gim, (_, code) => `<code>${replaceSpecialCharacters(code)}</code>`)

const checkClassUsage = data => {
    data.className = ""
    for(let i = 0; i< data.value.length; i++){
        // Check whether the value contains '{!' and ends with '}'
        if(data.value[i] === "{" && data.value[i + 1] === "!"){
            // Temporary variable to remove class chars
            let newValue = data.value.slice(0, i)
            for(let j = i + 2; j< data.value.length; j++){
                if(data.value[j] === "}"){
                    data.value = newValue + data.value.slice(j + 1)
                    data.value = data.value.trim()
                    data.className = data.className.trim()
                    break
                }else data.className += data.value[j]
            }
        }
    };
    return data;
}

const parseInlineStyle = data => {
    data.inlineStyle = "";
    for(let i = 0; i<data.value.length; i++){
        // Check whether the value contains '{' and ends with '}' but it isn't heading id nor class
        if(data.value[i] === "{" && data.value[i + 1] !== "!" && data.value[i + 1] !== "#"){
            // Temporary variable to remove style chars
            let newValue = data.value.slice(0, i - 1)
            for(let j = i + 1; j< data.value.length; j++){
                if(data.value[j] === "}"){
                    data.value = newValue + data.value.slice(j + 1).trim()
                    data.value = data.value.trim()
                    break;
                }else data.inlineStyle += data.value[j]
            }
        }
    }
    return data;
}

// Add class attribute and style attribute to element
const parseStyleAndClassAtribute = data => `${data.className?`class="${data.className}"`:''} ${data.inlineStyle?`style="${data.inlineStyle}"`:''}`

const Parse = lexedData => {
    let parsedData = [];
    // Assign Paragraph Variable
    let endParagraph = false;
    let paragraphValue = [];
    // First, split lexed Data by paragraph
    for(let index = 0; index<lexedData.length; index++){
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
            data.value = data.value.replace(/\\{`/g, '&#123;')
            data.value = data.value.replace(/\\}`/g, '&#125;')
            
            // parse typography of the value except for link and image
            if(!data.includes.image && !data.includes.link){
                data.value = parseTypography(data.value)
            }
            // Checking the type of each data
            if(data.includes.fencedCodeBlock){
                newData.type = "fencedCodeBlock";
                if(data.includes.classUsage) newData = checkClassUsage(Object.assign({}, newData, {value: data.value}))
                if(data.includes.inlineStyle) newData = parseInlineStyle(newData)
                newData.value = "";
                for(let j = index + 1; j< lexedData.length; j++){
                    // Check if the line is a fenced code block close tag
                    if(lexedData[j].includes.fencedCodeBlock){
                        index = j;
                        // Check if fenced code block close tag is also end of the file
                        if(lexedData[j].lastElement) endParagraph = true
                        break;
                    }else newData.value += `${replaceSpecialCharacters(lexedData[j].value)}<br />` // Add a <br> tag in the end of each line
                }
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
            }
            else if(data.includes.horizontalRule){
                newData.type = "plain"
                newData.value = "<hr />"
            }
            else if(data.includes.blockquote){
                newData.type = "blockquote";
                newData.value = [];
                // Check if it's followed by blockquote
                for(let i = index; i< lexedData.length; i++){
                    // End the loop if it's not followed by blockquote
                    if(!lexedData[i].includes.blockquote){
                        index = i;
                        break;
                    }else{
                        let blockquoteDepthLevel = 0;
                        let trimmedValue = ""
                        // Check blockquote's depth level and remove blockquote syntax from blockquote value
                        for(let j = 0; j< lexedData[i].value.length; j++){
                            // Check blockquote's syntax
                            if(lexedData[i].value[j] === ">") blockquoteDepthLevel++
                            else{
                                trimmedValue = lexedData[i].value.slice(blockquoteDepthLevel).trim()
                                break;
                            }        
                        }
                        let blockquoteData = {value: trimmedValue, blockquoteDepthLevel}
                        // Get style and class information about the blockquote
                        if(lexedData[i].includes.classUsage) blockquoteData = checkClassUsage(blockquoteData)
                        if(lexedData[i].includes.inlineStyle) blockquoteData = parseInlineStyle(blockquoteData)
                        // Push the data
                        newData.value.push(blockquoteData)
                    }
                }
                // A recursive function to parse blockquote and it's children to html tags
                const parseDescendants = (parent, data, index) => {
                    let result = ""
                    for(let i = index; i< data.value.length; i++){
                        // Break when meet a blockquote with the same depth level and it's index is higher than parent index
                        if(parent === data.value[i].blockquoteDepthLevel && i !== index) break
                        // If the blockquote depth level is same as parent depth level + 1
                        if(parent + 1 === data.value[i].blockquoteDepthLevel){
                            // If it's not an empty string
                            if(parseDescendants(parent + 1, data, i).length){
                                result += `<blockquote ${parseStyleAndClassAtribute(data.value[i])}>${data.value[i].value}${parseDescendants(parent +1, data, i)}</blockquote>`
                            }
                            else result += `<blockquote ${parseStyleAndClassAtribute(data.value[i])}>${data.value[i].value}</blockquote>`
                        }
                    }
                    return result;
                }
                newData.value = parseDescendants(0, newData, 0)
            }
            else if(data.includes.image){
                newData.type = "image"
                newData.value = data.value
                if(data.includes.classUsage) newData = checkClassUsage(newData)
                if(data.includes.inlineStyle) newData = parseInlineStyle(newData)
                newData.altText = "";
                newData.imageSrc = "";
                for(let i = 0; i< newData.value.length; i++){
                    //Check whether if it started with ![
                    if(newData.value[i] === "!" && newData.value[i + 1] === "["){
                        for(let j = i + 2; j< newData.value.length; j++){
                            //Break the loop if it is ended with ]
                            if(newData.value[j] === "]"){
                                i = j;
                                break;
                            }else newData.altText += newData.value[j] //Otherwise save it as Alt text
                        }
                    }else if(newData.value[i] === "("){
                        for(let j = i + 1; j< newData.value.length; j++){
                            if(newData.value[j] === ")"){
                                break;
                            }else newData.imageSrc += newData.value[j] //Get image source
                        }
                    }
                }
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
                        // Check whether the heading contains '{#' and ends with '}'
                        if(data.value[i] === "{" && data.value[i + 1] === "#"){
                            // Temporary variable to remove heading id chars
                            let newValue = newData.value.slice(0, i-newData.headingLevel-1)
                            for(let j = i + 2; j< data.value.length; j++){
                                if(data.value[j] === "}"){
                                    newData.value = newValue + newData.value.slice(j - newData.headingLevel +1).trim()
                                    break;
                                }
                                else newData.headingId += data.value[j]
                            }
                        }
                    }
                    //Remove unnecessary space form heading Id
                    newData.headingId = newData.headingId.trim()
                    if(data.includes.classUsage) newData = checkClassUsage(newData)
                    if(data.includes.inlineStyle) newData = parseInlineStyle(newData)
                }else{
                    // Class attribute
                    if(data.includes.classUsage) newData = checkClassUsage(newData)
                    if(data.includes.inlineStyle) newData = parseInlineStyle(newData)
                    // Default heading id
                    newData.headingId = newData.value.replace(/<\/?[^>]+(>|$)/g, "").replace(/ /g, '-').replace(/[^a-zA-Z0-6-]/g, '').toLowerCase().substring(0, 50)
                }
            }
            // Check if it is a plain text
            else if(Object.values(data.includes).indexOf(true) === -1 || 
            Object.values(data.includes).indexOf(true) === Object.keys(data.includes).indexOf("classUsage") ||
            Object.values(data.includes).indexOf(true) === Object.keys(data.includes).indexOf("inlineStyle")){
                newData.type = "plain"
                newData.value = data.value
                if(data.includes.classUsage) newData = checkClassUsage(newData)
                if(data.includes.inlineStyle) newData = parseInlineStyle(newData)
            }
            // Plain text
            else paragraphValue.push(data)
            // Push new data
            paragraphValue.push(newData)
        }
        // If it's the end of paragraph or it's end of the file
        if(endParagraph || data.lastElement){
            //Reset Variable to Default
            endParagraph = false
            //Push Pragraph information to parsedData
            parsedData.push(paragraphValue)
            paragraphValue = []
        }
    }
    let parsedStyleTag = [];

    // Convert parsed data to HTML tags
    const toHTML = data => {
        let htmlData = ""
        for(let i = 0; i< data.length; i++){
            // Check if whether it is a plain text, heading, fenced code block or others
            // Blockquote will be treated like plain text
            if(data[i].type === "plain" || data[i].type === "blockquote"){
                // Add br tags if there is next line and the current line is not horizontal rule inside the paragraph
                htmlData += `${data[i].className || data[i].inlineStyle?`<span ${parseStyleAndClassAtribute(data[i])}>${data[i].value}</span>`:`${data[i].value}`}${data[i + 1] && data[i].value !== "<hr />"?"<br />":""}`
            }else if(data[i].type === "heading"){
                htmlData += `<h${data[i].headingLevel} ${data[i].headingId?`id = "${data[i].headingId}`:""}" ${parseStyleAndClassAtribute(data[i])}>${data[i].value}</h${data[i].headingLevel}>`
            }else if(data[i].type === "fencedCodeBlock"){
                // Insert fenced code block value inside <code> and <pre> tags
                htmlData += `<pre ${parseStyleAndClassAtribute(data[i])}><code>${data[i].value}</code></pre>`
            }else if(data[i].type === "defineClass"){
                if(parsedStyleTag.indexOf(data[i].value) === -1) parsedStyleTag.push(data[i].value)
            }else if(data[i].type === "image"){
                htmlData += `<img ${data[i].imageSrc?`src="${data[i].imageSrc}"`:""} ${data[i].altText?`alt="${data[i].altText}"`:""} ${parseStyleAndClassAtribute(data[i])} />`
            }
        }
        return htmlData
    }
    //Gather all parsed information info html tags
    let parsedHtml = "";
    for(let i = 0; i< parsedData.length; i++){
        // Check if the paragraph don't need <p> tags
        let needParagraphTag = false
        for(let j = 0; j< parsedData[i].length; j++){
            // No need <p> tag if there's no any plain text inside the paragraph
            if(parsedData[i][j].type === "plain"){
                if(parsedData[i][j].value === "<hr />" && parsedData[i].length === 1){
                    needParagraphTag = false;
                }else needParagraphTag = true
                break
            }
        }
        toHTML(parsedData[i])? !needParagraphTag? parsedHtml += toHTML(parsedData[i]) : parsedHtml += `<p>${toHTML(parsedData[i])}</p>`: null;
    }
    return {body: parsedHtml, head: parsedStyleTag};
}

module.exports = { Parse }