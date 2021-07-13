// external imports
const multer = require("multer");
const path = require("path");
const createError = require("http-errors");
// const fsExtra = require('fs-extra');

function uploader(
  allowed_file_types,
  max_file_size,
  error_msg
) {
  // File upload folder
  // const UPLOADS_FOLDER = `${__dirname}/../public/images/`;

  // ensure the upload folder
  // fsExtra.ensureDirSync(UPLOADS_FOLDER);

  // define the storage
  const storage = multer.diskStorage({
    // destination: (req, file, cb) => {
    //   cb(null, UPLOADS_FOLDER);
    // },
    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const fileName =
        file.originalname
          .replace(fileExt, "")
          .toLowerCase()
          .split(" ")
          .join("-") + "-" + Date.now();

      cb(null, fileName + fileExt);
    },
  });

  // preapre the final multer upload object
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: max_file_size,
    },
    fileFilter: (req, file, cb) => {
      if (allowed_file_types.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(createError(error_msg), false);
      }
    },
  });

  return upload;
}

module.exports = uploader;
