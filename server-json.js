
/* eslint-disable no-console */
const jsonServer = require('json-server')
const path = require('path');
const multer = require('multer');
const fs = require("fs");
const { request } = require('http');

const pathToSave = 'public/uploads';
const urlBase = '/uploads/';
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

const server = jsonServer.create()
const router = jsonServer.router('./tests/test-data/db.json')
const middlewares = jsonServer.defaults()
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
  // const date = request.query.date;
  // const book = Number(request.query.book);
  // const speaker = Number(request.query.speaker);
  // // console.log(Number.isNaN(book));
  // // console.log(Number.isNaN(speaker));
  // // console.log(date);
  // if (request.method === 'GET' && request.path === '/meetings' && 
  // (date!=undefined || !Number.isNaN(book) || !Number.isNaN(speaker))) {
  //   const meetings = router.db.get('meetings').filter((m) => {
  //     if(date!=undefined) {
  //       var ourdate = new Date(String(m.Date));
  //       ourdate.setDate(ourdate.getDate() + 1);
  //       var datemeet = new Date(request.query.date + "T19:00:00.000Z");
  //       // console.log(datemeet);
  //       // console.log(ourdate);
  //       return String(ourdate) == String(datemeet);
  //     }
  //     return true;
  //   });
    
  //   const meetings2 = meetings.filter((m) => { 
  //     const reports = router.db.get('reports').filter((r) => r.meetingId === m.id );

  //     if(!Number.isNaN(book) && !Number.isNaN(speaker)) {
  //       const reports2 = reports.filter((r) => {
  //         return r.bookId == book && r.speakerId == speaker;
  //       }).value();
  //       return (reports2.length>0);
  //     }
  //     else if(!Number.isNaN(book) || !Number.isNaN(speaker)) {
  //       const reports2 = reports.filter((r) => {
  //         return r.bookId == book || r.speakerId == speaker;
  //       }).value();
  //       return (reports2.length>0);
  //     }
  //     return true;
  //   }).value();

  //   // response.json(meetings);
  //   response.json(meetings2);
  // } else {
  //   next();
  // }


  const date = request.query.date;
  const book = Number(request.query.book)
  const speaker = Number(request.query.speaker)
  if (request.method === 'GET' && request.path === '/meetings' && !Number.isNaN(book) || !Number.isNaN(speaker) || date!=undefined) {
    const meetingstemp = []
    let reports = []
    if (!Number.isNaN(book) && !Number.isNaN(speaker)) {
      reports = router.db.get('reports').filter((r) => r.bookId === book && r.speakerId === speaker).value()
    } else {
      reports = router.db.get('reports').filter((r) => r.bookId === book || r.speakerId === speaker).value()
    }
    
    const meetings = router.db.get('meetings').filter((m) => {
          if(date!=undefined) {
            var ourdate = new Date(String(m.Date));
            ourdate.setDate(ourdate.getDate() + 1);
            var datemeet = new Date(request.query.date + "T19:00:00.000Z");
            // console.log(datemeet);
            // console.log(ourdate);
            return String(ourdate) == String(datemeet);
          }
          return true;
        });

    reports.filter(function(report) {
      const meetings2 = meetings.filter((m) => m.id === report.meetingId).map((meeting) => {
        meeting.reports = router.db.get('reports').filter((r) => r.meetingId === meeting.id).value()

        return meeting;
      }).value();
      meetingstemp.push(meetings2[0])
    });
    
    let identify = meetingstemp.map(o => o.id) 
    const meetingsfinal = meetingstemp.filter(({id}, index) => !identify.includes(id, index + 1));
    
    
    response.json(meetingsfinal);
  } else {
    next();
  }

});

server.use(router)

let port = 3000;
server.listen(port, () => {
  console.log(`JSON Server is running at port ${port}`);
})