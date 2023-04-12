const path=require('path')
const express=require('express')
const dotenv=require('dotenv').config()
const port=process.env.PORT||5000
const app=express()

// Enable body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set static folder
app.get('/api/enccomp',(req,res)=>{
   
})
app.use("/api/home",express.static(path.join(__dirname, 'frontend/public')));


// const fs = require('fs');
// const zlib = require('zlib');
// const crypto = require('crypto');
// // Middleware for compressing and encrypting files
// app.use("/api",(req, res, next) => {
//   const filePath = '/path/to/file.txt'; // Replace with the path to your file
//   const fileContents = fs.createReadStream(filePath);
//   const gzip = zlib.createGzip();
//   const cipher = crypto.createCipher('aes-256-cbc', 'mysecretkey');

//   res.set({
//     'Content-Type': 'application/octet-stream',
//     'Content-Disposition': 'attachment; filename="compressed-encrypted-file.bin"',
//     'Content-Encoding': 'gzip',
//   });

//   fileContents.pipe(gzip).pipe(cipher).pipe(res);
// });



app.listen(port, () => console.log(`Server started on port ${port}`));