'use strict'

class RedisProto {
    constructor() {
        this._lines = [];
        this._text = '';
    }
    
    push(text) {
        const lines = (this._text + text).split('\r\n');
        
        this._text = lines.pop();
        this._lines = this._lines.concat(lines);
    }
    
    //解析下一个结果，如果没有则返回null
    next() {
        const lines = this._lines;
        const first = lines[0];
        
        const popResult = (lineNumber, result) => {
            this._lines = this._lines.slice(lineNumber);
            return this.result = result;
        }
        
        const popEmpty = () => {
            return this.result = false;
        }
        
        if(lines.length < 1) return popEmpty();
        
        switch(first[0]) {
            case '+':
                return popResult(1, {data: first.slice(1)});
            
            case '-':
                return popResult(1, {error: first.slice(1)});

            case ':':
                return popResult(1, {data: Number(first.slice(1))});

            case '$': {
                const n = Number(first.slice(1));
                if (n === -1) {
                // 如果是 $-1 表示空结果
                return popResult(1, {data: null});
                } else {
                // 否则取后面一行作为结果
                const second = lines[1];
                if (typeof second !== 'undefined') {
                    return popResult(2, {data: second});
                } else {
                    return popEmpty();
                }
                }
            }
            
            case '*': {
                const n = Number(first.slice(1));
                if (n === 0) {
                return popResult(1, {data: []});
                } else {
                const array = [];
                let i = 1;
                for (; i < lines.length && array.length < n; i++) {
                    const a = lines[i];
                    const b = lines[i + 1];
                    if (a.slice(0, 3) === '$-1') {
                    array.push(null);
                    } else if (a[0] === ':') {
                    array.push(Number(a.slice(1)));
                    } else {
                    if (typeof b !== 'undefined') {
                        array.push(b);
                        i++;
                    } else {
                        return popEmpty();
                    }
                    }
                }
                if (array.length === n) {
                    return popResult(i, {data: array});
                } else {
                    return popEmpty();
                }
                }
            }

            default:
                return popEmpty();
            
        }
    }
}

module.exports = RedisProto;