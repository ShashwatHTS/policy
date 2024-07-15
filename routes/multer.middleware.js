const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

// module.export const upload = multer({
//   storage,
// })

const upload = multer({ storage })

module.exports = upload