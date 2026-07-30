const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, "uploads/crops");

    },

    filename: (req, file, cb) => {

        const uniqueName =
            Date.now() +
            path.extname(file.originalname);

        cb(null, uniqueName);

    }

});

const fileFilter = (req, file, cb) => {

    const allowed = /jpg|jpeg|png|webp/;

    const isValid =
        allowed.test(path.extname(file.originalname).toLowerCase());

    if (isValid) {

        cb(null, true);

    }

    else {

        cb(new Error("Only JPG, JPEG, PNG and WEBP images are allowed."));

    }

};

const upload = multer({

    storage,

    fileFilter,

    limits: {

        fileSize: 2 * 1024 * 1024

    }

});

module.exports = upload;