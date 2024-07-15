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

const uploadImg = async (req, res) => {
  try {
console.log("hello")
    console.log("file => ", req.file.buffer)
    // const filespath = './public/temmp'
    // console.log(req.files)
    //   const file = req.files.path;
      const { data, error } = await supabase.storage
        .from('image') // Replace with your actual bucket name
        .upload(`images/${file.originalname}`, file.buffer);

      if (error) {
        throw error;
      }

      // Construct URLs
      const imageUrl = `${supabaseUrl}/storage/v1/object/public/your_bucket_name/images/${file.originalname}`;
      const previewUrl = imageUrl; 
      const fileId = data.Key; 
      res.json({
        id: fileId,
        imageUrl: imageUrl,
        previewUrl: previewUrl
      });
    } catch (error) {
      console.error('Error uploading file:', error.message);
      res.status(500).json({ error: 'Failed to upload file' });
    }
  }

router.post('/upload',upload.single('file'), uploadImg );

module.exports = router;
