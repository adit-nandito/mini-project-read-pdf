const Router = require('express').Router();
const Multer = require('multer');
const PDFHelper = require('../controller/pdfHelper');

const storage = Multer.memoryStorage();

// File filter to check for file type (optional)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Invalid file type. Only PDF are allowed.'));
  }
};

const upload = Multer({ storage, fileFilter });

const uploadPDF = async (request, reply) => {
  try {
    const fileBuffer = request.file.buffer;
    const response = await PDFHelper.uploadPDF(fileBuffer);
    return reply.send(response);
  } catch (err) {
    console.log('err===', err);
    return reply.status(500).send(err);
  }
};

Router.post('/v1/upload', upload.single('file'), uploadPDF);

module.exports = Router;
