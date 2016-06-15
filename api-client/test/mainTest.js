'use strict'

const should = require('should');
const CNodeJS = require('../lib/CNodeJS');
const client = new CNodeJS();

describe('test/mainTest.js', () => {
    /**
     * 测试Cnode API请求topics的promise返回方式
     */
    it('Get topics by promise', (done) => {
        client.request('GET', 'topics', {page: 1})
            .then(ret => {
               ret.should.be.ok; 
               done();
            })
            .catch(err => {
                //No assertions can be done on null and undefined.
                //undefined.should.not.be.ok 会报错
                (err === null).should.be.true;
                done();
            });
    });
    
    /**
     * 测试Cnode API请求topics的callback返回方式
     */
    it('Get topics by callback', done => {
        client.request('GET', 'topics', {page: 1}, (err, result) => {
           (err === null).should.be.true && result.should.be.ok;
           done();
        });
    });
    
    /**
     * 测试Cnode API请求topic/:id的callback返回方式
     */
    it('Get topic/:id by callback', done => {
        client.request('GET', 'topic/5433d5e4e737cbe96dcef312', {page: 1}, (err, result) => {
           (err === null).should.be.true && result.should.be.ok;
           done();
        });
    });
});