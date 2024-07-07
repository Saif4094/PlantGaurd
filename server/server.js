const express = require('express');
const fileUpload = require('express-fileupload');
const axios = require('axios');
const path = require('path');
const { spawn } = require('child_process');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const fs = require('fs');
const FormData = require('form-data');
app.use(cors());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, './')));

app.post('/analyze', async (req, res) => {
  console.log('Request received');

  try {
    if (!req.files || !req.files.file) {
      return res.status(400).send('No files were uploaded.');
    }

    let sampleFile = req.files.file;
    console.log('Sample File Object:', sampleFile);

    const uploadPath = path.join(__dirname, 'uploads', sampleFile.name);
    console.log("This is uploadPath:", uploadPath);

    // Ensure the directory exists
    if (!fs.existsSync(path.dirname(uploadPath))) {
      console.log("Upload directory does not exist. Creating directory...");
      fs.mkdirSync(path.dirname(uploadPath), { recursive: true });
    }

    sampleFile.mv(uploadPath, async function (err) {
      if (err) {
        console.error('Error moving file:', err);
        return res.status(500).send('Error moving file: ' + err.message);
      }

      console.log("File moved successfully");

      try {
        // Send the file to the Flask server
        const form = new FormData();
        form.append('file', fs.createReadStream(uploadPath));

        const response = await axios.post('http://127.0.0.1:8000/predict', form, {
          headers: form.getHeaders()
        });
        res.json(response.data);

      } catch (error) {
        console.error('Error calling Flask API:', error);
        res.status(500).send('Error calling Flask API: ' + error.message);
      }
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/result', async (req, res) => {
  const productId = req.query.id;
  const response = await axios.get(`./backend/getDataFromCSV/${productId}`); //error
  res.json(response.data);
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
