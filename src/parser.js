// Replace all special characters with it's corresponding html entity
const replaceSpecialCharacters = str => {
    str = str.replace(/&/g, "&amp;").replace(/\*/g, "&ast;")
    str = str.replace(/>/g, "&gt;").replace(/</g, "&lt;")
    str = str.replace(/"/g, "&quot;").replace(/'/g, "&#39;")
    str = str.replace(/\\\`/g, '&#96;').replace(/\`/g, '&#96;')
    str = str.replace(/\[/g, '&lbrack;').replace(/\]/g, '&rbrack;')
    str = str.replace(/\{/g, '&#123;').replace(/\}/g, '&#125;')
    str = str.replace(/\_/g, "&UnderBar;").replace(/!/g, '&#33;');
    str = str.replace(/\%/g, "&percnt;").replace(/\~/, '&#126;')
    return str;
}
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
        if(data.value[i] === "{" && data.value[i + 1] === "."){
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
            let newValue = data.value.slice(0, i)
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

// A recurstion function to parse all link syntax
const parseLink = data => {
    let newData = "";
    let text = ""
    let url = ""
    // Checking for the syntax of link
    for(let i = 0; i< data.length; i++){
        if(data[i] === "["){
            // Finding the end of the text
            for(let j = i + 1; j< data.length; j++){
                if(data[j] === "]" && data[j + 1] === "("){
                    i = j
                    break
                }else{
                    text += data[j]
                }
            }
        // Parsing the URL
        }else if(data[i] === "(" && data[i - 1] === "]"){
            for(let j = i + 1; j< data.length; j++){
                if(data[j] === ")"){
                    newData += `<a href="${url}">${text}</a>`;
                    i = data.length;
                    // Add others text into new data
                    for(let k = j + 1; k< data.length; k++){
                        newData += data[k]
                    }
                    // Call this function again to parse all link
                    while(/(?<!\!)\[.+\]\(.+\)/.test(newData)) newData = parseLink(newData)
                    break
                }else{
                    url += data[j]
                }
            }
        }else{
            newData += data[i]
        }
    }
    return newData
}

// Add class attribute and style attribute to element
const parseStyleAndClassAtribute = data => `${data.className?`class="${data.className}"`:''} ${data.inlineStyle?`style="${data.inlineStyle}"`:''}`

// Replace all escape characters to it's html entities
const escapeCharacters = data => {
    data = data.replace(/\\\*/g, '&ast;')
    data = data.replace(/\\\&/g, '&amp;')
    data = data.replace(/\\\</g, '&lt;')
    data = data.replace(/\\\>/g, '&gt;')
    data = data.replace(/\\\"/g, '&quot;')
    data = data.replace(/\\\'/g, '&#39;')
    data = data.replace(/\\\%/g, '&percnt;')
    data = data.replace(/\\\_/g, '&UnderBar;')
    data = data.replace(/\\\`/g, '&#96;')
    data = data.replace(/\\\{/g, '&#123;')
    data = data.replace(/\\\}/g, '&#125;')
    data = data.replace(/\\\[/g, '&lbrack;')
    data = data.replace(/\\\]/g, '&rbrack;')
    data = data.replace(/\\\(/g, '&lpar;')
    data = data.replace(/\\\)/g, '&rpar;')
    data = data.replace(/\\\\/g, '&bsol;')
    data = data.replace(/\\\|/g, '&vert;')
    data = data.replace(/\\\!/g, '&#33;')
    data = data.replace(/\\\~/g, '&#126;')
    data = data.replace(/\\\@/g, '&commat;')
    data = data.replace(/\\\#/g, '&num;')
    data = data.replace(/\\\$/g, '&dollar;')
    data = data.replace(/\\\^/g, '&Hat;')
    data = data.replace(/\\\=/g, '&equals;')
    data = data.replace(/\\\+/g, '&plus;')
    data = data.replace(/\\\;/g, '&semi;')
    data = data.replace(/\\\:/g, '&colon;')
    data = data.replace(/\\\,/g, '&comma;')
    data = data.replace(/\\\./g, '&period;')
    data = data.replace(/\\\//g, '&sol;')
    data = data.replace(/\\\?/g, '&quest;')
    data = data.replace(/\\\-/g, '&#45;')
    return data
}

const parseBlockquote = (lexedData, index) => {
    // index used to skip element untill the index on parent function
    let breakIndex;
    newData = {}
    newData.type = "blockquote";
    newData.value = [];
    // Check if it's followed by blockquote
    for(let i = index; i< lexedData.length; i++){
        // End the loop if it's not followed by blockquote
        if(!lexedData[i].includes.blockquote){ index = i; breakIndex = i; break; }
        else{
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
            if(lexedData[i].includes.link) blockquoteData.value = parseLink(blockquoteData.value)
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
    if(!breakIndex) breakIndex = lexedData.length - 1
    return {data:newData, breakIndex, endParagraph: breakIndex === lexedData.length - 1}
}

const parseImage = (data) => {
    let newData = {}
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
    return newData
}

const parseHeading = data => {
    newData = {}
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
                        newData.value = newValue + newData.value.slice(j - newData.headingLevel).trim()
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
        if(data.includes.link) newData.value = parseLink(newData.value)
    }else{
        // Class attribute
        if(data.includes.classUsage) newData = checkClassUsage(newData)
        if(data.includes.inlineStyle) newData = parseInlineStyle(newData)
        if(data.includes.link) newData.value = parseLink(newData.value)
        // Default heading id
        newData.headingId = newData.value.replace(/<\/?[^>]+(>|$)/g, "").replace(/ /g, '-').replace(/[^a-zA-Z0-6-]/g, '').toLowerCase().substring(0, 50)
    }
    return newData
}

// Function to sync indentation inside <pre> tags
const syncCodeIndentation = data => {
    let open = false;
    let defaultIndentation = 0;
    for(let i = 0; i< data.length; i++){
        if(data[i].includes.fencedCodeBlock){
            if(open){
                open = false;
            }else{
                open = true;
                defaultIndentation = data[i].totalTabs;
            }
        }else if(open){
            if(data[i].totalTabs - defaultIndentation >= 0)data[i].value = "\t".repeat(data[i].totalTabs - defaultIndentation) + data[i].value
            data[i].totalTabs = defaultIndentation
        }
    }
    return data
}

const parseUnorderedList = (lexedData, index) => {
    let newData = {};
    let breakIndex;
    newData.type = "unorderedList";
    newData.value = [];
    lexedData = syncCodeIndentation(lexedData)
    // Getting all unordered list children
    for(let i = index; i< lexedData.length; i ++){
        if(!lexedData[i].includes.unorderedList && !lexedData[i].hasTab){
            index = i;
            breakIndex = i;
            break;
        }
        else{
            newData.value.push(lexedData[i])
        }
    }
    // A recursive function to parse all Unordered List descendants
    const parseDescendants = (data, index, parentTabs) => {
        let result = []
        for(let i = index; i< data.length; i++){
            // Break the loop if it meets the next same-level unordered list
            if(data[i].totalTabs === parentTabs && i !== index) break;
            // Checking if a unordered list is descendant of the unordered list
            if(data[i].totalTabs === parentTabs + 1){
                // Checking if it's returning not empty array
                if(parseDescendants(data, i, data[i].totalTabs).length){
                    result.push(Object.assign({}, data[i], {descendants: parseDescendants(data, i, data[i].totalTabs)}))
                }else result.push(data[i])
            }
        }
        return result
    }
    // A recursive function to merge descendants parsed from parseDescendants function
    const mergeDescendants = data => {
        let result = "<ul>";
        for(let i = 0; i< data.length; i++){
            // If the line is new list
            if(data[i].includes.unorderedList){
                // Remove list syntax and returning it's value 
                let value = data[i].value.substr(2);
                value = parseTypography(value)
                value = escapeCharacters(value)
                value = parseLink(value)
                // Checking class usage
                let className = checkClassUsage({value})
                value = className.value
                className = className.className
                // Checking inline style
                let inlineStyle = parseInlineStyle({value})
                value = inlineStyle.value
                inlineStyle = inlineStyle.inlineStyle
                if(data[i].includes.image){
                    let imageData = parseImage(data[i])
                    value= `<img ${imageData.imageSrc?`src="${imageData.imageSrc}"`:""} ${imageData.altText?`alt="${imageData.altText}"`:""} ${parseStyleAndClassAtribute(data)} />`
                }
                // Add the <li> tag into result and calling this function again
                result += `<li${inlineStyle?` style="${inlineStyle}"`:""}${className? ` class="${className}"`:""}>${value}</li>`
            }else{
                let value = data[i].value;
                // Parse all syntax inside the list
                if(data[i].includes.horizontalRule) value = "<hr />"
                if(data[i].includes.fencedCodeBlock){
                    if(data[i].includes.classUsage) data[i] = checkClassUsage(Object.assign({}, data[i], {value}))
                    if(data[i].includes.inlineStyle) data[i] = parseInlineStyle(data[i])
                    value = `<pre ${parseStyleAndClassAtribute(data[i])}><code>`;
                    for(let j = i + 1; j< data.length; j++){
                        // Check if the line is a fenced code block close tag
                        if(data[j].includes.fencedCodeBlock){
                            i = j;
                            value += "</code></pre>"
                            break;
                        }else value += `${replaceSpecialCharacters(data[j].value)}<br />` // Add a <br> tag in the end of each line
                    }
                }
                if(data[i].includes.blockquote){
                    value = parseBlockquote(data, i)
                    i = value.breakIndex
                    value = value.data.value
                }
                if(data[i].includes.table){
                    value = parseTable(data, i)
                    i = value.breakIndex
                    value = value.data.value
                }
                if(data[i].includes.marquee){
                    value = parseMarquee(data[i]).value
                }
                if(data[i].includes.orderedList){
                    // Get new data with new indentation level
                    let newData = [];
                    for(let j = 0; j< data.length; j++){
                        if(!data[i].includes.orderedList) break;
                        else newData.push(Object.assign({}, data[j], {totalTabs: data[j].totalTabs - data[i].totalTabs}))
                    }
                    newData = parseOrderedList(newData, i)
                    i = newData.breakIndex
                    value = newData.data.value
                }
                if(data[i].includes.heading){
                    let headingData = parseHeading(data[i])
                    value = `<h${headingData.headingLevel} ${headingData.headingId?`id = "${headingData.headingId}`:""}" ${parseStyleAndClassAtribute(headingData)}>${headingData.value}</h${headingData.headingLevel}>`
                }
                if(data[i].includes.taskList){
                    let className = checkClassUsage({value})
                    value = className.value
                    className = className.className
                    let inlineStyle = parseInlineStyle({value})
                    value = inlineStyle.value
                    inlineStyle = inlineStyle.inlineStyle
                    value = `<div ${inlineStyle?` style="${inlineStyle}"`:""}${className? ` class="${className}"`:""}><input type="checkbox" id=${i} ${value[3] === "x" || value[3] === "X"?"checked":""} onclick="return false;" /><label for=${i}>${value.slice(5)}</label></div>`
                }
                value = parseTypography(value)
                value = escapeCharacters(value)
                value = parseLink(value)
                if(data[i].includes.image){
                    let imageData = parseImage(data[i])
                    value= `<img ${imageData.imageSrc?`src="${imageData.imageSrc}"`:""} ${imageData.altText?`alt="${imageData.altText}"`:""} ${parseStyleAndClassAtribute(data)} />`
                }
                // Checking class usage
                let className = checkClassUsage({value})
                value = className.value
                className = className.className
                // Checking inline style
                let inlineStyle = parseInlineStyle({value})
                value = inlineStyle.value
                inlineStyle = inlineStyle.inlineStyle
                // Add the <p> tag into result and calling this function again
                if(value) result += `<p${inlineStyle?` style="${inlineStyle}"`:""}${className? ` class="${className}"`:""}>${value}</p>`
            }
            if(data[i].descendants) result += mergeDescendants(data[i].descendants)
        }
        return result + "</ul>";
    }
    newData.value = mergeDescendants(parseDescendants(newData.value, 0, -1))
    if(!breakIndex) breakIndex = lexedData.length - 1
    return {data: newData, breakIndex, endParagraph: breakIndex === lexedData.length - 1}
}

