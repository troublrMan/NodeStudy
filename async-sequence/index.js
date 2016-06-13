var sequence_callback = require('./lib/sequence-callback');
var random_story = require('./lib/random_story');
var word_count = require('./lib/word_count');

sequence_callback.callbackTest(function(result) {
    console.log(result);
});

random_story();

word_count();