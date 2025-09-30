
/*
Task 1 : Simple File Writer & Reader
 
* Create a Node.js program that: (Use "fs" package) 
 
1. Writes some text into a file.
 
2. Reads the file content and prints it in the console.
 
3. Appends extra text to the same file.
 
 
- Prepare three separate Apis for Above task, Add dynamic content in file via postman Api call
 
*/

const fs = require('fs');

module.exports.writeFile = (req, res) => {
    try {
        const data = req.body.data ;  
        fs.writeFileSync('Naresh.txt', data);
       return res.send('File written successfully');  
    }
    catch (error) {
        res.status(500).send('Error writing file: ' + error);
    }
}



module.exports.readFile = (req, res) => {
    try {
        const data = fs.readFileSync('Naresh.txt', 'utf8');
         return res.send('File content: ' + data);
    } catch (error) {
        res.status(500).send('Error reading file: ' + error);
    }
};


module.exports.appendFile = (req, res) => {
    try {
        const data1 = req.body.data ;  
        fs.appendFileSync('Naresh.txt', data1);
       return res.send('File appended successfully');  
    }   
    catch (error) {

        res.status(500).send('Error appending file: ' + error);
    }   
};