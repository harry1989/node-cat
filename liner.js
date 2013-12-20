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
