import { MongoClient } from 'mongodb';
const url = 'mongodb://localhost:27017/fileShare';

// export const connect = (cb) => {
//     MongoClient.connect(url, (err, db) => {
//         return cb (err, db);
//     });
// };

export default  (cb) => {
    MongoClient.connect(url, (err, db) => {
        return cb(err, db)
    })
}