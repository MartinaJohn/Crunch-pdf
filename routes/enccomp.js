export default enccomp
{
    console.log('Hello')
const fs = require('fs');
const zlib = require('zlib');
const crypto = require('crypto');

// Define the input and output file paths
const inputFile = '/path/to/input/file';
const outputFile = '/path/to/output/file';

// Define the encryption password
const password = 'mySecretPassword';

// Read the input file into a buffer
const inputBuffer = fs.readFileSync(inputFile);

// Encrypt the input data using AES-256-CBC cipher
const iv = crypto.randomBytes(16);
const cipher = crypto.createCipheriv('aes-256-cbc', password, iv);
const encryptedBuffer = Buffer.concat([iv, cipher.update(inputBuffer), cipher.final()]);

// Compress the encrypted data using zlib
const compressedBuffer = zlib.gzipSync(encryptedBuffer);

// Write the compressed and encrypted data to the output file
fs.writeFileSync(outputFile, compressedBuffer);

console.log('File encrypted and compressed successfully.');
}
