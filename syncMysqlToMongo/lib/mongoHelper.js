var mongoose = require('mongoose');
var config = require('../config');

var host = config.mongoConfig.host || '127.0.0.1',
    database = config.mongoConfig.database || '';

var db = mongoose.createConnection('mongodb://' + host + '/' + database);

var ResourcesSchema = new mongoose.Schema({
  "files" : {
    "origin" : String,
    "thumbnail_120_90" : String,
    "thumbnail_106_80" : String,
    "thumbnail_180_255" : String,
    "thumbnail_164_123" : String,
    "thumbnail_128_96" : String,
    "thumbnail_120_160" : String,
    "thumbnail_64_64" : String,
    "thumbnail_100_140" : String,
    "preview" : String,
    "previewForMobile" : String
  },
  "statistics" : {
    "viewCount" : Number,
    "scoreCount" : Number,
    "up" : Number,
    "commentCount" : Number,
    "score" : Number,
    "recommendCount" : Number,
    "favtimes" : Number,
    "downloadCount" : Number,
    "down" : Number
  },
  "general" : {
    "pinyinTitle" : String,
    "description" : String,
    "language" : String,
    "creator" : String,
    "title" : String,
    "filename" : String,
    "extension" : String,
    "length" : Number,
    "productId" : String,
    "source" : String,
    "uploader" : String,
    "md5" : String,
    "quality" : Number,
    "id" : String
  },
  "content" : {
    "text" : {
      "1" : String,
      "2" : String
    }
  },
  "date" : {
    "uploadTime" : Date,
    "createTime" : Date,
    "modifyTime" : Date
  },
  "keywords" : String,
  "lifecycle" : {
    "auditStatus" : Number,
    "lifeStatus" : Number
  },
  "segment" : {
    "content" : String
  },
  "properties" : {
    "volume" : Array,
    "publisher" : Array,
    "lang" : Array,
    "course" : Array,
    "grade" : Array,
    "topic" : Array,
    "edition" : Array,
    "book" : Array,
    "stage" : Array,
    "source" : Array,
    "phase" : Array,
    "unit2" : Array,
    "unit1" : Array,
    "type" : Array,
    "unit" : Array,
    "subject" : Array,
    "province": Array,
    "city": Array,
    "district": Array,
    "school": Array
  }
});

exports.ResourcesModel = db.model('resources', ResourcesSchema, 'resources');