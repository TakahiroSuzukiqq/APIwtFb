// import { read } from 'fs';

const functions = require('firebase-functions');
const os =  require('os');                       //operating system to run specific functions
const path = require('path');                    //also use path packege from nodejs package, //by using os and path construct the temporarily path
const spawn = require('child-process-promise').spawn;//Image magic to resize images
const cors = require('cors')({origin: true});
const Busboy = require('busboy');
const fs = require("fs");

const gcconfig = {
    projectId: "project_name",
    keyFilename: "YOUR_Firebase_SECRET_KEY_NAME.json"  //#The key name is the same name as saved file.
  };

const gcs = require('@google-cloud/storage')(gcconfig);  //(); execute as a function

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.onFileChange = functions.storage.object().onChange( event => {

    //console.log(event);
    const object = event.data;
    const bucket = object.bucket;
    const contentType = object.contentType;
    const filePath = object.name;
    console.log('File change detected, function execution started');

    if (object.resourceState === 'not_exists') {
        console.log('We deleted the file, exit...');
        return;
    }

    // if (path.basename(filePath).startsWith('renamed-')) {
    if (path.basename(filePath).startsWith('resized-')) {
        console.log('We have already renamed that file!')
        return;
    }

    const destBucket = gcs.bucket(bucket);
    //const tmpFilePath = psth.join(os.tmpdir(), filePath);  //the tmp file path: filePath: filename of the uploaded one
    const tmpFilePath = path.join(os.tmpdir(), path.basename(filePath));  //the tmp file path: filePath: filename of the uploaded one
    const metadata = { contentType: contentType };//the place to store the tmp file
    return destBucket.file(filePath).download({  //allows to execute operation on a file = (filePath), and download
        destination: tmpFilePath  //the configuration to make sure to where we want to download by using the destination key
        //download the file from firebase to the temorarily folder
        }).then(() => {
            return spawn('convert', [tmpFilePath, '-resize', '500x500', tmpFilePath]); // convrt from where what to do how to do and to where, by using image magic
            // return destBucket.upload(tmpFilePath, {
            //     destination: 'renamed-' + path.basename(filePath),                       //rename the file
            //     metadata: metadata
            // })
        }).then(() => {
            return destBucket.upload(tmpFilePath, {
                destination: 'resized-' + path.basename(filePath),                       //rename the file
                metadata: metadata
            })
        });
});


//#Endpoint as an API: this function get executed whenever https rewuest reaches the endpoint "fileupload".
exports.uploadFile = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        if (req.method !== "POST") {
            return res.status(500).json({
                message: "Invalid request!"      
            });
        }
        //#Allow busboy to find out whoever the incoming request of type form data or not so if it should parse or not
        const busboy = new Busboy({ headers: req.headers }); 
        let uploadData = null;

        busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
            const filepath = path.join(os.tmpdir(), filename);
            uploadData = { file: filepath, type: mimetype };
            file.pipe(fs.createWriteStream(filepath))
        });    //#OnLister to listen to file events usually triggered when busboy parse the incoming data
        
        busboy.on("finish", () => {
            const bucket = gcs.bucket("test-sakura.appspot.com");  //##Your bucket name on Firebase
            bucket
                .upload(uploadData.file, {
                    uploadType: "media",
                    metadata: {
                        metadata: {
                            contentType: uploadData.type
                    }
                }
            })
            .then(() => {
                return res.status(200).json({
                    message: "It worked!"
                });
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });
        });
        busboy.end(req.rawBody);
    });
});