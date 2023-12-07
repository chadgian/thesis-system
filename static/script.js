var filteredFiles = [];

window.onload = function () {
    const option1 = document.querySelector(".option1-container");
    const option2 = document.querySelector(".option2-container");

    
    /*FOR OPTION 1*/

    const documentInput = document.getElementById('document');
    const documentsInput = document.getElementById('documents');
    const fileList = document.getElementById('file-list');
    const singleFile = document.getElementById('single-file');

    if (documentInput){
        documentInput.addEventListener('change', documentFileDisplay);
    }
    
    if (documentsInput){
        documentsInput.addEventListener('change', documentsFileDisplay);
    }
    

    function documentFileDisplay(event) {
        singleFile.innerHTML = ''; // Clear the list before adding new files

        const firstStatusFinished = document.getElementById('finished');
        firstStatusFinished.style.display = 'none';

        const file = event.target.files[0];
        if (!file) {
            singleFile.innerHTML = '<i>No files selected</i>';
        } else {
          const item = document.createElement('b');
          item.textContent = file.name;
          singleFile.appendChild(item);
        }
    }

    function documentsFileDisplay(event) {
        fileList.innerHTML = ''; // Clear the list before adding new files

        const files = event.target.files;
        if (files.length === 0) {
            const row = document.createElement('tr');
            const fileNameCell = document.createElement('td');
            fileNameCell.textContent = 'No files selected';
            const otherCell = document.createElement('td');
            otherCell.textContent = '';
            const otherCells = document.createElement('td');
            otherCells.textContent = '';
            row.appendChild(fileNameCell);
            row.appendChild(otherCell);
            row.appendChild(otherCells);
            fileList.appendChild(row);
        } else if (files.length > 20) {
            alert('Please select not more than 10 files.');

            documentsInput.value = '';
            return false;
        } else {
            for (let i = 0; i < files.length; i++) {
                const fileName = files[i].name;

                // Create a new row in the table
                const row = document.createElement('tr');

                // Create the cell for the file name in the leftmost column
                const fileNameCell = document.createElement('td');
                fileNameCell.textContent = fileName;
                fileNameCell.id = 'fname-'+i;

                // Create other cells in the row (you can add more cells as needed)
                const otherCell1 = document.createElement('td');
                otherCell1.id = 'result-'+i;
                otherCell1.style.padding = '5px';
                otherCell1.style.textAlign = 'left';
                otherCell1.style.alignItems = 'center';
                otherCell1.style.height = '100%';
                otherCell1.textContent = '';

                const otherCell2 = document.createElement('td');
                otherCell2.id = 'status-'+i;
                otherCell2.style.padding = '0px';
                otherCell2.style.textAlign = 'center';
                otherCell2.style.alignItems = 'center';
                otherCell2.style.height = '100%';
                otherCell2.textContent = '';
                const pendingImage = document.createElement('img');
                pendingImage.src = 'static/img/pending.gif';
                pendingImage.style.width = '3em';
                pendingImage.style.display = 'none';
                pendingImage.style.margin = '0 auto';
                pendingImage.id = 'pending-'+i;
                otherCell2.appendChild(pendingImage);
                const extractingImage = document.createElement('img');
                extractingImage.src = 'static/img/extracting.gif';
                extractingImage.style.width = '3em';
                extractingImage.style.display = 'none';
                extractingImage.style.margin = '0 auto';
                extractingImage.id = 'extracting-'+i;
                otherCell2.appendChild(extractingImage);
                const finishedImage = document.createElement('img');
                finishedImage.src = 'static/img/finished.png';
                finishedImage.style.width = '3em';
                finishedImage.style.display = 'none';
                finishedImage.style.margin = '0 auto';
                finishedImage.id = 'finished-'+i;
                otherCell2.appendChild(finishedImage);


                // Append cells to the row
                row.appendChild(fileNameCell);
                row.appendChild(otherCell1);
                row.appendChild(otherCell2);

                // Append the row to the table body
                fileList.appendChild(row);
            }
        }
    }

    /*FOR OPTION 2*/

    // const secondFiles = document.getElementById('secondDocuments');
    const option2Documents = document.getElementById('secondDocuments');

    if (option2Documents){
        option2Documents.addEventListener('change', option2DocumentsDisplay);
    }
    
    function option2DocumentsDisplay(event){
        const fileList2 = document.getElementById('filelist');
        const files2 = event.target.files;
        const fileFormats = ['pdf','doc','docx','jpg','jpeg','png','gif','webp','tiff','ppm','pgm','pbm'];
        filteredFiles = [];

        for (var i = 0; i < files2.length; i++) {
            var fileName = files2[i].name;
            var fileExtension = fileName.split('.').pop().toLowerCase();
            // alert (fileExtension);

            if (fileFormats.includes(fileExtension)) {
                filteredFiles.push(files2[i]);
            }
        }
        const numFiles = files2.length;
        const table = document.getElementById('option2table');

        /*----------------------------------------------------------------------*/
        if (fileList2.hasChildNodes()){
            while (fileList2.firstChild) {
                fileList2.removeChild(fileList2.firstChild);
            }
        }

        if (files2.length < 2) {
            alert('Please select atleast 2 files.');

            if (table.rows.length > 0) {
                // Delete all rows including the header row
                for (var i = table.rows.length - 1; i >= 0; i--) {
                    table.deleteRow(i);
                }
            }
            
            return;
        }

        if (files2.length > 10){
            alert('Please select not more than 10 files.');

            if (table.rows.length > 0) {
                // Delete all rows including the header row
                for (var i = table.rows.length - 1; i >= 0; i--) {
                    table.deleteRow(i);
                }
            }
            
            return;
        }
        
        const fileItemList = document.createElement('ol'); 
        for (let i = 0; i < files2.length; i++) {
            const fileName = files2[i].name; 
            const fileItem = document.createElement('li');

            fileItem.textContent = (i+1)+". "+fileName;
            fileItemList.appendChild(fileItem);
            fileList2.appendChild(fileItemList);
        }

        /*----------------------------------------------------------------------*/


        if (table.rows.length > 0) {
            // Delete all rows including the header row
            for (var i = table.rows.length - 1; i >= 0; i--) {
                table.deleteRow(i);
            }
        }

        for (let i = 0; i < numFiles+1; i++) {
            const row = table.insertRow();
            for (let j = 0; j < numFiles+1; j++) {
                if (i===0){
                    if (j===0){
                        const cell = row.insertCell();
                    }
                    else {
                        const cell = row.insertCell();
                        const cellId = 'f'+(j-1);
                        cell.textContent = j;
                        cell.id = cellId;
                    }
                }
                else {
                    if (j===0){
                        const cell = row.insertCell();
                        const cellId = 'f'+(i-1);
                        cell.textContent = i;
                        cell.id = cellId;
                    }
                    else {
                        const cell = row.insertCell();
                        const cellId = (i-1)+"-"+(j-1);
                        // cell.textContent = cellId;
                        cell.id = cellId;
                    }
                }
            }
        }
    }    
}

