// server/middlewares/uploadMiddleware.js
const multer = require('multer');
const path = require('path');

// Настраиваем, куда и под каким именем сохранять файлы
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Папка для сохранения
  },
  filename: function (req, file, cb) {
    // Делаем уникальное имя: текущее время + оригинальное расширение
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Фильтр, чтобы пропускал только картинки
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Разрешены только изображения!'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;