const parseOrderedList = (lexedData, index) => {
    let newData = {};
    let breakIndex = 0;
    newData.type = "orderedList";
    newData.value = [];
    lexedData = syncCodeIndentation(lexedData)
    // Getting all ordered list children
    for(let i = index; i< lexedData.length; i ++){
        if(!lexedData[i].includes.orderedList && !lexedData[i].hasTab){
            index = i;
            breakIndex = i;
            break;
        }
        else{
            newData.value.push(lexedData[i])
        }
    }
    // A recursive function to parse all Ordered List descendants
    const parseDescendants = (data, index, parentTabs) => {
        let result = []
        for(let i = index; i< data.length; i++){
            // Break the loop if it meets the next same-level ordered list
            if(data[i].totalTabs === parentTabs && i !== index) break;
            // Checking if a ordered list is descendant of the ordered list
            if(data[i].totalTabs === parentTabs + 1){
                // Checking if it's returning not empty array
                if(parseDescendants(data, i, data[i].totalTabs).length){
                    result.push(Object.assign({}, data[i], {descendants: parseDescendants(data, i, data[i].totalTabs)}))
                }else result.push(data[i])
            }
        }
        return result
    }
    // A recursive function to merge descendants parsed from parseDescendants function
    const mergeDescendants = data => {
        let result = "<ol>";
        for(let i = 0; i< data.length; i++){
            // If the line is new list
            if(data[i].includes.orderedList){
                // Remove list syntax and returning it's value 
                let totalDigitsToRemove = 0
                let value = data[i].value
                for(let j = 0; j< value.length; j++){
                    if(isNaN(value[j])) break
                    else totalDigitsToRemove ++
                }
                value = value.substr(totalDigitsToRemove + 2)
                // Parse all syntax
                value = parseTypography(value)
                value = escapeCharacters(value)
                value = parseLink(value)
                // Checking class usage
                let className = checkClassUsage({value})
                value = className.value
                className = className.className
                // Checking inline style
                let inlineStyle = parseInlineStyle({value})
                value = inlineStyle.value
                inlineStyle = inlineStyle.inlineStyle
                if(data[i].includes.image){
                    let imageData = parseImage(data[i])
                    value= `<img ${imageData.imageSrc?`src="${imageData.imageSrc}"`:""} ${imageData.altText?`alt="${imageData.altText}"`:""} ${parseStyleAndClassAtribute(data)} />`
                }
                // Add the <li> tag into result and calling this function again
                result += `<li${inlineStyle?` style="${inlineStyle}"`:""}${className? ` class="${className}"`:""}>${value}</li>`
            }else{
                let value = data[i].value;
                // Parse all syntax inside the list
                if(data[i].includes.horizontalRule) value = "<hr />"
                if(data[i].includes.fencedCodeBlock){
                    if(data[i].includes.classUsage) data[i] = checkClassUsage(Object.assign({}, data[i], {value}))
                    if(data[i].includes.inlineStyle) data[i] = parseInlineStyle(data[i])
                    value = `<pre ${parseStyleAndClassAtribute(data[i])}><code>`;
                    for(let j = i + 1; j< data.length; j++){
                        // Check if the line is a fenced code block close tag
                        if(data[j].includes.fencedCodeBlock){
                            i = j;
                            value += "</code></pre>"
                            break;
                        }else value += `${replaceSpecialCharacters(data[j].value)}<br />` // Add a <br> tag in the end of each line
                    }
                }
                if(data[i].includes.blockquote){
                    value = parseBlockquote(data, i)
                    i = value.breakIndex
                    value = value.data.value
                }
                if(data[i].includes.table){
                    value = parseTable(data, i)
                    i = value.breakIndex
                    value = value.data.value
                }
                if(data[i].includes.marquee){
                    value = parseMarquee(data[i]).value
                }
                if(data[i].includes.heading){
                    let headingData = parseHeading(data[i])
                    value = `<h${headingData.headingLevel} ${headingData.headingId?`id = "${headingData.headingId}`:""}" ${parseStyleAndClassAtribute(headingData)}>${headingData.value}</h${headingData.headingLevel}>`
                }
                value = parseTypography(value)
                value = escapeCharacters(value)
                value = parseLink(value)
                if(data[i].includes.image){
                    let imageData = parseImage(data[i])
                    value= `<img ${imageData.imageSrc?`src="${imageData.imageSrc}"`:""} ${imageData.altText?`alt="${imageData.altText}"`:""} ${parseStyleAndClassAtribute(data)} />`
                }
                if(data[i].includes.taskList){
                    let className = checkClassUsage({value})
                    value = className.value
                    className = className.className
                    let inlineStyle = parseInlineStyle({value})
                    value = inlineStyle.value
                    inlineStyle = inlineStyle.inlineStyle
                    value = `<div ${inlineStyle?` style="${inlineStyle}"`:""}${className? ` class="${className}"`:""}><input type="checkbox" id=${i} ${value[3] === "x" || value[3] === "X"?"checked":""} onclick="return false;" /><label for=${i}>${value.slice(5)}</label></div>`
                }
                // Checking class usage
                let className = checkClassUsage({value})
                value = className.value
                className = className.className
                // Checking inline style
                let inlineStyle = parseInlineStyle({value})
                value = inlineStyle.value
                inlineStyle = inlineStyle.inlineStyle
                // Add the <p> tag into result and calling this function again
                if(value) result += `<p${inlineStyle?` style="${inlineStyle}"`:""}${className? ` class="${className}"`:""}>${value}</p>`
            }
            if(data[i].descendants) result += mergeDescendants(data[i].descendants)
        }
        return result + "</ol>";
    }
    newData.value = mergeDescendants(parseDescendants(newData.value, 0, -1))
    if(!breakIndex) breakIndex = lexedData.length - 1
    return {data: newData, breakIndex, endParagraph: breakIndex === lexedData.length - 1}
}

const parseTable = (lexedData, index) => {
    let newData = {type: "table", value: {head: [], body: []}};
    let breakIndex;
    const parseTableRow = row => {
        let tableRowValue = []
        // Checking the table syntax
        if(row[0] !== "|") return undefined;
        else{
            let tableDataValue = "";
            for(let i = 0; i < row.length; i++){
                // Parse class usage and inline style
                if(i === row.length - 1 && row[i] !== "|"){
                    tableDataValue += row[i]
                    // Parse class usage and inline style
                    classUsage = checkClassUsage({value: tableDataValue})
                    inlineStyle = parseInlineStyle({value: classUsage.value})
                    // Check if className and inline style is not empty string.
                    if(classUsage.className.length) newData.className = classUsage.className
                    if(inlineStyle.inlineStyle.length) newData.inlineStyle = inlineStyle.inlineStyle
                }
                else if(row[i] === "|"){
                    // Pushing table data value to table row value array if it's a not empty string table data value
                    let value = escapeCharacters(tableDataValue.trim())
                    // Parse the value if it's image
                    if(/!\[[^\]]*\]\((.*?)\s*("(?:.*[^"])")?\s*\)/.test(value)){
                        let newValue = {altText: "", imageSrc: ""}
                        for(let i = 0; i< value.length; i++){
                            //Check whether if it started with ![
                            if(value[i] === "!" && value[i + 1] === "["){
                                for(let j = i + 2; j< value.length; j++){
                                    //Break the loop if it is ended with ]
                                    if(value[j] === "]"){
                                        i = j;
                                        break;
                                    }else newValue.altText += value[j] //Otherwise save it as Alt text
                                }
                            }else if(value[i] === "("){
                                for(let j = i + 1; j< value.length; j++){
                                    if(value[j] === ")"){
                                        break;
                                    }else newValue.imageSrc += value[j] //Get image source
                                }
                            }
                        }
                        value = `<img src="${newValue.imageSrc}" alt="${newValue.altText}" />`
                    }else value = parseLink(parseTypography(value))
                    if(tableDataValue.length) tableRowValue.push(value)
                    tableDataValue = ""
                }else{
                    tableDataValue += row[i]
                }
            }
        }
        return tableRowValue
    }
    for(let i = index; i< lexedData.length; i++){
        if(!lexedData[i].includes.table){
            // Skip to not table syntax
            breakIndex = i;
            break;
        }else{
            if(i === index){
                newData.value.head = parseTableRow(lexedData[i].value)
            }else{
                // Function to check is it a heading syntax (===== OR -----)
                const checkHeadingSyntax = data => {
                    for(let j = 0; j < data.length; j++){
                        for(let k = 0; k< data[j].length; k++){
                            if(data[j][k] !== "-" && data[j][k] !== "=") return false;
                        }
                    }
                    return true;
                }
                // If it's not heading syntax, then push it to tbody
                if(!checkHeadingSyntax(parseTableRow(lexedData[i].value))){
                    newData.value.body.push(parseTableRow(lexedData[i].value))
                }
                if(i === lexedData.length - 1){
                    breakIndex = lexedData.length - 1;
                }
            }
        }
    }
    //Merge all to html tags
    const mergeTableRow = (tr, isHeading) => {
        let trValue = "<tr>";
        tr.forEach(td => {
            if(!isHeading) trValue += `<td>${td}</td>`;
            else trValue += `<th>${td}</th>`
        })
        return trValue + "</tr>"
    }
    let result = `<table ${parseStyleAndClassAtribute(newData)}><thead>${mergeTableRow(newData.value.head, true)}</thead><tbody>`;
    newData.value.body.forEach(tr => {
        result += mergeTableRow(tr, false)
    })
    result = `${result}</tbody></table>`;
    newData.value = result;
    // Delete inline style and class name key from newData to not to be parsed twice
    delete newData["inlineStyle"];
    delete newData["className"];
    if(!breakIndex) breakIndex = lexedData.length - 1
    return {data: newData, breakIndex, endParagraph: breakIndex === lexedData.length - 1}
}

const parseMarquee = data => {
    let newData = {type: "marquee", value: data.value.substr(2).trim()};
    // Parse class and inline style
    newData = checkClassUsage(newData);
    newData = parseInlineStyle(newData);
    // Check the marquee direction
    let direction = data.value.slice(0, 2) === "~>" ? "right": data.value.slice(0, 2) === "<~"? "left": null;
    newData.value =`<marquee direction="${direction}" ${parseStyleAndClassAtribute(newData)}>${newData.value}</marquee>`;
    // Remove class and inline style key so that it's not parsed twice
    delete newData.inlineStyle
    delete newData.className
    return newData
}
// Main Function
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
            data.value = escapeCharacters(data.value)
            // parse typography of the value except for link and image
            if(!data.includes.image && !data.includes.link){
                data.value = parseTypography(data.value)
            }
            // Checking the type of each data
            if(data.includes.fencedCodeBlock){
                newData.type = "fencedCodeBlock";
                newData.value = data.value
                if(data.includes.classUsage) newData = checkClassUsage(newData)
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
            else if(data.includes.stylesheet){
                newData.type = "stylesheet";
                newData.value = data.value.match(/(https?.\/\/[^\s]+)/g)[0]
            }
            else if(data.includes.externalScript){
                newData.type = "scripts";
                newData.value = data.value.match(/(https?.\/\/[^\s]+)/g)[0]
            }
            else if(data.includes.horizontalRule){
                newData.type = "plain"
                newData.value = "<hr />"
            }
            else if(data.includes.unorderedList){
                newData = parseUnorderedList(lexedData, index)
                // Checking if it's end of paragraph / file
                endParagraph = newData.endParagraph
                // Skip to not unordered list element
                index = newData.breakIndex
                newData = newData.data
            }
            else if(data.includes.orderedList){
                newData = parseOrderedList(lexedData, index)
                // Checking if it's end of paragraph / file
                endParagraph = newData.endParagraph
                // Skip to not ordered list element
                index = newData.breakIndex
                newData = newData.data
            }
            else if(data.includes.blockquote){
                newData = parseBlockquote(lexedData, index)
                // Checking if it's end of paragraph / file
                endParagraph = newData.endParagraph
                // Skip to not blockquote element
                index = newData.breakIndex
                newData = newData.data
            }
            else if(data.includes.table){
                newData = parseTable(lexedData, index);
                // Checking if it's end of paragraph / file
                endParagraph = newData.endParagraph;
                // Skip to not table element
                index = newData.breakIndex;
                newData = newData.data;
            }
            else if(data.includes.marquee){
                // Calling parseMarquee function
                newData = parseMarquee(data)
            }
            else if(data.includes.image){
                // Calling parseImage function
                newData = parseImage(data)
            }
            else if(data.includes.heading){
                // Calling parseHeading function
                newData = parseHeading(data)
            }
            else if(data.includes.taskList){
                newData.type = "taskList";
                data.value[3] === "x" || data.value[3] === "X" ? newData.checked = true: newData.checked = false
                newData.value = data.value.slice(5).trim()
                if(data.includes.classUsage) newData = checkClassUsage(newData)
                if(data.includes.inlineStyle) newData = parseInlineStyle(newData)
                if(data.includes.link) newData.value = parseLink(newData.value)
            }
            // Check if it is a plain text
            else if(Object.values(data.includes).indexOf(true) === -1 || 
            Object.values(data.includes).indexOf(true) === Object.keys(data.includes).indexOf("classUsage") ||
            Object.values(data.includes).indexOf(true) === Object.keys(data.includes).indexOf("inlineStyle") ||
            Object.values(data.includes).indexOf(true) === Object.keys(data.includes).indexOf("link")){
                newData.type = "plain"
                newData.value = data.value
                if(data.includes.classUsage) newData = checkClassUsage(newData)
                if(data.includes.inlineStyle) newData = parseInlineStyle(newData)
                if(data.includes.link) newData.value = parseLink(newData.value)
                // parse typography once again (important for line which contains link)
                newData.value = parseTypography(newData.value)
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
    let stylesheets = [];
    let scripts = [];
    // Convert parsed data to HTML tags
    const toHTML = data => {
        let htmlData = ""
        for(let i = 0; i< data.length; i++){
            // Check if whether it is a plain text, heading, fenced code block or others
            // Blockquote, list, table and marquee will be treated like plain text since its html tags parsed before
            if(data[i].type === "plain" || data[i].type === "blockquote" || data[i].type === "unorderedList" || data[i].type === "orderedList" || data[i].type === "table" || data[i].type === "marquee"){
                // Add br tags if there is next line and the current line is not horizontal rule inside the paragraph
                htmlData += `${data[i].className || data[i].inlineStyle?`<span ${parseStyleAndClassAtribute(data[i])}>${data[i].value}</span>`:`${data[i].value}`}${data[i + 1] && data[i].value !== "<hr />"?"<br />":""}`
            }else if(data[i].type === "heading"){
                htmlData += `<h${data[i].headingLevel} ${data[i].headingId?`id = "${data[i].headingId}`:""}" ${parseStyleAndClassAtribute(data[i])}>${data[i].value}</h${data[i].headingLevel}>`
            }else if(data[i].type === "fencedCodeBlock"){
                // Insert fenced code block value inside <code> and <pre> tags
                htmlData += `<pre ${parseStyleAndClassAtribute(data[i])}><code>${data[i].value}</code></pre>`
            }else if(data[i].type === "defineClass"){
                if(parsedStyleTag.indexOf(data[i].value) === -1) parsedStyleTag.push(data[i].value)
            }else if(data[i].type === "stylesheet"){
                if(stylesheets.indexOf(data[i].value) === -1) stylesheets.push(data[i].value)
            }else if(data[i].type === "scripts"){
                if(scripts.indexOf(data[i].value) === -1) scripts.push(data[i].value)
            }else if(data[i].type === "image"){
                htmlData += `<img ${data[i].imageSrc?`src="${data[i].imageSrc}"`:""} ${data[i].altText?`alt="${data[i].altText}"`:""} ${parseStyleAndClassAtribute(data[i])} />`
            }else if(data[i].type === "taskList"){
                htmlData += `<div ${parseStyleAndClassAtribute(data[i])}><input type="checkbox" id=${i} ${data[i].checked?"checked":""} onclick="return false;" /><label for="${i}">${data[i].value}</label></div>`
            }
        }
        return htmlData
    }
    //Gather all parsed information info html tags
    let parsedHtml = "";
    for(let i = 0; i< parsedData.length; i++){
        // Check if the paragraph don't need <p> tags
        let needParagraphTag = false;
        let needDivisonTag = false
        for(let j = 0; j< parsedData[i].length; j++){
            if(parsedData[i][j].type === "heading"){
                needParagraphTag = false;
                needDivisonTag = true;
                break
            }
            // If it's HTML element but not <a> tag
            else if(/<\/?[a-z][\s\S]*>/i.test(parsedData[i][j].value) && /<a>/i.test(parsedData[i][j].value)){
                needParagraphTag = false;
            }
            // No need <p> tag if it's blockquote text
            else if(parsedData[i][j].type === "blockquote"){
                needParagraphTag = false;
            }
            // No need <p> tag if there's no any plain text inside the paragraph
            else if(parsedData[i][j].type === "plain"){
                if((parsedData[i][j].value === "<hr />" && parsedData[i].length === 1) || /<\/?[a-z][\s\S]*>/i.test(parsedData[i][j].value)){
                    needParagraphTag = false;
                }else needParagraphTag = true
            }
        }
        toHTML(parsedData[i])? !needParagraphTag? needDivisonTag? parsedHtml += `<div>${toHTML(parsedData[i])}</div>` : parsedHtml += toHTML(parsedData[i]) : parsedHtml += `<p>${toHTML(parsedData[i])}</p>`: null;
    }
    return {body: parsedHtml, styles: parsedStyleTag, stylesheets, scripts};
}

module.exports = { Parse }