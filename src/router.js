import { version } from '../package.json'
import File from './models/file'
import _ from 'lodash'
import { ObjectID } from 'mongodb'
import path from 'path'
class AppRouter {
    constructor(app) {
        this.app = app
        this.setupRouter()
    }
    setupRouter() {
        console.log('router is setup')
        const app = this.app
        const db = app.get('db')

        app.get('/', (req, res, next) => {
            res.status(200).json({
                version:version,
                message:'Welcome to fileShare API'
            })
        })
    const uploadDir = app.get('storageDir')
        const upload = app.get('upload')
        app.post('/api/upload',upload.array("files"), (req, res, next) => {
            console.log('Received files uplaoded-->',req.files)
            const files = _.get(req, 'files', [])
            const fileModels = []
            _.each(files, (fileObject) => {
                const newFile = new File(app).initWithObject(fileObject).toJson()
                fileModels.push(newFile)
            } )

            if(fileModels.length) {
                db.collection('files').insertMany(fileModels, (err, result) => {
                    if(err) {
                        res.status(503).json({
                            error: {
                                message: 'Unable to upload your file'
                            }
                        })
                    }

                    return res.json({
                        files: fileModels
                    })
                })
            } else {
                res.status(503).json({
                    error: {
                        message: 'Fatal Error: Files are required'
                    }
                })
            }
        });

        app.get('/api/download/:id',  (req, res, next) => {
            const fileId = req.params.id
            db.collection('files').find({ _id: ObjectID(fileId)}).toArray((err, file) => {
                const fileName = _.get(file, '[0].name')
                
                if(err || !fileName) {
                    res.status(503).json({
                        error: {
                            message: 'Fatal Error retrieving file from database'
                        }
                    })
                } else {
                    const filePath = path.join(uploadDir, fileName)
                    return res.download(filePath, fileName, (err) => {
                        err ? res.status(404).json({
                            error: {
                                message: 'File Not Found'
                            }
                        }) : console.log('file download success')
                    })
                }
            })
        });
    }
}

export default AppRouter