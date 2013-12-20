#!/usr/bin/node
/**
 * This file tries to read/create the file
 * using the cat command,
 *
 * - If the file doesn't exist, it will be automatically created
 *   and the input is streamed to the file
 * 
 * - If a list of files are passed, files which are are streamed
 *   and rest are ignored
 * 
 * - If none of the files exists, first file in the list will be crated 
 * 
 * @harry_sistalam
 *
 */

var fs      = require('fs'),
    _       = require('underscore'),
    async   = require('async')
    optimist= require('optimist'),
    spawn   = require('child_process').spawn,
    nodeFn  = require('when/node/function'),
    logger  = require('./logger'),
    liner   = require('./liner');

// Show the usage
optimist.usage('Usage: FILE [options]')
        .describe('n', 'Number the lines in the output')
        .describe('s', 'Sequeeze the empty lines')
        .describe('b', 'Number only non-empty lines')
        .describe('h', 'Help on how to use `cat`').alias('h', 'help')
        .describe('debug', 'Print useful info when running');

var argv = optimist.argv;
var files = argv._;

if(argv.h || argv.help){
    console.log(optimist.help());
    process.exit(0);
}
logger.debugLevel = 'info';
if(argv.debug){
    logger.debugLevel = 'warn';
}

var extra_transformer;
if(argv.n){
    extra_transformer = liner;
}

//Shouldn't be doing this!
Array.prototype.remove = function(ele){
    var index = this.indexOf(ele);
    this.splice(index,1);
    return this;
}

var keys = Object.keys(argv);
// Delete the implicat keys of optimist
keys.remove('_')
keys.remove('$0');

keys = _.map(keys, function(item){ return '-' + item});

logger.log('warn', keys);
logger.log('warn', files);

var streamfile = function(file,cb){
    var f_stream = fs.createReadStream(file);
    if(extra_transformer){
        f_stream.pipe(extra_transformer).pipe(process.stdout);
    } else {
        f_stream.pipe(process.stdout);
    }
    f_stream.on('close', function(){
        cb(false);
    });
}

var checkforAllFiles = nodeFn.lift(function (cb){
    // If all the files exists stream then
    async.every(files, fs.exists, function(result){
       if(result){
           logger.log('warn', 'Every file exists');
           async.eachSeries(files, streamfile, function(err){
            cb(err);
        });
       } else {
           cb(true);  
       }
    });
});

var checkforAnyFile = nodeFn.lift(function(cb){
   logger.log('warn', 'Checking for any file!');
   async.filter(files, fs.exists, function(results){
        if(results.length){
            async.eachSeries(results, streamfile, function(err){
                cb(err);
            });
        }else{
            cb(true);
        }
   });
});

var checkforNonexistFiles = nodeFn.lift(function(cb){
   logger.log('warn', 'None of the files exist');
   async.rejectSeries(files, fs.exists, function(extFiles){
        var file = extFiles[0];
        logger.log('warn', 'Creating the file!' + file);
        createFile(file, function(value){
            cb(value);
        });
   });
});

function createFile(file, cb){
    var f_stream = fs.createWriteStream(file);
    process.stdin.pipe(f_stream);
    process.on('end', function(){
        cb(false);
    });
}

checkforAllFiles().then(sucess, function(){
    checkforAnyFile().then(sucess, function(){
        checkforNonexistFiles().then(sucess);
    });
});

function sucess(){
   
}
