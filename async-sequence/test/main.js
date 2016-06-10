var should = require('should');
var sequence_callback = require('../lib/sequence-callback');

describe('test/main.js', function() {
   // mocha 测试异步方法
   it('sequence_callback test', function(done) {
       sequence_callback.callbackTest(function(result) {
           result.toString().should.equal(['hello', 'world', 'chen'].toString());
           done();
       });
   });
});