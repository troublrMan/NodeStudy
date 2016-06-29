'use strict'

const PersonModel = require('../model/personModel');

/**
 * 新增 {name: 'chen', age: '22', birthday: new Date('2015-6-01'), gender: 'male', likes: ''}
 * 如果是Entity，使用save方法，如果是Model，使用create方法
 */
function addByEntity(option, callback) {
    const _name = option.name || null;
    const _age = option.age || null;
    const _birthday = option.birthday || null;
    const _gender = option.gender || null;
    const _likes = option.likes || null;
    
    const entity = new PersonModel({name: _name, age: _age, birthday: _birthday, gender: _gender, likes: _likes});
    entity.save((err, product, numAffected) => {
        callback && callback(err, numAffected);
    });
}
exports.addByEntity = addByEntity;

/**
 * 删除 collection 中的数据
 * 和新增一样，删除也有2种方式，但Entity和Model都使用remove方法
 */
function remove(entity, callback) {
    entity.remove((err) => {
        callback && callback(err);
    });
}
exports.remove = remove;