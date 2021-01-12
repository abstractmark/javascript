const Tokenize = (abstractmark) => {
    let tokenizedData = [];
    let data = abstractmark.split('\n');
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
        var totalTab = 0
        for(let j = 0; j< data[i].length; i++){
            if(data[i].charCodeAt(j) !== 32 && data[i].charCodeAt(j) !== 9) break
            if(data[i].charCodeAt(j) === 9) totalTab += 1
            else if (data[i].charCodeAt(j) === 32) totalTab += 1
        }
        newData.totalTab = totalTab
        //Remove indentation from the value
        newData.value = newData.value.trim()
        tokenizedData.push(newData)
    }
    return tokenizedData
}
module.exports = {
    Tokenize
}