function firstOption() {
    const singleInput = document.getElementById('document');
    const multipleInput = document.getElementById('documents');

    if (singleInput.value === "" || multipleInput.value === ""){
        alert("Please select atlease one file in both input!");

        return false;
    }

    document.getElementById('upload-button').style.transform = 'scale(0)';
    setTimeout(function() {
        document.getElementById('upload-button').style.display = 'none';
        document.getElementById('loading').style.display = 'block';
    }, 100);


    const singleFile = singleInput.files[0];
    const multipleFiles = multipleInput.files;

    const formData1 = new FormData();

    if (singleFile) {
        formData1.append('file', singleFile);
    }

    for (let i = 0; i < multipleFiles.length; i++) {
        const pendingStatusCell = document.getElementById('pending-'+i);
        const extractingStatusCell = document.getElementById('extracting-'+i);
        const finishedStatusCell = document.getElementById('finished-'+i);
        pendingStatusCell.style.display = 'block'
        extractingStatusCell.style.display = 'none';
        finishedStatusCell.style.display = 'none';
    }

    const firstStatusExtracting = document.getElementById('extracting');
    const firstStatusFinished = document.getElementById('finished');
    firstStatusFinished.style.display = 'none';
    firstStatusExtracting.style.display = 'block';

    fetch('/calculate', {
        method: 'POST',
        body: formData1
    })
    .then(response => response.json())
    .then(data => {
        var firstResult = '';

        firstStatusExtracting.style.display = 'none';
        const firstStatusFinished = document.getElementById('finished');
        firstStatusFinished.style.display = 'block';

        for (let i = 0; i<multipleFiles.length; i++) {
            document.getElementById('result-'+i).textContent = '';
        }

        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                firstResult = data[key];
            }
        }

        let filesIndex = 0;

        function sendMultipleFiles(){
            if (filesIndex < multipleFiles.length){
                const pendingStatus = document.getElementById('pending-'+filesIndex);
                const extractingStatus = document.getElementById('extracting-'+filesIndex);
                const finishedStatus = document.getElementById('finished-'+filesIndex);

                pendingStatus.style.display = 'none';
                extractingStatus.style.display = 'block';


                const formData = new FormData();

                formData.append("files", multipleFiles[filesIndex]);
                formData.append("file", firstResult);

                fetch('/calculate', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(newData => {
                    var result = '';
                    var name = '';

                    for (const key in newData) {
                        if (Object.prototype.hasOwnProperty.call(newData, key)) {
                            result = newData[key];
                            name = key;
                        }
                    }

                    for(let i = 0; i<multipleFiles.length; i++){
                        if (document.getElementById('fname-'+i).textContent === name){
                            const resultCell = document.getElementById('result-'+i);
                            const newDiv = document.createElement('div');
                            const td = resultCell.appendChild(newDiv);
                            progressBar(td, result);

                            const statusCell = document.getElementById('status-'+i);
                            extractingStatus.style.display = 'none';
                            finishedStatus.style.display = 'block';
                        }
                    }

                    filesIndex++;
                    sendMultipleFiles();

                })
                .catch(error => {
                    alert('Second Fetch Error: '+error.message);
                    document.getElementById('loading').style.display = 'none';
                    document.getElementById('upload-button').style.display = 'block';
                    setTimeout(function(){
                        document.getElementById('upload-button').style.transform = 'scale(1)';    
                    }, 100);
                });
            }
            else {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('upload-button').style.display = 'block';
                setTimeout(function(){
                    document.getElementById('upload-button').style.transform = 'scale(1)';    
                }, 100);

                const lastFormData = new FormData();

                lastFormData.append("status", "done");

                fetch ('/calculate', {
                    method: 'POST',
                    body: lastFormData
                })

                return false;
            }
        }

        sendMultipleFiles();
    })
    .catch(error => {
        alert('First Fetch Error: '+error.message);
        document.getElementById('loading').style.display = 'none';
        document.getElementById('upload-button').style.display = 'block';
        setTimeout(function(){
            document.getElementById('upload-button').style.transform = 'scale(1)';    
        }, 100);
    });
}

