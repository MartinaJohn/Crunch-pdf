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
// const uploadDirectory = './uploads';

// // Set up multer for file upload handling
// const storage = multer.diskStorage({
//   destination: uploadDirectory,
//   filename: function(req, file, cb) {
//     cb(null, file.originalname);
//   }
// });
// const fileFilter = (req, file, cb) => {
//     // Check the file extension
//     if (file.originalname.endsWith('.pdf')) {
//       cb(null, true); // Accept the file
//     } else {
//       cb(new Error('File type not allowed!'), false); // Reject the file
//     }
//   };
// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter
// });

// app.post('/upload',upload.single('file'),(req,res)=>{
//     const file = req.file.buffer;
//   const password = req.body.password;

//   // Compress the file
//   zlib.deflate(file, (err, compressed) => {
//     if (err) {
//         console.log('defalte mai error tha')
//       return res.status(500).send('Failed to compress file');
//     }

//     // Encrypt the compressed file
//     const algorithm = 'aes-256-cbc';
//     const key = crypto.scryptSync(password, 'salt', 32);
//     const iv = crypto.randomBytes(16);
//     const cipher = crypto.createCipheriv(algorithm, key, iv);
//     let encrypted = cipher.update(compressed);
//     encrypted = Buffer.concat([encrypted, cipher.final()]);

//     // Send the encrypted file to the client
//     try{
//         res.set({
//       'Content-Type': 'application/octet-stream',
//       'Content-Disposition': 'attachment; filename="encrypted.compressed"'
//     });
//     res.send(Buffer.concat([iv, encrypted]));
// }
// catch(e){
//     console.log('idhar tha error')
// }
//   });
// })
// // Set static folder
// // app.get('/api/enccomp',(req,res)=>{
   
// // })

// const upload = multer();

// app.post('/upload', upload.single('file'), (req, res) => {
//   // Check if a file was uploaded
//   if (!req.file) {
//     return res.status(400).send('No file uploaded');
//   }

//   // Create a buffer from the uploaded file data
//   const fileBuffer = req.file.buffer;

//   // Generate a random encryption key
//   const encryptionKey = crypto.randomBytes(32);

//   // Create a cipher using the encryption key
//   const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, crypto.randomBytes(16));

//   // Compress the encrypted data using zlib
//   const compressedData = zlib.gzipSync(cipher.update(fileBuffer));

//   // Finalize the encryption and compression
//   const encryptedData = Buffer.concat([cipher.final(), compressedData]);

//   // Send the encrypted and compressed data back to the client
//   res.setHeader('Content-disposition', 'attachment; filename=encrypted_file.bin');
//   res.setHeader('Content-type', 'application/octet-stream');
//   res.send(encryptedData);
// });
// Set up Multer to handle file uploads
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// // Define a route to handle file uploads
// app.post('/upload', upload.single('file'), (req, res, next) => {
//   const algorithm = 'aes-256-cbc';
//   const password = res.locals.password; // replace with your fixed password
//   const iv = crypto.randomBytes(16);

//   const cipher = crypto.createCipheriv(algorithm, password, iv);
//   let encrypted = cipher.update(req.file.buffer);
//   encrypted = Buffer.concat([encrypted, cipher.final()]);

//   const compressed = zlib.gzipSync(encrypted);

//   res.locals.password = password;
//   res.locals.iv = iv;
//   res.locals.compressed = compressed;
//   next();
// });

// // Define a route to handle file downloads
// app.get('/download', (req, res) => {
//   const algorithm = 'aes-256-cbc';
//   const password = res.locals.password;
//   const iv = res.locals.iv;
//   const compressed = res.locals.compressed;

//   const decrypted = decryptAndDecompress(compressed, algorithm, password, iv);
//   res.setHeader('Content-disposition', 'attachment; filename=file.pdf');
//   res.setHeader('Content-Type', 'application/pdf');
//   res.send(decrypted);
// });

// // Helper function to decrypt and decompress the file
// function decryptAndDecompress(compressedData, algorithm, password, iv) {
//   const decipher = crypto.createDecipheriv(algorithm, password, iv);
//   let decrypted = decipher.update(compressedData);
//   decrypted = Buffer.concat([decrypted, decipher.final()]);

//   return zlib.gunzipSync(decrypted);
// }


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define a route to handle file uploads
app.post('/upload', upload.single('file'), (req, res, next) => {
  const algorithm = 'aes-256-cbc';
  const password = req.body.password;
  // const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(req.file.buffer);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  const compressed = zlib.gzipSync(encrypted);

  res.locals.password = password;
  res.locals.iv = iv;
  res.locals.compressed = compressed;
  next();
});

// Define a route to handle file downloads
app.get('/download', (req, res) => {
  const algorithm = 'aes-256-cbc';
  const password = res.locals.password;
  const iv = res.locals.iv;
  const compressed = res.locals.compressed;

  const decrypted = decryptAndDecompress(compressed, algorithm, password, iv);
  res.setHeader('Content-disposition', 'attachment; filename=file.pdf');
  res.setHeader('Content-Type', 'application/pdf');
  res.send(decrypted);
});

// Helper function to decrypt and decompress the file
function decryptAndDecompress(compressedData, algorithm, password, iv) {
  const decipher = crypto.createDecipheriv(algorithm, password, iv);
  let decrypted = decipher.update(compressedData);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return zlib.gunzipSync(decrypted);
}
app.use("/api/home",express.static(path.join(__dirname, 'frontend/public')));


app.listen(port, () => console.log(`Server started on port ${port}`));