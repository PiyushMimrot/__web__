import multer from 'multer';
import path from 'path';
import MediaM from '../../Model/Media/Media.Model.js';


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'mediaUploads/');
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    cb(null, Date.now() + extension);
  },
});

const upload = multer({ storage: storage });

const uploadMedia = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: 'Error uploading file.' });
    }

    const newMedia = new MediaM({
      type: req.file.mimetype.startsWith('image/') ? 'image' : 'video',
      filename: req.file.originalname,
      path: req.file.path,
    });

    newMedia
      .save()
      .then((savedMedia) => {
        req.savedMedia = savedMedia;
        next();
      })
      .catch((error) => {
        return res.status(500).json({ error: 'Error saving media to the database.' });
      });
  });
};


const getMedia = async (req, res, next) => {
  try {
    const media = await MediaM.find(); 

    if (!media || media.length === 0) {
      return res.status(404).json({ message: 'No media files found.' });
    }

    res.status(200).json(media);
  } catch (error) {
    console.error('Error fetching media:', error);
    return res.status(500).json({ error: 'Error fetching media files.' });
  }
};


export {uploadMedia,getMedia};
