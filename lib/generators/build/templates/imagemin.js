import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import glob from 'glob';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import prettyBytes from 'pretty-bytes';
import buildConfig from './config';

const imageminConfig = buildConfig.imagemin;

function minifyImage(srcPath, output) {
    const stats = fs.statSync(srcPath);
    const originalSize = stats.size;

    imagemin([srcPath], output, {
        plugins: [
            imageminMozjpeg(),
            imageminPngquant({
                quality: '65-80',
            }),
        ],
    }).then((files) => {
        let saved;
        let optimizedSize;
        let percent;
        let savedMsg;
        let msg;
        const fl = files.length;
        for (let i = 0; i < fl; i += 1) {
            optimizedSize = files[i].data.length;
            saved = originalSize - optimizedSize;
            percent = originalSize > 0 ? (saved / originalSize) * 100 : 0;
            savedMsg = `saved ${prettyBytes(saved)} - ${percent.toFixed(1).replace(/\.0$/, '')}%`;
            msg = saved > 0 ? savedMsg : 'already optimized';
            console.log(`${chalk.green('✔')} ${srcPath} ${chalk.yellow('>')} ${files[i].path} - ${msg}`);
        }
    });
}

const processFile = fileGlob => (
    (er, files) => {
        const basePath = fileGlob.substr(0, fileGlob.indexOf('*'));
        let srcPath;
        let relativePath;
        const fl = files.length;
        for (let i = 0; i < fl; i += 1) {
            srcPath = files[i];
            relativePath = srcPath.replace(basePath, '');
            minifyImage(srcPath, path.join(imageminConfig.output, path.dirname(relativePath)));
        }
    }
);

for (let i = 0, fl = imageminConfig.files.length; i < fl; i += 1) {
    glob(imageminConfig.files[i], {}, processFile(imageminConfig.files[i]));
}
