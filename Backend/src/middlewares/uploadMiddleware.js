import multer from "multer";

/*
|--------------------------------------------------------------------------
| Multer Memory Storage
|--------------------------------------------------------------------------
|
| Files are stored temporarily in memory so they can be processed
| by pdfjs-dist without saving to disk.
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
        cb(new Error("Only PDF and DOCX files are allowed"), false);
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
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});