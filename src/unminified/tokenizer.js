const Tokenize = (abstractmark) => {
    let tokenizedData = [];
    let data = abstractmark.split('\n');
    //List to determine ammount of tab regardless the indentation
    let totalSpaceArray = []
    for (let i = 0; i < data.length; i++){
        let newData = {}
        //Checking wether the line is the last line
        if(data[i].endsWith('\r')) newData.lastElement = false
        else newData.lastElement = true
        //Remove \r from the value
        if(!newData.lastElement) newData.value = data[i].substring(0, data[i].length - 1)
        else newData.value = data[i]
        //Checking the line is in indentation
        if(data[i].charCodeAt(0) === 32 || data[i].charCodeAt(0) === 9) newData.hasTab = true
        else newData.hasTab = false
        //Count the ammount of spaces or tabs
        var totalSpace = 0
        var totalTabs = 0
        for(let j = 0; j< data[i].length; j++){
            if(data[i].charCodeAt(j) !== 32 && data[i].charCodeAt(j) !== 9) j = data[i].length // Break only the inner loop
            if(data[i].charCodeAt(j) === 9) totalTabs += 1
            else if (data[i].charCodeAt(j) === 32) totalSpace += 1
        }
        newData.totalSpace = totalSpace
        newData.totalTabs = totalTabs
        totalSpaceArray.push(totalSpace)
        //Remove indentation from the value
        newData.value = newData.value.trim()
        tokenizedData.push(newData)
    }
    //Greatest common factor function used for finding indentation space.
    const GCF = (a, b) => {
        return b === 0 ? a : GCF(b, a % b);
    }
    const findIndentationSpace = arrayOfTotalSpace => arrayOfTotalSpace.reduce(GCF)
    var indentationSpace = findIndentationSpace(totalSpaceArray)
    // Could not find constant indentation.
    if(indentationSpace === 1) console.log("\x1b[33mAbstractMark warning: 1 Space for indentation space might cause error or unexpected behavior. Please use atleast 2 spaces for your indentation  \x1b[0m")
    if(indentationSpace === 0) indentationSpace = 1
    //Find the total tabs of each line and delete the totalspace
    for(let i = 0; i< tokenizedData.length; i++){
        // Only continue if totalSpace is not null and is not undefined
        if(tokenizedData[i].totalSpace !== null && tokenizedData[i].totalSpace !== undefined && !tokenizedData[i].totalTabs){
            tokenizedData[i].totalTabs = tokenizedData[i].totalSpace / indentationSpace
            delete tokenizedData[i].totalSpace
        }
    }
    return tokenizedData
}
module.exports = {
    Tokenize
}