const path=require('path')
const express=require('express')
const multer = require('multer');
const zlib = require('zlib');
const crypto = require('crypto');
const fs = require('fs');
const dotenv=require('dotenv').config()
const port=process.env.PORT||5000
const app=express()

// Enable body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Define the directory to which files will be saved
const uploadDirectory = './uploads';

// Set up multer for file upload handling
const storage = multer.diskStorage({
  destination: uploadDirectory,
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
    // Check the file extension
    if (file.originalname.endsWith('.pdf')) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error('File type not allowed!'), false); // Reject the file
    }
  };
const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

app.post('/upload',upload.single('file'),(req,res)=>{
    const file = req.file.buffer;
  const password = req.body.password;

  // Compress the file
  zlib.deflate(file, (err, compressed) => {
    if (err) {
        console.log('defalte mai error tha')
      return res.status(500).send('Failed to compress file');
    }

    // Encrypt the compressed file
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(password, 'salt', 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(compressed);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    // Send the encrypted file to the client
    try{
        res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename="encrypted.compressed"'
    });
    res.send(Buffer.concat([iv, encrypted]));
}
catch(e){
    console.log('idhar tha error')
}
  });
})
// Set static folder
// app.get('/api/enccomp',(req,res)=>{
   
// })
app.use("/api/home",express.static(path.join(__dirname, 'frontend/public')));


app.listen(port, () => console.log(`Server started on port ${port}`));