var filteredFiles = [];

window.onload = function () {
    const documents = document.getElementById('thirdDocuments');
    const root = document.getElementById('root');
    const lists = document.getElementById('list-files');

    documents.addEventListener('change', displayDirectory);

    function displayDirectory(event){
        const files = event.target.files;
        const fileFormats = ['pdf','doc','docx','jpg','jpeg','png','gif','webp','tiff','ppm','pgm','pbm'];
        filteredFiles = [];
        // files.reverse();

        // for (let i = 0; i < files.length; i++){
        //     let temp = files[i];
        //     files.splice(i, 1);
        //     files.splice(0, 0, temp);
        // }

        for (let i = 0; i < files.length; i++) {
            var fileName = files[i].name;
            var fileExtension = fileName.split('.').pop().toLowerCase();
            // alert (fileExtension);

            if (fileFormats.includes(fileExtension)) {
                filteredFiles.push(files[i]);
            }
        }
        const numFiles = filteredFiles.length;

        if (lists.hasChildNodes()){
            while (lists.firstChild) {
                lists.removeChild(lists.firstChild);
            }
        } 
        
        if (files){
            root.innerHTML = ''+filteredFiles[0].webkitRelativePath.split('/')[0];
        }

        // alert(filteredFiles[0].webkitRelativePath+"---"+filteredFiles[filteredFiles.length-1].webkitRelativePath);

        const rootList = document.createElement('ul');
        for (let i = 0; i < filteredFiles.length; i++) {
            const fileDirectory = filteredFiles[i].webkitRelativePath.split('/');
            const directoryLength = fileDirectory.length;
            console.log("File: "+(i+1)+" ("+filteredFiles[i].webkitRelativePath.split('/')[directoryLength-1]+")"+" - "+directoryLength+" section long.");

            for (let j = 1; j < directoryLength; j++){
                console.log("   - Section "+(j+1));
                if (j === 1 && j < directoryLength - 1){
                    if(document.getElementById(fileDirectory[j]+"-folder") === null){
                        console.log("      - This is FOLDER "+(i+1));
                        const childList = document.createElement("li");
                        childList.innerHTML = "<b><u>"+fileDirectory[j]+"</b></u>";
                        childList.id = fileDirectory[j]+"-folder";
                        rootList.appendChild(childList);
                        lists.appendChild(rootList);
                    } else {
                        continue;
                    }
                } else if (j < directoryLength - 1){
                    if (document.getElementById(fileDirectory[j]+"-folder") === null){
                        console.log("      - This is FOLDER "+(i+1));
                        const rootFolder = document.getElementById(fileDirectory[j-1]+"-folder");
                        const childRoot = document.createElement("ul");
                        const childList1 = document.createElement('li');
                        childList1.innerHTML = "<b><u>"+fileDirectory[j]+"</b></u>";
                        childList1.id = fileDirectory[j]+"-folder";
                        childRoot.appendChild(childList1);
                        rootFolder.appendChild(childRoot);
                        rootList.appendChild(rootFolder);
                        lists.appendChild(rootList);
                    } else {
                        continue;
                    }
                } else if (j === directoryLength - 1){
                    if (j === 1){
                        const file = document.createElement('li');
                        file.textContent = fileDirectory[j];
                        file.id = fileDirectory[j]+"-id";
                        rootList.appendChild(file);
                        lists.appendChild(rootList);
                    } else{
                        const finalFolder = document.getElementById(fileDirectory[j-1]+"-folder");
                        const fileList = document.createElement('ul');
                        const file = document.createElement('li');
                        file.textContent = fileDirectory[j];
                        file.id = fileDirectory[j]+"-file";
                        fileList.appendChild(file);
                        finalFolder.appendChild(fileList);
                        rootList.appendChild(finalFolder);
                        lists.appendChild(rootList);
                    }
                } else {
                    continue;
                }
            }
        }
        

        if (filteredFiles.length === 0) {
            return;
        }


    }
}

