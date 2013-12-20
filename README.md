node-cat
========

Node based utility which mocks unix `cat` command

  - If the file doesn't exist, it will be automatically created
    and the input is streamed to the file
 
  - If a list of files are passed, files which are are streamed
    and rest are ignored
 
  - If none of the files exists, first file in the list will be crated

Examples:

   - showing Single file 

        harry@local:/u/harry/cat> ./cat.js liner.js
        var stream = require('stream'),
            liner = new stream.Transform({objectMode: false});

        var line_num = 1;
        liner._transform = function(chunk, encoding, done){
            var data = chunk.toString();
            if (this._lastLineData) data = this._lastLineData + data
            var lines = data.split('\n')
            this._lastLineData = lines.splice(lines.length-1,1)[0]
            lines = lines.map(function(line){return (line_num++) + ': ' + line});
            this.push(lines.join('\n') + '\n');
            done()
        }

        liner._flush = function (done) {
             if (this._lastLineData) this.push(this._lastLineData)
             this._lastLineData = null
             done()
        }

        module.exports = liner;
        harry@local:/u/harry/cat>

   - Showing single file with the line number

        harry@local:/u/harry/cat> ./cat.js liner.js -n
        1: var stream = require('stream'),
        2:     liner = new stream.Transform({objectMode: false});
        3:
        4: var line_num = 1;
        5: liner._transform = function(chunk, encoding, done){
        6:     var data = chunk.toString();
        7:     if (this._lastLineData) data = this._lastLineData + data
        8:     var lines = data.split('\n')
        9:     this._lastLineData = lines.splice(lines.length-1,1)[0]
        10:     lines = lines.map(function(line){return (line_num++) + ': ' + line});
        11:     this.push(lines.join('\n') + '\n');
        12:     done()
        13: }
        14:
        15: liner._flush = function (done) {
        16:      if (this._lastLineData) this.push(this._lastLineData)
        17:      this._lastLineData = null
        18:      done()
        19: }
        20:
        21: module.exports = liner;

   - Showing multiple files

        harry@local:/u/harry/cat> ./cat.js liner.js -n
        README.md     cat.js*       liner.js      logger.js     node_modules/ package.json
        harry@local:/u/harry/cat> ./cat.js liner.js -n logger.js
        1: var stream = require('stream'),
        2:     liner = new stream.Transform({objectMode: false});
        3:
        4: var line_num = 1;
        5: liner._transform = function(chunk, encoding, done){
        6:     var data = chunk.toString();
        7:     if (this._lastLineData) data = this._lastLineData + data
        8:     var lines = data.split('\n')
        9:     this._lastLineData = lines.splice(lines.length-1,1)[0]
        10:     lines = lines.map(function(line){return (line_num++) + ': ' + line});
        11:     this.push(lines.join('\n') + '\n');
        12:     done()
        13: }
        14:
        15: liner._flush = function (done) {
        16:      if (this._lastLineData) this.push(this._lastLineData)
        17:      this._lastLineData = null
        18:      done()
        19: }
        20:
        21: module.exports = liner;
        harry@local:/u/harry/cat> ./cat.js liner.js logger.js
        var stream = require('stream'),
            liner = new stream.Transform({objectMode: false});

        var line_num = 1;
        liner._transform = function(chunk, encoding, done){
            var data = chunk.toString();
            if (this._lastLineData) data = this._lastLineData + data
            var lines = data.split('\n')
            this._lastLineData = lines.splice(lines.length-1,1)[0]
            lines = lines.map(function(line){return (line_num++) + ': ' + line});
            this.push(lines.join('\n') + '\n');
            done()
        }

        liner._flush = function (done) {
             if (this._lastLineData) this.push(this._lastLineData)
             this._lastLineData = null
             done()
        }

        module.exports = liner;
        var logger = exports;
          logger.debugLevel = 'warn';
          logger.log = function(level, message) {
            var levels = ['error', 'warn', 'info'];
            if (levels.indexOf(level) >= levels.indexOf(logger.debugLevel) ) {
              if (typeof message !== 'string') {
                message = JSON.stringify(message);
              };
              console.log(level+': '+message);
            }
         }

   - Createing a new file

        harry@local:/u/harry/cat> ./cat.js newfile.js
        This is a new file crated by ./cat.js
        harry@local:/u/harry/cat> ls newfile.js
        newfile.js
        harry@local:/u/harry/cat> /bin/cat newfile.js
        This is a new file crated by ./cat.js
        harry@local:/u/harry/cat>

 
  @harry_sistalam