function progressBar(td, percentage){
    td.style.display = 'flex';
    td.style.flexDirection = 'row';
    td.style.alignItems = 'center';
    td.style.gap = '2px';
    td.style.border = '0px';
    td.style.padding = '0px';
    td.style.height = '1em';
    td.style.position = 'relative';
    var progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    if (percentage === 'Empty document'){
        progressBar.style.width =  '100%';
        progressBar.style.backgroundColor = '#05174700';
        progressBar.textContent = 'Empty document';
        progressBar.style.color = '#333333';
        td.appendChild(progressBar);
    }
    else if (percentage === 'Unidentified file.'){
        progressBar.style.width =  '100%';
        progressBar.style.backgroundColor = '#05174700';
        progressBar.textContent = 'Unidentified file';
        progressBar.style.color = '#333333';
        td.appendChild(progressBar);
    }
    else{
        progressBar.style.width =  percentage;
        const num = parseFloat(percentage.slice(0, -1));
        if (num < 50.0){
            td.appendChild(progressBar);
            const percent = document.createElement('p');
            percent.textContent = percentage;
            td.appendChild(percent);
        }
        else {
            progressBar.textContent = percentage; 
            td.appendChild(progressBar);  
        }
    }
}

function whatFilename(){
    fname = document.getElementById('filename');
    notfname = document.getElementById('not-filename');

    if(notfname.style.display === "none"){
        fname.style.display = 'none';
        notfname.style.display = 'block';
    }
    else {
        notfname.style.display = 'none';
        fname.style.display = 'block';
    }
}

