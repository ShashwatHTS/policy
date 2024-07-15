var express = require('express');
var router = express.Router();
const multer = require('multer');
const { supabaseInstance } = require("../supabase-db/index")


const upload = multer({ storage: multer.memoryStorage() });


// const { createPolicy, createTranction, updateTranction, bookingRPC } = require("../controller/user.controller")

// /* GET users listing. */
// router.get('/', function (req, res, next) {
//   res.send('respond with a resource');
// });

// router.post("/table", createPolicy);
// router.post("/trancsaction", createTranction);
// router.put("/trancsaction/:id", updateTranction);
// router.post("/booking", bookingRPC)
// router.get("/realTimeTransaction/:id", realTimeTransaction);

router.get("/", async (req, res) => {
  res.send("hello")
})

router.post("/upload", upload.single('image'), async (req, res) => {
  try {
    const file = req.file
    console.log("file", file)
    if (!file) {
      return res.status(400).send('No file uploaded.');
    }

    const { originalname, buffer } = file;
    const filePath = `${Date.now()}-${originalname}`;

    const { data, error } = await supabaseInstance.storage
      .from("image")
      .upload(filePath, buffer);

    console.log("data", data)

    if (error) {
      throw error;
    }

    const { publicURL } = supabaseInstance.storage
      .from('image')
      .getPublicUrl(filePath);

    console.log("publicURL", publicURL)

    const { data: insertData, error: insertError } = await supabase
      .from('images')
      .insert([
        {
          url: publicURL,
          preview_url: publicURL, // You might generate a separate preview URL
        },
      ]);

    if (insertError) {
      throw insertError;
    }

    res.status(200).json({
      data: insertData,
      // id: data.Key,
      // url: publicURL,
      // preview_url: publicURL, // Change this if you have a separate preview URL
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Internal Server Error');
  }
})

module.exports = router;
