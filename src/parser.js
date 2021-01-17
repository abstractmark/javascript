const Parse = lexedData => {
    let parsedData = [];
    // Assign Paragraph Variable
    let endParagraph = false;
    let paragraphValue = [];
    // First, divide lexed Data by paragraph
    lexedData.forEach((data, index) => {
        if(data.value === "" && endParagraph) endParagraph = false;
        else if(data.value === "" && !endParagraph) endParagraph = true;
        else paragraphValue.push(data)
        // If it's the end of paragraph or it's end of the file
        if(endParagraph || data.lastElement){
            //Reset Variable to Default
            endParagraph = false
            //Push Pragraph information to parsedData
            parsedData.push(paragraphValue)
            paragraphValue = []
        }
    })
    return parsedData;
}

module.exports = { Parse }