const functions = require("firebase-functions");
const gcs = require('@google-cloud/storage')();
const os = require('os');
const path = require('path');
const spawn = require('child-process-promise').spawn;

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.onFileChange128= functions.storage.object().onFinalize(event => {

    const bucket = event.bucket;
    const contentType = event.contentType;
    const filePath = event.name;
    console.log('File change detected, function execution started');

    if (path.basename(filePath).startsWith('resized-')) {
        console.log('We already renamed that file!');
        return;
    }

    const destBucket = gcs.bucket(bucket);
    const tmpFilePath = path.join(os.tmpdir(), path.basename(filePath));
    const metadata = { contentType: contentType };
    return destBucket.file(filePath).download({
        destination: tmpFilePath
    }).then(() => {
        return spawn('convert', [tmpFilePath, '-resize', '512x512', tmpFilePath]).then(() => {
          return destBucket.upload(tmpFilePath, {
              destination: '512/resized-' + path.basename(filePath),
              metadata: metadata
          }).then(() => {
              return spawn('convert', [tmpFilePath, '-resize', '64x64', tmpFilePath]).then(() => {
              return destBucket.upload(tmpFilePath, {
                  destination: '64/resized-' + path.basename(filePath),
                  metadata: metadata
              });
            });
          });
        });
      });
});
// exports.onFileChange512x512= functions.storage.object().onFinalize(event => {
    
//         const bucket = event.bucket;
//         const contentType = event.contentType;
//         const filePath = event.name;
//         console.log('File change detected, function execution started');
    
//         if (path.basename(filePath).startsWith('resized512-')) {
//             console.log('We already renamed that file!');
//             return;
//         }
    
//         const destBucket = gcs.bucket(bucket);
//         const tmpFilePath = path.join(os.tmpdir(), path.basename(filePath));
//         const metadata = { contentType: contentType };
//         return destBucket.file(filePath).download({
//             destination: tmpFilePath
//         }).then(() => {
//             return spawn('convert', [tmpFilePath, '-resize', '512x512', tmpFilePath]);
           
//         }).then(() => {
//             return destBucket.upload(tmpFilePath, {
//                 destination: '512/resized512-' + path.basename(filePath),
//                 metadata: metadata
//             })
//         });
//     });
// exports.onFileChange64x64= functions.storage.object().onFinalize(event => {
    
//         const bucket = event.bucket;
//         const contentType = event.contentType;
//         const filePath = event.name;
//         console.log('File change detected, function execution started');
    
//         if (path.basename(filePath).startsWith('resized64-')) {
//             console.log('We already renamed that file!');
//             return;
//         }
    
//         const destBucket = gcs.bucket(bucket);
//         const tmpFilePath = path.join(os.tmpdir(), path.basename(filePath));
//         const metadata = { contentType: contentType };
//         return destBucket.file(filePath).download({
//             destination: tmpFilePath
//         }).then(() => {
//             return spawn('convert', [tmpFilePath, '-resize', '64x64', tmpFilePath]);
           
//         }).then(() => {
//             return destBucket.upload(tmpFilePath, {
//                 destination: '64/resized64-' + path.basename(filePath),
//                 metadata: metadata
//             })
//         });
//     });
