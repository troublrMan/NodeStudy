
function testBuffer() {
    var str1 = new Buffer('test buffer');
    console.log('str1: ' + str1.toString('utf8'));
    
    var arr1 = new Uint16Array(2);
    arr1[0] = 'test';
    console.log('arr1: ' + arr1);
    
    var str2 = new Buffer(arr1.buffer);
    console.log('str2: ' + str2);
    console.log('Buffer(Uint16Array.buffer) is equals to Uint16Array : ' + (str2 === arr1));
    
    //buffer instanced by a array 
    var buf1 = new Buffer([1, 2, 3]);
    for(var item of buf1) {
        console.log('the item of buf1: ' + item);
    }
    for(var key of buf1.keys()) {
        console.log('buf1`s key: ' + key);
    }
    
    //allocates a new buffer using a string
    var buf2 = new Buffer('chen')
    //get a instance from buf2
    var buf3 = new Buffer(buf2);
    console.log('buf2 is equals to buf3 : ' + buf2.equals(buf3));
    
    var buf4 = new Buffer(30).fill('chen');
    console.log(buf4.toString('utf8'));
    
    console.log('test indexOf function: ' + str1.indexOf('st'));
    
}

module.exports = {
    testBuffer: testBuffer
}