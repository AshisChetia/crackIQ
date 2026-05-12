import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

/*
|--------------------------------------------------------------------------
| Multer Memory Storage
|--------------------------------------------------------------------------
|
| Files are stored temporarily in memory
| before uploading to Cloudinary.
|
*/

const storage = multer.memoryStorage();

/*
|--------------------------------------------------------------------------
| File Filter
|--------------------------------------------------------------------------
|
| Only allow PDF and DOCX files
|
*/

const fileFilter = (req, file, cb) => {

    const allowedTypes = [

        "application/pdf",

        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (allowedTypes.includes(file.mimetype)) {

        cb(null, true);

    } else {

        cb(
            new Error(
                "Only PDF and DOCX files are allowed"
            ),
            false
        );
    }
};

/*
|--------------------------------------------------------------------------
| Multer Upload Middleware
|--------------------------------------------------------------------------
*/

export const upload = multer({

    storage,

    fileFilter,

    limits: {

        fileSize: 5 * 1024 * 1024,
    },
});

/*
|--------------------------------------------------------------------------
| Upload File To Cloudinary
|--------------------------------------------------------------------------
|
| Uploads resume files directly to:
| crackIQ folder in Cloudinary
|
*/

export const uploadToCloudinary = (fileBuffer, originalName) => {

    return new Promise((resolve, reject) => {

        const uploadStream =
            cloudinary.uploader.upload_stream(

                {

                    folder: "crackIQ",

                    resource_type: "raw",

                    public_id:
                        Date.now() +
                        "-" +
                        originalName
                            .split(".")[0],
                },

                (error, result) => {

                    if (error) {

                        reject(error);

                    } else {

                        resolve(result);
                    }
                }
            );

        /*
        |--------------------------------------------------------------------------
        | Convert Buffer To Stream
        |--------------------------------------------------------------------------
        */

        streamifier
            .createReadStream(fileBuffer)
            .pipe(uploadStream);
    });
};