"use strict";
var fs = require('fs');

exports.configure = function (driver) {
  // See whats going on
  driver.on('status', function (info) {
    console.log(info.cyan);
  });
  driver.on('command', function (meth, path, data) {
    console.log(' > ' + meth.yellow, path.grey, data || '');
  });
  driver.on('http', function (meth, path, data) {
    console.log(' > ' + meth.magenta, path, (data || '').grey);
  });
};


exports.copyFile = function (source, target) {
    var d = new Date(),
        CurrentTime = d.getFullYear()+
                   ''+(d.getMonth()+1)+
                   ''+(d.getDate()+1)+
                   '_'+d.getHours()+
                   ':'+d.getMinutes()+
                   ':'+d.getSeconds();

    return new Promise(function(resolve, reject) {
        var rd = fs.createReadStream(source);
        rd.on('error', reject);
        var wr = fs.createWriteStream(target+'_'+CurrentTime+'.log');
        wr.on('error', reject);
        wr.on('finish', resolve);
        rd.pipe(wr);
    });
}
