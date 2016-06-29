'use strict'

const personModel = require('../model/personModel');
const personEntity = require('../entity/personEntity');

const should = require('should');

describe('test/mainTest.js', () => {
    //测试mongoose 通过entity添加数据
    it('mongoose add data by entity', (done) => {
        personEntity.addByEntity({name: 'carlen', age: '25', birthday: new Date('2015-6-01'), gender: 'male', likes: 'sleep'}, (err, numAffected) => {
            //numAffected 结果为1表示成功
            (err === null).should.be.true && (numAffected === 1).should.be.true;
            done();
        });
    });
    
    //测试mongoose 通过model添加数据
    it('mongoose add data by model', (done) => {
        personModel.create({name: 'carlen2', age: '25', birthday: new Date('2015-6-01'), gender: 'male', likes: 'sleep'}, (err, candies) => {
            (err === null).should.be.true && candies.should.be.ok;
            done();
        });
    });
    
    //测试mongoose 通过model的findone 查找存在的数据
    it('mongoose findeone existed by model', (done) => {
        personModel.findOne({name: 'carlen'}, (err, data) => {
            (err === null).should.be.true && data.should.be.ok;
            done();
        });
    });
    
    //测试mongoose 通过model的findone 查找一个不存在的数据
    it('mongoose findeone but not have that data by model', (done) => {
        personModel.findOne({name: 'noOne'}, (err, data) => {
            (err === null).should.be.true && (data === null).should.be.true;
            done();
        });
    });
    
    //测试mongoose 通过model的find 查找存在的数据
    it('mongoose find existed by model', (done) => {
        personModel.find({name: 'carlen'}, (err, data) => {
            (err === null).should.be.true && (data.length > 0).should.be.true;
            done();
        }); 
    });
    
    //测试mongoose 通过model的find 查找不存在的数据
    it('mongoose find but not have that data by model', (done) => {
        personModel.find({name: 'noOne'}, (err, data) => {
            (err === null).should.be.true && (data.length === 0).should.be.true;
            done();
        }); 
    });
    
    //测试mongoose 通过model的 find、where、exec查询数据
    it('mongoose find + where + exec existed by model', (done) => {
        personModel
            .find()
            .where('name', 'carlen')
            .where('age', '25')
            .exec((err, docs) => {
                (err === null).should.be.true && (docs.length > 0).should.be.true;
                done();
            });
    });
    
    //测试mongoose 通过model的remove删除数据
    it('mongoose remove by model', (done) => {
        personModel
            .remove()
            .where('name', /carlen2|carlen/)
            .exec((err, result) => {
                (err === null).should.be.true && result.result.ok.should.be.equal(1);
                done();
            });
    });
}); 