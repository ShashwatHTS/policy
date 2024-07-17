const express = require('express');
const router = express.Router();
const { supabaseInstance } = require("../supabase-db/index");
const multer = require('multer');
const ProgressBar = require('progress');
const upload = multer();
const supabaseStorageBucketName = "image";

// Initialize progress bar
const progressBar = new ProgressBar('Uploading [:bar] :percent :etas', {
  complete: '=',
  incomplete: ' ',
  width: 30,
  total: 100
});

// Function to upload file with progress tracking
async function uploadArrayBufferToSupabase(arrayBuffer, destinationPath) {
  const totalSize = arrayBuffer.byteLength;
  let uploadedSize = 0;
  const chunkSize = 512 * 1024;

  for (let i = 0; i < totalSize; i += chunkSize) {
    const chunk = arrayBuffer.slice(i, i + chunkSize);
    const { data, error } = await supabaseInstance.storage.from(supabaseStorageBucketName).upload(
      `${destinationPath}-${i}`,
      chunk,
      {
        cacheControl: '3600',
        upsert: true,
        contentType: 'image'
      }
    );
    if (error) {
      throw error;
    }
    uploadedSize += chunk.byteLength;
    const progress = uploadedSize / totalSize;
    progressBar.update(progress);
  }
  return { path: destinationPath };
}

const uploadImg = async (req, res) => {
  try {
    const file = req.file.buffer;
    let fileName = req.file.originalname;
    let date_time = new Date();
    let date = ("0" + date_time.getDate()).slice(-2);
    let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
    let year = date_time.getFullYear();
    let hours = date_time.getHours();
    let minutes = date_time.getMinutes();
    let seconds = date_time.getSeconds();
    fileName = `Date-${year}-${month}-${date}-Time-${hours}-${minutes}-${seconds}-${fileName}`;

    const data = await uploadArrayBufferToSupabase(file, fileName);
    console.log("data", data);

    if (data?.path) {
      const publicUrlResponse = supabaseInstance.storage.from(supabaseStorageBucketName).getPublicUrl(data?.path);
      if (publicUrlResponse?.data?.publicUrl) {
        const publicUrl = publicUrlResponse?.data?.publicUrl;
        const userData = await supabaseInstance.from('images').insert({ url: publicUrl, preview_url: publicUrl }).select("*").maybeSingle();

        console.log("userData", userData);

        res.status(200).json({
          success: true,
          data: userData.data,
        });
      } else {
        throw publicUrlResponse.error || "Error getting public URL";
      }
    } else {
      throw new Error("Upload failed");
    }
  } catch (error) {
    console.error('Error uploading file:', error.message);
    res.status(500).json({ error: 'Failed to upload file' });
  }
}

router.post('/upload', upload.single('file'), uploadImg);

module.exports = router;
