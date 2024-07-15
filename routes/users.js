var express = require('express');
var router = express.Router();
const { supabaseInstance } = require("../supabase-db/index")
// const upload = require("./multer.middleware")
const fs = require('fs');
const path = require('path');
const multer = require('multer');
// var fileupload = require("express-fileupload");
const upload = multer();
const supabaseStorageBucketName = "image";

// router.use(fileupload());
router.get("/", async (req, res) => {
  res.send("hello")
})

router.post("/name", async (req, res) => {
  const { name } = req.body
  const { data, error } = await supabaseInstance.from('name').insert({ name }).select()
  if (error) {
    throw error
  }
  res.send(data)
});

const latestlistOfImage = (fpath) => {
  const listOfFiles = getImagesFromFolder(fpath)
    .then(imageFiles => {
      // console.log('List of image files:', imageFiles);
      return imageFiles;
    })
    .catch(error => {
      console.error('Error reading image files:', error);
    });
  return listOfFiles
}

function getImagesFromFolder(folderPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        reject(err);
        return;
      }
      const imageFiles = files.filter(file => {
        const extname = path.extname(file).toLowerCase();
        return ['.log'].includes(extname);
      });
      resolve(imageFiles);
    });
  });
}

async function uploadArrayBufferToSupabase(arrayBuffer, destinationPath) {
  // console.log(arrayBuffer)
  await supabaseInstance.storage.from(supabaseStorageBucketName).upload(destinationPath, arrayBuffer, {
    cacheControl: '3600',
    upsert: true,
    contentType: 'image'
  }).then(response => {
    console.log(`File uploaded successfully: ${response.data}`);
  })
    .catch(error => {
      console.error(`Error uploading file: ${error.message}`);
    });
  
}
const uploadImg = async (req, res) => {
  try {
    console.log("hello")
    console.log("file => ", req.file.buffer)
    const file = req.file.buffer
    const fileName = req.file.originalname+".jpg";
    console.log(fileName)

    const data = await uploadArrayBufferToSupabase(file, fileName)


    console.log("data => ", data)
  } catch (error) {
    console.error('Error uploading file:', error.message);
    res.status(500).json({ error: 'Failed to upload file' });
  }
}


router.post('/upload', upload.single('file'), uploadImg);

module.exports = router;
