const Lex = (tokenizedData) => {
    let lexedData = [];
    for(let i = 0; i< tokenizedData.length; i++){
        let newData = {};
        // Showing what each line includes.
        newData.includes = {};
        // Check whether the line is Thematic Break
        if(tokenizedData[i].value.indexOf("---") === 0) newData.includes.horizontalRule = true
        else newData.includes.horizontalRule = false
        // Check whether the line is Ordered List
        if(!isNaN(tokenizedData[i].value.split(".")[0])){
            if(tokenizedData[i].value.split(".")[1] && tokenizedData[i].value.split(".")[1].indexOf(' ') === 0){
                newData.includes.orderedList = true
            }else newData.includes.orderedList = false
        }else newData.includes.orderedList = false
        // Check whether the line is Unordered List
        if(tokenizedData[i].value.indexOf("-") === 0 && tokenizedData[i].value.charCodeAt(0) === 45 && tokenizedData[i].value.indexOf(' ') === 1) newData.includes.unorderedList = true
        else newData.includes.unorderedList = false
        // Check whether the line is heading
        if(tokenizedData[i].value.indexOf("#") === 0 && tokenizedData[i].value.charCodeAt(1) === 32) newData.includes.heading = true
        else newData.includes.heading = false
        // Check whether the line is a blockquote
        if(tokenizedData[i].value.indexOf(">") === 0 && tokenizedData[i].value.charCodeAt(1) === 32) newData.includes.blockquote = true
        else newData.includes.blockquote = false
        // Copy other keys and value from tokenized data into lexed data
        newData = Object.assign(newData, tokenizedData[i]);
        // Add lexedData into array
        lexedData.push(newData)
    }
    return lexedData
}
module.exports = { Lex }