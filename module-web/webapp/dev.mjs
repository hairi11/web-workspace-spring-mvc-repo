import browserSyncFactory from 'browser-sync';
import chokidar from 'chokidar';
import path from 'node:path';
import {
    copyStaticFiles,
    springViews
} from './build-common.mjs';

const browserSync = browserSyncFactory.create();
const root = process.cwd();

await copyStaticFiles();

browserSync.init({
    proxy: 'http://localhost:8081',
    startPath: '/module-web/',
    port: 3000,
    open: false,
    notify: false,
    ui: false
});

const copyWatch = chokidar.watch([
    path.join(root, 'src', 'module-web.css'),
    path.join(root, 'src', 'styles'),
    springViews
], {
    ignoreInitial: true,
    awaitWriteFinish: {
        stabilityThreshold: 100,
        pollInterval: 25
    }
});

let refreshQueue = Promise.resolve();

function queueRefresh() {
    refreshQueue = refreshQueue
        .then(() => copyStaticFiles())
        .then(() => {
            if (browserSync.active) browserSync.reload();
        })
        .catch((error) => console.error('Webapp resource refresh failed:', error));
}

copyWatch.on('add', queueRefresh);
copyWatch.on('change', queueRefresh);
copyWatch.on('unlink', queueRefresh);

async function shutdown() {
    await copyWatch.close();
    browserSync.exit();
    process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

console.log('Spring MVC app expected at http://localhost:8081/module-web/');
console.log('BrowserSync proxy: http://localhost:3000/module-web/');
