const mongoose = require('mongoose');
const db = require('../lib/mongoHelper').getConnection();

/**
 * 定义 Schema
 */
const PersonSchema = new mongoose.Schema({
    name: String,
    age: Number,
    birthday: Date,
    gender: String,
    likes: [String]
});

//Schema 扩展方法(需要entity调用)
PersonSchema.methods.findSimilarTypes = function(cb) {
    return this.model('Person').find({type: this.type}, cb);
};

// Schema 扩展静态方法
PersonSchema.statics.findByname = function(name, cb) {
    this.find({name: new RegExp(name, 'i')}, cb);
};

/**
 * 使用 schema 新建 model
 * Connection#model(name, [schema], [collection])
 * name model名；schema；collection 数据库collection名；
 */
const PersonModel = db.model('Person', PersonSchema, 'person');
module.exports = PersonModel;