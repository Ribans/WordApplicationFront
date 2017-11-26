const { Nuxt, Builder } = require('nuxt');
const bodyParser = require('body-parser');
const session = require('express-session');
const express = require('express')();
let config = require('../nuxt.config.js');
const nuxt = new Nuxt(config);
const http = require('http');

express.use(bodyParser.json());

// オプションとともに Nuxt.js をインスタンス化
const isProd = process.env.NODE_ENV === 'production';
// const nuxt = new Nuxt({ dev: !isProd });
// プロダクション環境ではビルドしない
if (!isProd) {
  const builder = new Builder(nuxt);
  builder.build();
};


//make session
express.use(session({
  secret: 'super-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge: 60*60*24*1000 }
}));

//signin
express.post('/api/signin', function(req, res){

  let postData = JSON.stringify({
    "username": req.body.username,
    "password": req.body.password 
  })

  let options = {
    host: 'localhost',
    port: 4567,
    path: '/sign_in',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': postData.length
    }
  };

  const promise = new Promise((resolve, reject) => {
    let req_ = http.request(options, (res) => {
      res.setEncoding('utf8');
      if (res.statusCode == 200) {
        res.on('data', (chunk) => {
          resolve(JSON.parse(chunk));
        });
      } else {
        resolve({statusCode: 403});
      }
    });
    req_.on('error', (e) => {
      console.log('problem with request: ' + e.message);
    });
    req_.write(postData);
    req_.end();
  });

  promise.then( (data) => {
    req.session.currentUser = data;
    return res.json(data);
  }).catch( () => {
    res.status(401).json({ error: 'Bad credentials' })
  })
  // res.status(401).json({ error: 'Bad credentials' })
  });

express.post('/api/signup', (req,res) => {

  let postData = JSON.stringify({
    "username": req.body.username,
    "password": req.body.password,
    "confirm_password": req.body.confirmPassword 
  });

  let options = {
    host: 'localhost',
    port: 4567,
    path: '/sign_up',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': postData.length
    }
  };

  const promise = new Promise((resolve, reject) => {
    let req_ = http.request(options, (res) => {
      res.setEncoding('utf8');
      if (res.statusCode == 200) {
        res.on('data', (chunk) => {
          resolve(JSON.parse(chunk));
        });
      } else {
        resolve({statusCode: 403});
      }
    });
    req_.on('error', (e) => {
      console.log('problem with request: ' + e.message);
    });
    req_.write(postData);
    req_.end();
  });

  promise.then( data => {
    req.session.currentUser = data;
    return res.json(data);
  }).catch( reason => {
    res.status(401).json({ error: 'Bad credentials' })
    console.log('Handle rejected promise ('+reason+') here.')
  });

})

//logout
express.get('/api/logout', function (req, res) {
  delete req.session.currentUser;
  res.json({ ok: true });
});

express.get('/api/clearExams', function( req, res ){
  delete req.session.learnedExams
  res.json({ ok: true })
});

//learnedExams
express.post('/api/learned', function(req, res) {
  console.log(req.body.exams);
  req.session.learnedExams = req.body.exams;
  return res.json(req.body.exams);
})

express.use(nuxt.render);
express.listen(3333);
console.log('server is listening on http://localhost:3333');
