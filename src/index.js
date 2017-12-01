
import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import connect_db from './database';
import AppRouter from './router'
import multer from 'multer'
import path from 'path'

const PORT = 3002;
const app = express();
app.server = http.createServer(app);

const storageDir = path.join(__dirname,'..','storage')
// file storage config
const storageConfig = multer.diskStorage({
   destination: (req, file, cb ) => {
       cb(null, storageDir)
   },
    filename: (req, file, cb) => {
       cb(null, Date.now()+ path.extname(file.originalname))
    }
});

const upload = multer({ storage: storageConfig})
// end of file storage config
app.use(morgan('dev'));

app.set('storageDir', storageDir)
app.set('upload', upload)
app.use(cors({
    exposedHeaders: "*"
}));

app.use(bodyParser.json({
    limit: '50mb'
}));
app.set('root', __dirname);

connect_db((err, db) => {
    if (err) {
        console.log(`Error connecting to mongod ${ err }`);
        throw err;
    } else {
        console.log(`Connected to Mongodb`)
    }
    app.set('db', db)
    new AppRouter(app)
    app.server.listen(process.env.PORT || PORT, () => {
        console.log(`App is running on port ${app.server.address().port}`);
    });
})


export default app;
