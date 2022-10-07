
/* eslint-disable no-console */
const jsonServer = require('json-server')
const jwt = require("jsonwebtoken")
const crypto = require('crypto')
const path = require('path');
const multer = require('multer');
const fs = require("fs");
const server = jsonServer.create();
const router = jsonServer.router('./tests/test-data/db.json');
const middlewares = jsonServer.defaults();
const secretKey = '09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611';
const hashingSecret = "f844b09ff50c";
const fetch = require('node-fetch');
const { request } = require('http');

const pathToSave = 'public/uploads';
const urlBase = '/uploads/';

const generateAccessToken = (userData) => {
  // expires after half and hour (1800 seconds = 30 minutes)
  return jwt.sign(userData, secretKey, { expiresIn: '1800s' });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(path.join(__dirname, pathToSave))) {
      fs.mkdirSync(path.join(__dirname, pathToSave));
    }
    cb(null, path.join(__dirname, pathToSave));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = path.win32.basename(file.originalname, ext);
    cb(null, `${name}-${Date.now()}${ext}`);
  }
});

const upload = multer({ storage });


const getErrors = (errorsToSend) => {
  let errors = [];
  if (errorsToSend && Array.isArray(errorsToSend)) {
    errors = [...errorsToSend];
  }

  return {
    errors
  };
};

const getError = (title, detail, status, pathToAttribute) => {
  let errors = [];
  errors.push({
    title,
    detail,
    status,
    source: pathToAttribute ? { pointer: pathToAttribute } : null
  });

  return getErrors(errors);
};

const getUnauthorizedError = () => getError('Login', 'You are not authorized, please log in', 401, null);
const getForbiddenError = () => getError('Forbidden', 'You don\'t have permissions to this resource', 403, null);

const getBaseRoute = (req) => {
  const path = req.path.split('/');
  return path.length > 1 ? path[1] : '/';
};

// const isAuthorized = (req) => {
//   const baseRoute = getBaseRoute(req);
//   if (req.path === '/recaptcha' || req.path === '/users' || req.path === '/token' || ((baseRoute === 'authors' || baseRoute === 'books' || baseRoute === 'reviews') && req.method === 'GET')) {
//     return 200;
//   }

//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (token == null) {
//     return 401;
//   }

//   try {
//     let user = jwt.verify(token, secretKey);
//     req.app.set('sessionUser', user);
//     return 200;
//   }
//   catch (e) {
//     return 403;
//   }
// };

function responseInterceptor(req, res, next) {
  var originalSend = res.send;

  res.send = function () {
    let body = arguments[0];

    if (req.method === 'DELETE') {
      let urlSegms = req.url.split('/');
      let idStr = urlSegms[urlSegms.length - 1];
      let id = parseInt(idStr);
      id = isNaN(id) ? idStr : id;

      let newBody = Object.assign({}, JSON.parse(body));
      newBody.id = id;
      arguments[0] = JSON.stringify(newBody);
    }

    originalSend.apply(res, arguments);
  };

  next();
}

server.use(responseInterceptor);
// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);

server.post("/FileUpload", upload.any(), function (req, res) {

  let filedata = req.files;

  if (!filedata) {
    res.status(500).json(getError('File upload', 'Error during file upload', 500, null));
  }
  else {
    res.status(201).json({ filename: filedata[0].filename });
  }
});

server.post('/saveURL', function (req, res) {
  const entityId = req.body.id;
  const entityName = req.body.entityName;
  const fileName = req.body.fileName;

  const db = router.db; //lowdb instance
  const book = db.get(entityName).find({ id: entityId }).assign({ coverURL: `${urlBase}${fileName}` }).write();
  res.status(200).json(book);
});

