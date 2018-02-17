# Description   
This project is the Firebase function created on local, using javascript(Nodejs).    
You can upload image files one by one by doing POST request and everytime the file being uploaded, its name renamed and it is also resized. You can find both the original file which is uploaded file from the browser and its resized file in your Firebase storage.   
   
Followed the tutorial [Firebase Cloud Functions - Resizing Images after Upload by Academind](https://www.youtube.com/watch?v=YGsmWKMMiYs&t=14s) and [Creating a REST API with Cloud Functions by Academind](https://academind.com/learn/firebase/cloud-functions/creating-a-rest-endpoint-with-cloud-functions).       
    
   
# CLI  
````  
 $ mkdir YOUR_PROJECT_NAME
 $ cd THE_PROJECT 
 $ firebase init
($ firebase use --add)
 $ firebase deploy
````  
      
          
# TIPS   
````   
Google storage for the temp folder   
 $ npm install --save @google-cloud/storage  
Image magic    
 $ npm install --save child-process-promise   
Cors    
 $ npm install --save cors  
Parses the incoming request body for form data  
 $ npm install --save busboy  
````      
      
         
# Reference  
[Firebase](https://firebase.google.com)    
[pexels](https://www.pexels.com/)  
    
   
# Error  
If you will have the ["1:1  error  Parsing error: 'import' and 'export' may appear only with 'sourceType: module'"](https://github.com/AtomLinter/linter-eslint/issues/462) error, encode the following code inside the `.esline.js` to resolve it .    
````  
"parserOptions": {  
        "sourceType": "module",  
    }  
````    
     
<a href="https://ibb.co/i6yV1S"><img src="https://preview.ibb.co/ft4Ran/Screen_Shot_2018_02_17_at_00_38_40.png" alt="Screen_Shot_2018_02_17_at_00_38_40" border="0"></a>  


  


      
          
