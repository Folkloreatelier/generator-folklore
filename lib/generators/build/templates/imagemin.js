var imagemin = require('imagemin');
var imageminMozjpeg = require('imagemin-mozjpeg');
var imageminPngquant = require('imagemin-pngquant');
var glob = require('glob');
var path = require('path');
var fs = require('fs');
var chalk = require('chalk');
var prettyBytes = require('pretty-bytes');

var buildConfig = require('./config');
var imageminConfig = buildConfig.imagemin;

function minifyImage(srcPath, output)
{
    var stats = fs.statSync(srcPath);
    var originalSize = stats.size;

    imagemin([srcPath], output, {
        plugins: [
            imageminMozjpeg(),
            imageminPngquant({
                quality: '65-80'
            })
        ]
    }).then(files => {
        var saved, percent, savedMsg, msg;
        for (var i = 0, fl = files.length; i < fl; i++) {
            optimizedSize = files[i].data.length;
            saved = originalSize - optimizedSize;
    		percent = originalSize > 0 ? (saved / originalSize) * 100 : 0;
    		savedMsg = 'saved ' + prettyBytes(saved) + ' - ' + percent.toFixed(1).replace(/\.0$/, '') + '%';
    		msg = saved > 0 ? savedMsg : 'already optimized';
            console.log(chalk.green('✔ ') + srcPath + chalk.yellow(' > ') + files[i].path + ' - ' + msg);
        }
    });
}

var fileGlob;
for (var i = 0, fl = imageminConfig.files.length; i < fl; i++) {
    fileGlob = imageminConfig.files[i];
    glob(fileGlob, {}, function (er, files) {
        var basePath = fileGlob.substr(0, fileGlob.indexOf('*'));
        var srcPath, relativePath;
        for (var i = 0, fl = files.length; i < fl; i++) {
            srcPath = files[i];
            relativePath = srcPath.replace(basePath, '');
            minifyImage(srcPath, path.join(imageminConfig.output, path.dirname(relativePath)));
        }
    });
}
