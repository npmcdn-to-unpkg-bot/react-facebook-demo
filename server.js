const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('port', (process.env.PORT || 3000));
app.use('/', express.static(path.join(__dirname, 'public')));
const COMMENTS_FILE = path.join(__dirname, 'comments.json');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

app.get('/api/comments', function (req, res) {
  fs.readFile(COMMENTS_FILE, function (err, data) {
    if(err) {
      console.error(err);
      process.exit(1);
    }
    res.json(JSON.parse(data));
  });
});

app.post('/api/comments', function (req, res) {
  console.log(req.body);
  fs.readFile(COMMENTS_FILE, function (err, data) {
    if(err) {
      console.error(err);
      process.exit(1);
    }
    let dataArr = JSON.parse(data);

    dataArr.push(req.body);
    fs.writeFile(COMMENTS_FILE, JSON.stringify(dataArr), function (err) {
      if(err) {
        console.error(err);
        process.exit(1);
      }
      console.log('Updated JSON file.');
    });
  });
});

app.listen(app.get('port'), function () {
  console.log(`Server listening to port: ${app.get('port')}`);
});