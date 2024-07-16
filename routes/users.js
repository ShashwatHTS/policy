var express = require('express');
var router = express.Router();
const { supabaseInstance } = require("../supabase-db/index")
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const ProgressBars = require('./progressBar');
const upload = multer();
const supabaseStorageBucketName = "image";
// const loadingbar = require('./progressBar')

const bars = new ProgressBars({
  title: 'Uploading',
  display: ':text :bar :percent :completed/:total :time',
  complete: '=',
  incomplete: '-',
})

const total = 100;

let completed2 = 0;

function uploading() {
  if (completed2 <= total) {

    completed2 += 2
    bars.render([
      { completed: completed2, total, text: "file2" }
    ]);

    setTimeout(function () {
      uploading();
    }, 100)
  }
}

// const task = new loadingbar(100)

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


async function uploadArrayBufferToSupabase(arrayBuffer, destinationPath) {
  // console.log(arrayBuffer)
  const { data, error } = await supabaseInstance.storage.from(supabaseStorageBucketName).upload(destinationPath, arrayBuffer, {
    cacheControl: '3600',
    upsert: true,
    contentType: 'image'
  })
  if (error) {
    throw error
  }
  return data
}

const getPublicUrl = (bucketName, fileName) => {
  const { data, error } = supabaseInstance.storage.from(bucketName).getPublicUrl(fileName, 
  )
  if (error) {
    throw error
  }
  return data;
}


const uploadImg = async (req, res) => {
  try {
    // console.log("hello")
    // console.log("file => ", req.file.buffer)
    const file = req.file.buffer
    const fileName = req.file.originalname;
    console.log(fileName)

    await uploadArrayBufferToSupabase(file, fileName)
    // console.log("data => ", data)


    const publicUrl = await getPublicUrl(supabaseStorageBucketName, fileName)

    const previewPublicUrl = await getPublicUrl(supabaseStorageBucketName, fileName)


    const res = await supabaseInstance.from('images').insert({ url: publicUrl.publicUrl, preview_url: previewPublicUrl.publicUrl }).select()

    console.log("res => ", res.data[0])
    uploading()
    // task.start()

    res.send(res.data[0])


  } catch (error) {
    console.error('Error uploading file:', error.message);
    res.status(500).json({ error: 'Failed to upload file' });
  }
}


router.post('/upload', upload.single('file'), uploadImg);

module.exports = router;
