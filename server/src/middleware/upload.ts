import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let subfolder = 'others';
    if (file.fieldname === 'collegeId') subfolder = 'documents';
    else if (file.fieldname === 'profileImage') subfolder = 'profiles';
    else if (file.fieldname === 'bannerImage') subfolder = 'events';
    else if (file.fieldname === 'certificateImage') subfolder = 'certificates';
    
    const dir = path.resolve(__dirname, `../../../uploads/${subfolder}`);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, JPEG, PNG and PDF are allowed.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

export const uploadCollegeId = upload.single('collegeId');
export const uploadProfileImage = upload.single('profileImage');
export const uploadEventBanner = upload.single('bannerImage');
export const uploadCertificate = upload.single('certificateImage');