var jsonData;

function thirdFeature(){
    const documentsLists = document.getElementById('thirdDocuments').files;

    const formData = new FormData();

    for (let i = 0; i < documentsLists.length; i++){
        formData.append("documents", documentsLists[i]);
    }


    fetch('/calculate', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // alert('data received');
        jsonData = data;
        alert("You can now search!");
    })
    .catch(error => {
        alert('First Error: '+error.message);
    });

    if (jsonData){
        const lastFormData = new FormData();

        lastFormData.append("status", "done");

        fetch ('/calculate', {
            method: 'POST',
            body: lastFormData
        })
        .catch(error => {
            alert('Final Fetch Error: '+error.message);
        });
    }
}

function searchContent(){
    const displayResult = document.getElementById('result');

    if(!jsonData) {
        alert('Please finish uploading the file first before searching.');
        return false;
    }

    if (displayResult.hasChildNodes()){
        while (displayResult.firstChild) {
            displayResult.removeChild(displayResult.firstChild);
        }
    } 
    const keyword = document.getElementById('keyword').value;
    // alert(keyword);

    const formData1 = new FormData();

    formData1.append('keyword', keyword);

    fetch('/calculate', {
        method: 'POST',
        body: formData1
    })
    .then(response => response.json())
    .then(data => {
        var processedKeyword = "";
        for (const key in data){
            if (data.hasOwnProperty(key)){
                processedKeyword = data[key].split(' ');
            }
        }

        console.log(processedKeyword);

        const resultArray = [];

        const resultList = document.createElement("ul");
        for (const key in jsonData){
            // alert('const key in data');
            if (jsonData.hasOwnProperty(key)){
                // alert('data has own property');
                const value = jsonData[key].split(' ');
                const allKeywordsPresent = processedKeyword.every(keywordItem => value.includes(keywordItem));

                if (allKeywordsPresent){
                    const resultValue = searchFile(processedKeyword, value);
                    console.log(key+" - "+resultValue);
                    const result = key+"%"+resultValue;
                    resultArray.push(result);


                    // alert(result);
                    
                }
            }
        }

        const finalResultArray = sortFiles(resultArray);

        for (let i = 0; i < finalResultArray.length; i++){
            const resultListChild = document.createElement("li");
            resultListChild.innerHTML = finalResultArray[i]; //+"<br>"
            resultList.appendChild(resultListChild);
        }
        displayResult.appendChild(resultList);
    })
    .catch(error => {
        alert('Keyword Fetch Error: '+error.message);
    });

    const lastFormData = new FormData();

    lastFormData.append("status", "done");

    fetch ('/calculate', {
        method: 'POST',
        body: lastFormData
    })
    .catch(error => {
        alert('Final Fetch Error: '+error.message);
    });
}

function searchFile (keyword, file){
    const keywordLength = keyword.length;
    const fileLength = file.length;

    let counter = 0;

    for (let i = 0; i < keywordLength; i++){
        for (let j = 0; j < fileLength; j++){
            if(file[j].includes(keyword[i])){
                counter++;
            } else {
                continue;
            }
        }
    }

    return counter;
}

function sortFiles(arr) {
    let sorted = [];

    for (let i = 0; i < arr.length; i++) {
        let fileName = arr[i].split("%")[0];
        let fileValue = parseInt(arr[i].split("%")[1]);

        if (sorted.length === 0) {
            sorted.push({ fileName, fileValue });
        } else {
            let inserted = false;

            for (let j = 0; j < sorted.length; j++) {
                if (fileValue > sorted[j].fileValue) {
                    sorted.splice(j, 0, { fileName, fileValue });
                    inserted = true;
                    break;
                }
            }

            if (!inserted) {
                sorted.push({ fileName, fileValue });
            }
        }
    }

    let sortedFileNames = sorted.map(item => item.fileName);

    return sortedFileNames;
}