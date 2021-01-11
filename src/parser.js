const Parse = (abstractmark) => {
    let parsedData = [];
    let data = abstractmark.split('\n');
    for (let i = 0; i < data.length; i++){
        let newData = {}
        if(data[i].endsWith('\r')) newData.lastElement = false
        else newData.lastElement = true
        if(!newData.lastElement) newData.value = data[i].substring(0, data[i].length - 1)
        else newData.value = data[i]
        parsedData.push(newData)
    }
    return parsedData
}
module.exports = {
    Parse
}