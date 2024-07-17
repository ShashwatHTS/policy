const express = require('express');
const router = express.Router();
const { supabaseInstance } = require("../supabase-db/index")
const multer = require('multer');
const ProgressBars = require('./progressBar');
const upload = multer();
const supabaseStorageBucketName = "image";

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

const uploadImg = async (req, res) => {
  try {
    const file = req.file.buffer
    console.log("file", file)
    let fileName = req.file.originalname;
    let date_time = new Date();
    let date = ("0" + date_time.getDate()).slice(-2);
    let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
    let year = date_time.getFullYear();
    let hours = date_time.getHours();
    let minutes = date_time.getMinutes();
    let seconds = date_time.getSeconds();
    console.log(year + "-" + month + "-" + date);
    console.log(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
    fileName = `Date-${year}-${month}-${date}-Time-${hours}-${minutes}-${seconds}-${fileName}`

    console.log("fileName", fileName)

    const data = await uploadArrayBufferToSupabase(file, fileName)

    if (data?.path) {
      uploading()
      const publickUrlresponse = supabaseInstance.storage.from(supabaseStorageBucketName).getPublicUrl(data?.path);
      
      console.log("Response ----------> ", publickUrlresponse?.data?.publicUrl)

      if (publickUrlresponse?.data?.publicUrl) {
        const publicUrl = publickUrlresponse?.data?.publicUrl;
      
        const userData = await supabaseInstance.from('images').insert({ url: publicUrl, preview_url: publicUrl }).select("*").maybeSingle();
        
        res.status(200).json({
          success: true,
          data: userData.data,
        });
      } else {
        throw publickUrlresponse.error || "Getting Error in PublicUrl"
      }
    } else {
      throw error
    }
  } catch (error) {
    console.error('Error uploading file:', error.message);
    res.status(500).json({ error: 'Failed to upload file' });
  }
}

router.post('/upload', upload.single('file'), uploadImg);

module.exports = router;
