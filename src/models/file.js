import _ from 'lodash'

export default class File {
    constructor(app) {
        this.app = app
        this.model = {
            name: null,
            size: null,
            created: Date.now(),
            mimeType: null,
            originalName: null,

        }
    }
    initWithObject(object) {
        this.model.name = _.get(object, 'filename')
        this.model.originalName = _.get(object, 'originalname')
        this.model.size = _.get(object, 'size')
        this.model.mimeType = _.get(object, 'mimetype')
        this.created = Date.now()
        return this
    }
    toJson() {
        return this.model
    }
    save(callback) {
        const db = this.app.get('db')
        db.collection('files').insertOne(this.model, (err, result) => {
            callback(err, result)
        })
    }
}