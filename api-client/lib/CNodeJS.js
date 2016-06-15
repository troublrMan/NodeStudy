'use strict'

const rawRequest = require('request');

class CNodeJS {
    constructor(options) {
        this.options = options = options || {};
        options.token = options.token || null;
        options.url = options.url || 'https://cnodejs.org/api/v1/';
    }
    
    //参数处理
    baseParams(params) {
        params = Object.assign({}, params || {});
        if(this.options.token) {
            params.accesstoken = this.options.token;
        }
        return params;
    }
    
    request(method, path, params, callbacak) {
        return new Promise((_resolve, _reject) => {
           //重新封装 resolve，既支持promise又支持callback
           const resolve = ret => {
               _resolve(ret);
               callbacak && callbacak(null, ret);
           }
           
           const reject = err => {
               _reject(err);
               callbacak && callbacak(err);
           }
            
           const opts = {
               method: method.toUpperCase(),
               url: this.options.url + path,
               json: true    
           };
           
           if(opts.method === 'GET' || opts.method === 'HEAD') {
               opts.qs = this.baseParams(params);
           } else {
               opts.body = this.baseParams(params);
           }
           
           rawRequest(opts, (err, res, body) => {
              if(err) return reject(err);
              if(body.success) {
                  resolve(body);
              } else {
                  reject(new Error(body.error_msg));
              }
           });
           
        });
    }
}

module.exports = CNodeJS;