function secondOption() {
    let firstCounter = 0;

    document.getElementById('upload-button').style.transform = 'scale(0)';
    setTimeout(function() {
        document.getElementById('upload-button').style.display = 'none';
        document.getElementById('loading').style.display = 'block';
    }, 100);

    console.log("FIRST "+firstCounter);
    firstFunction();
    function firstFunction(){
        if(firstCounter < filteredFiles.length){
            const formData21 = new FormData();

            formData21.append("file", filteredFiles[firstCounter]);

            fetch("/calculate", {
                method: 'POST',
                body: formData21
            })
            .then(response => response.json())
            .then(data => {
                let firstResult = '';

                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        firstResult = data[key];
                    }
                }

                let secondCounter = firstCounter;

                console.log("SECOND "+secondCounter);
                secondFunction();
                function secondFunction(){
                    if(secondCounter < filteredFiles.length){
                        const formData22 = new FormData();

                        formData22.append("files", filteredFiles[secondCounter]);
                        formData22.append("file", firstResult);

                        fetch("/calculate", {
                            method: 'POST',
                            body: formData22
                        })
                        .then(response => response.json())
                        .then(newData => {
                            const tCell1 = document.getElementById(firstCounter+"-"+secondCounter);
                            const tCell2 = document.getElementById(secondCounter+"-"+firstCounter);

                            let result = "";
                            let name = "";

                            for (const key in newData) {
                                if (newData.hasOwnProperty(key)) {
                                    result = newData[key];
                                    name = key;
                                }
                            }

                            const floatResult = (parseFloat(result.split('%')[0]))/100;
                            const colorValue = Math.floor(255 * floatResult);
                            console.log(colorValue);

                            if (result === "Empty document"){
                                tCell1.innerHTML = "Empty";
                                tCell2.innerHTML = "Empty";
                            } else {
                                tCell1.innerHTML = result;
                                tCell2.innerHTML = result;
                            }
                            
                            tCell1.style.backgroundColor = `rgb(${colorValue}, ${colorValue}, ${colorValue})`;
                            tCell1.style.color = "#051747";
                            tCell2.style.backgroundColor = `rgb(${colorValue}, ${colorValue}, ${colorValue})`;
                            tCell2.style.color = "#051747";
                            
                            console.log(firstCounter+" vs. "+secondCounter);
                            secondCounter++;
                            secondFunction();
                        
                        })
                        .catch(error => {
                            alert('Second Function Fetch Error: '+error.message);
                        });
                    } else{
                        firstCounter++;
                        firstFunction();
                    }
                }
            })
            .catch(error => {
                alert('First Function Fetch Error: '+error.message);
            });
        } 
        else {
            document.getElementById('loading').style.display = 'none';
            document.getElementById('upload-button').style.display = 'block';
            setTimeout(function(){
                document.getElementById('upload-button').style.transform = 'scale(1)';    
            }, 100);
            const lastFormData = new FormData();
            lastFormData.append("status", "done");

            return fetch('/calculate', {
                method: 'POST',
                body: lastFormData
            })
            .catch(error => {
                alert('Final Fetch Error: '+error.message);
            });
        }
        
    }
}