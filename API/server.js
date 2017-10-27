const { Nuxt, Builder } = require('nuxt');
const bodyParser = require('body-parser');
const session = require('express-session');
const express = require('express')();
let config = require('../nuxt.config.js');
const nuxt = new Nuxt(config);

express.use(bodyParser.json());

// オプションとともに Nuxt.js をインスタンス化
const isProd = process.env.NODE_ENV === 'production';
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

//login
express.post('/api/login', function(req, res){
  // if (req.body.username === 'demo' && req.body.password === 'demo') {}
  req.session.crrentUser = { username: req.body.username };
  return res.json({ username: req.body.username });
  res.status(401).json({ error: 'Bad credentials' })
  console.log(req.body)
});

//logout
express.post('/api/logout', function (req, res) {
  delete req.session.authUser;
  res.json({ ok: true });
});

express.use(nuxt.render);
express.listen(3333);
console.log('server is listening on http://localhost:3333');
