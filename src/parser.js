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
            // Checking the type of each data
            if(data.includes.heading){
                newData.type = "heading";
                newData.headingLevel = 0;
                for(let j = 0; j< data.value.length; j++){
                    if(data.value[j] !== "#") break
                    else newData.headingLevel += 1
                }
                newData.value = data.value.substring(newData.headingLevel + 1)
                paragraphValue.push(newData)
            }
            // Temporary data (will be changed later)
            else paragraphValue.push(data)
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
    // Convert parsed data to HTML tags
    const toHTML = (data) => {
        let htmlData = ""
        for(let i = 0; i< data.length; i++){
            if(data[i].type == "heading"){
                htmlData += `<h${data[i].headingLevel}>${data[i].value}</h${data[i].headingLevel}>`
            }else{
                htmlData += "<br />"
            }
        }
        return htmlData
    }
    //Gather all parsed information info html tags
    let parsedHtml = "";
    for(let i = 0; i< parsedData.length; i++){
        parsedHtml += `<p>${toHTML(parsedData[i])}</p>`
    }
    return parsedHtml;
}

module.exports = { Parse }