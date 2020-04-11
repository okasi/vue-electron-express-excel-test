(function() {
  // 'use strict';

  const express = require('express');

  const bodyParser = require('body-parser');
  const cors = require('cors');

  const app = express();

  // To handle HTTP POST
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // CORS
  app.use(cors());

  app.get('/', (req, res) => {
    res.send('Hello world! Okan is here!');
  });

  const multer = require('multer');
  const storage = multer.memoryStorage();
  const upload = multer({ storage: storage });
  const XLSX = require('xlsx');

  app.post('/getjsonfromexcel', upload.single('file'), async (req, res) => {
    // console.log(req.file);
    const workbook = XLSX.read(req.file.buffer);
    const target_sheet_name = workbook.SheetNames.includes('Blad1')
      ? 'Blad1'
      : workbook.SheetNames[0];
    // console.log(target_sheet_name);
    const worksheet = workbook.Sheets[target_sheet_name];
    const arrs = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      raw: true,
      blankrows: true,
    });
    const cleanedArr = arrs.filter((arr) => {
      return arr.length;
    });
    // console.log(cleanedArr);
    res.json(cleanedArr);

  });

  let server = app.listen(3000, function() {
    console.log('Express server listening on port ' + server.address().port);
  });

  module.exports = app;
})();
