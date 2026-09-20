import browserSyncFactory from 'browser-sync';
import chokidar from 'chokidar';
import path from 'node:path';
import {
    copyFeatureResources,
    copyStaticFiles,
    featureResources,
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

const watcherOptions = {
    ignoreInitial: true,
    awaitWriteFinish: {
        stabilityThreshold: 100,
        pollInterval: 25
    }
};

const copyWatch = chokidar.watch([
    path.join(root, 'src', 'module-web.css'),
    path.join(root, 'src', 'styles'),
    springViews
], watcherOptions);

const featureWatch = chokidar.watch(
    featureResources.flatMap((feature) => [feature.views, feature.bundle]),
    watcherOptions
);

let refreshQueue = Promise.resolve();

function queueRefresh(copyTask, label) {
    refreshQueue = refreshQueue
        .then(() => copyTask())
        .then(() => {
            if (browserSync.active) browserSync.reload();
        })
        .catch((error) => console.error(label + ' refresh failed:', error));
}

function queueWebappRefresh() {
    queueRefresh(copyStaticFiles, 'Webapp resource');
}

function queueFeatureRefresh() {
    queueRefresh(copyFeatureResources, 'Feature resource');
}

copyWatch.on('add', queueWebappRefresh);
copyWatch.on('change', queueWebappRefresh);
copyWatch.on('unlink', queueWebappRefresh);

featureWatch.on('add', queueFeatureRefresh);
featureWatch.on('change', queueFeatureRefresh);
featureWatch.on('unlink', queueFeatureRefresh);

async function shutdown() {
    await Promise.all([
        copyWatch.close(),
        featureWatch.close()
    ]);
    browserSync.exit();
    process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

console.log('Spring MVC app expected at http://localhost:8081/module-web/');
console.log('BrowserSync proxy: http://localhost:3000/module-web/');
console.log('Watching shared CSS/JSP plus FX/FC JSP and frontend bundles for live refresh.');
