const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const jsonServer = require('json-server');
const jwt = require('jsonwebtoken')

const server = jsonServer.create();
const router = jsonServer.router('./database.json');
const userDB = JSON.parse(fs.readFileSync('./users.json', 'UTF-8'));

server.use(cors({
  origin: '*'
}));

server.use(bodyParser.urlencoded({
  extended: true
}));
server.use(bodyParser.json());

const SECRET_KEY = '1230ABC--';
const expiresIn = '1h';

const createToken = payload => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn })
}

const isAuthenticated = ({ email, password }) => {
  return userDB.users.findIndex(user => user.email === email && user.password === password) !== -1;
}

const findUserByEmail = email => {
  return userDB.users.find(user => user.email === email);
}

const readTokenInHeader = req => {
  if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
    return false;
  }
  return req.headers.authorization.split(' ')[1];
}

const verifyToken = token => {
  return jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ? decode : err)
}

server.post('/v1/auth/register', (req, res) => {
  console.log('register endpoint calledl request body');
  console.log(req.body);
  const { email, password } = req.body;

  if (isAuthenticated({ email, password }) === true) {
    const status = 401;
    const message = 'User already exists';
    res.status(status).json({ status, message });

    return
  }

  fs.readFile('./users.json', (err, dataUsers) => {
    if (err) {
      const status = 401;
      const message = err;
      res.status(status).json({ status, message });

      return
    }

    const data = JSON.parse(dataUsers.toString());
    const lastItemId = data.users[data.users.length - 1].id;

    data.users.push({ id: lastItemId + 1, email, password });
    fs.writeFile('./users.json', JSON.stringify(data), (err, result) => {
      if (err) {
        const status = 401;
        const message = err;
        res.status(status).json({ status, message });

        return
      }
    });
  });

  const accessToken = createToken({ email, password });
  console.log('Access Token ', accessToken);
  res.status(200).json({ accessToken })

})

server.post('/v1/auth/login', (req, res) => {
  console.log('Login endpoint called; request body');
  console.log(req.body);

  const { email, password } = req.body;
  const user = findUserByEmail(email);

  if (!user && user.password !== password) {
    const status = 401;
    const message = 'Credentials not valid';
    res.status(status).json({ status, message });

    return
  }
  const accessToken = createToken({ email });

  res.status(200).json({ accessToken });
});

server.get('/v1/users', (req, res) => {
  console.log('Login endpoint called; request body');
  const token = readTokenInHeader(req);

  const payloadToken = jwt.decode(token);

  if (!token || !payloadToken) {
    const status = 401;
    const message = 'Token required';
    res.status(status).json({ status, message });

    return
  }

  const detailUser = findUserByEmail(payloadToken.email);
  res.status(200).json({...detailUser, password: 'xxxxx'});
});


server.use(/^(?!\/v1).*$/,  (req, res, next) => {
  if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
    const status = 401;
    const message = 'Error in authorizaion format';
    res.status(status).json({ status, message });

    return
  }

  try {
    const verifyTokenResult = verifyToken(req.headers.authorization.split(' ')[1]);

    if (verifyTokenResult instanceof Error) {
      const status = 401;
      const message = 'Access Token is requerid';
      res.status(status).json({ status, message });

      return
    }
    next();

  } catch (error) {

    const status = 401;
    const message = 'Access Token is revoked';
    res.status(status).json({ status, message });
  }
});


server.use(router);
server.listen(8000, () => {
  console.log('Run Auth API Server internal to Frontend in localhost:8000');
})