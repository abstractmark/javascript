const Tokenize=abstractmark=>{let tokenizedData=[],data=abstractmark.split("\n"),totalSpaceArray=[];for(let i=0;i<data.length;i++){let newData={};data[i].endsWith("\r")?newData.lastElement=!1:newData.lastElement=!0,newData.lastElement?newData.value=data[i]:newData.value=data[i].substring(0,data[i].length-1),32===data[i].charCodeAt(0)||9===data[i].charCodeAt(0)?newData.hasTab=!0:newData.hasTab=!1;var totalSpace=0,totalTabs=0;for(let j=0;j<data[i].length;j++)32!==data[i].charCodeAt(j)&&9!==data[i].charCodeAt(j)&&(j=data[i].length),9===data[i].charCodeAt(j)?totalTabs+=1:32===data[i].charCodeAt(j)&&(totalSpace+=1);newData.totalSpace=totalSpace,newData.totalTabs=totalTabs,totalSpaceArray.push(totalSpace),newData.value=newData.value.trim(),tokenizedData.push(newData)}const GCF=(a,b)=>0===b?a:GCF(b,a%b),findIndentationSpace=arrayOfTotalSpace=>arrayOfTotalSpace.reduce(GCF);var indentationSpace=findIndentationSpace(totalSpaceArray);1===indentationSpace&&console.log("[33mAbstractMark warning: 1 Space for indentation space might cause error or unexpected behavior. Please use atleast 2 spaces for your indentation  [0m"),0===indentationSpace&&(indentationSpace=1);for(let i=0;i<tokenizedData.length;i++)null===tokenizedData[i].totalSpace||void 0===tokenizedData[i].totalSpace||tokenizedData[i].totalTabs||(tokenizedData[i].totalTabs=tokenizedData[i].totalSpace/indentationSpace,delete tokenizedData[i].totalSpace);return tokenizedData};module.exports={Tokenize:Tokenize};