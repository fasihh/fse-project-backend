import multer from 'multer';
import path from 'path';
import RequestError from '../errors/request-error';
import { ExceptionType } from '../errors/exceptions';
import { v4 as uuidv4 } from 'uuid';

const allowedFormats = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + '-' + file.originalname);
  },
});

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedFormats.includes(ext)) {
    cb(null, true);
  } else {
    throw new RequestError(ExceptionType.BAD_REQUEST, "Invalid file type");
    // cb(new RequestError(ExceptionType.BAD_REQUEST, "Invalid file type"));
  }
};

export const upload = multer({
  storage,
  limits: { files: 5 },
  fileFilter,
});

export default upload;