// Use default router
server.use((request, response, next) => {
  const date = request.query.date;
  const book = Number(request.query.book)
  const speaker = Number(request.query.speaker)
  if (request.method === 'GET' && request.path === '/meetings' && !Number.isNaN(book) || !Number.isNaN(speaker) || date!=undefined) {
    const meetingstemp = []
    let reports = []
    if (!Number.isNaN(book) && !Number.isNaN(speaker)) {
      reports = router.db.get('reports').filter((r) => r.bookId === book && r.speakerId === speaker).value()
    } else if(!Number.isNaN(book) || !Number.isNaN(speaker)) {
      reports = router.db.get('reports').filter((r) => r.bookId === book || r.speakerId === speaker).value()
    }
    else{
      reports = router.db.get('reports');
      console.log(reports)
    }
    
    const meetings = router.db.get('meetings').filter((m) => {
          if(date!=undefined) {
            var ourdate = new Date(String(m.Date));
            ourdate.setDate(ourdate.getDate() + 1);
            var datemeet = new Date(request.query.date + "T19:00:00.000Z");
            return String(ourdate) == String(datemeet);
          }
          return true;
        });
    const meetings2 = meetings.filter((m) => {
      const temp = reports.find((report) =>  m.id === report.meetingId);
      return temp !=undefined;
    }).value();    
    response.json(meetings2);
  } else {
    next();
  }

});

// server.use(jsonServer.bodyParser);

server.post('/token', function (req, res) {
  const emailFromBody = req.body.email;
  const passwordFromBody = req.body.password;
  const hashedPassword = crypto.createHmac('sha256', hashingSecret).update(passwordFromBody).digest('hex');

  const db = router.db; //lowdb instance
  const user = db.get('users').find({ email: emailFromBody, password: hashedPassword }).value();

  if (user) {
    const token = generateAccessToken({ email: user.email, username: user.username });
    res.json({ token });
  }
  else {
    res.status(401).json(getError('Login', 'Error logging in user with that e-mail and password', 401, null));
  }
});

// // Check authorization
// server.use((req, res, next) => {
//   const authorizeCode = isAuthorized(req);
//   if (authorizeCode === 200) {
//     next() // continue to JSON Server router
//   }
//   else if (authorizeCode === 401) {
//     res.status(401).json(getUnauthorizedError());
//   }
//   else if (authorizeCode === 403) {
//     res.status(403).json(getForbiddenError());
//   }
//   else {
//     res.status(403).json(getForbiddenError());
//   }
// });

// // Get current user
server.use((req, res, next) => {
  if (req.path === '/users/me' && req.method === 'GET') {
    let storedUser = req.app.get('sessionUser');
    if (!storedUser) {
      res.sendStatus(404);
    }
    else {
      const db = router.db; //lowdb instance
      const user = db.get('users').find({ username: storedUser.username }).value();
      const userCopy = Object.assign({}, user);

      delete userCopy.password;
      delete userCopy.passwordConfirmation;
      res.json(userCopy);
    }
  }
  else {
    next();
  }
});

// Disable get, modify or delete users
server.use((req, res, next) => {
  if (getBaseRoute(req) === 'users' && (req.method === 'PATCH' || req.method === 'DELETE')) {
    res.sendStatus(404);
  }
  else if (getBaseRoute(req) === 'users' && req.method === 'GET') {
    let urlSegms = req.url.split('/');
    let idStr = urlSegms[urlSegms.length - 1];
    let id = parseInt(idStr);
    id = isNaN(id) ? idStr : id;

    const db = router.db; //lowdb instance
    const user = db.get('users').find({ id: id }).value();
    const userCopy = Object.assign({}, user);

    delete userCopy.password;
    delete userCopy.passwordConfirmation;
    res.json(userCopy);
  }
  else {
    // Continue to JSON Server router
    next();
  }
});

// // Validate user to add
server.use((req, res, next) => {
  const db = router.db; //lowdb instance
  const user = db.get('users').find({ email: req.body.email }).value();

  const valid = !req.body || req.body && !user;
  if (getBaseRoute(req) === 'users' && req.method === 'POST' && !valid) {
    res.status(422).json(getError('email', 'email is already taken', 422, '/data/attributes/email'));
  }
  else if (getBaseRoute(req) === 'users' && req.method === 'POST') {
    const hashedPassword = crypto.createHmac('sha256', hashingSecret).update(req.body.password).digest('hex');
    req.body.password = hashedPassword;
    next();
  }
  else {
    // Continue to JSON Server router
    next();
  }
});


server.use(router)

let port = 3000;
server.listen(port, () => {
  console.log(`JSON Server is running at port ${port}`);
})