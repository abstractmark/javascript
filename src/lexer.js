const Lex = (tokenizedData) => {
    let lexedData = [];
    for(let i = 0; i< tokenizedData.length; i++){
        let newData = {};
        // Showing what each line includes.
        newData.includes = {};
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