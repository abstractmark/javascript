const Lex = (tokenizedData) => {
    let lexedData = [];
    for(let i = 0; i< tokenizedData.length; i++){
        let newData = {};
        // Showing what each line includes.
        newData.includes = {};
        // Check whether the line contains inline style
        if(/(.*?)\{((?!(\#|\!)))(.*?)\}/.test(tokenizedData[i].value)) newData.includes.inlineStyle = true
        else newData.includes.inlineStyle = false
        // Check whether the line contains class usage
        if(/(.*?)\{\.(.*?)\}/.test(tokenizedData[i].value)) newData.includes.classUsage = true
        else newData.includes.classUsage = false
        // Check whether the line contains heading ID
        if(/(.*?)\{\#(.*?)\}/.test(tokenizedData[i].value)) newData.includes.headingId = true
        else newData.includes.headingId = false
        // Check whether the line contains image
        if(/!\[[^\]]*\]\((.*?)\s*("(?:.*[^"])")?\s*\)/.test(tokenizedData[i].value)) newData.includes.image = true
        else newData.includes.image = false
        // Check whether the line contains link
        if(/(?<!\!)\[.+\]\(.+\)/.test(tokenizedData[i].value)) newData.includes.link = true
        else newData.includes.link = false
        // Check whether the line contains table
        if(/\|(.*?)\|/.test(tokenizedData[i].value)) newData.includes.table = true
        else newData.includes.table = false
        // Check whether the line contains task list
        if(/^- \[[xX ]\] \S+/.test(tokenizedData[i].value)) newData.includes.taskList = true
        else newData.includes.taskList = false
        // Check whether the line is class definition
        if(tokenizedData[i].value === "---define") newData.includes.defineClass = true
        else newData.includes.defineClass = false
        // Check whether the line is Thematic Break
        if(tokenizedData[i].value === "---") newData.includes.horizontalRule = true
        else newData.includes.horizontalRule = false
        // Check whether the line is a fenced code block
        if(/^\`\`\`/.test(tokenizedData[i].value)) newData.includes.fencedCodeBlock = true
        else newData.includes.fencedCodeBlock = false
        // Check whether the line is Ordered List
        if(/^\d+\. ./.test(tokenizedData[i].value)) newData.includes.orderedList = true
        else newData.includes.orderedList = false
        // Check whether the line is Unordered List
        if(/^- ((?!\[[xX ]\]).)*$/.test(tokenizedData[i].value)) newData.includes.unorderedList = true
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