const Lex = (tokenizedData) => {
    let lexedData = [];
    for(let i = 0; i< tokenizedData.length; i++){
        let newData = {};
        // Showing what each line includes.
        newData.includes = {};
        // Check whether the line contains bold text
        if(/\*\*(.*?)\*\*/.test(tokenizedData[i].value)) newData.includes.bold = true
        else newData.includes.bold = false
        // Check whether the line contains italic text
        if(/_(.*?)_/.test(tokenizedData[i].value)) newData.includes.italic = true
        else newData.includes.italic = false
        // Check whether the line contains underline text
        if(/%(.*?)%/.test(tokenizedData[i].value)) newData.includes.underline = true
        else newData.includes.underline = false
        // Check whether the line contains task list
        if(/^- \[.\]/.test(tokenizedData[i].value)) newData.includes.taskList = true
        else newData.includes.taskList = false
        // Check whether the line contains escape character
        if(/\\[^A-Z0-9a-z]/.test(tokenizedData[i].value)) newData.includes.escapeChar = true
        else newData.includes.escapeChar = false
        // Check whether the line is Thematic Break
        if(tokenizedData[i].value === "---") newData.includes.horizontalRule = true
        else newData.includes.horizontalRule = false
        // Check whether the line is Ordered List
        if(/^\d+\. ./.test(tokenizedData[i].value)) newData.includes.orderedList = true
        else newData.includes.orderedList = false
        // Check whether the line is Unordered List
        if(/^- ./.test(tokenizedData[i].value)) newData.includes.unorderedList = true
        else newData.includes.unorderedList = false
        // Check whether the line is heading
        if(/^#{1,6} ./.test(tokenizedData[i].value)) newData.includes.heading = true
        else newData.includes.heading = false
        // Check whether the line is a blockquote
        if(/^>+ ./.test(tokenizedData[i].value)) newData.includes.blockquote = true
        else newData.includes.blockquote = false
        // Copy other keys and value from tokenized data into lexed data
        newData = Object.assign(newData, tokenizedData[i]);
        // Add lexedData into array
        lexedData.push(newData)
    }
    return lexedData
}
module.exports = { Lex }