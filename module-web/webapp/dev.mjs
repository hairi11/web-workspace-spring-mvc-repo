import browserSyncFactory from 'browser-sync';
import chokidar from 'chokidar';
import { context } from 'esbuild';
import path from 'node:path';
import {
    copyStaticFiles,
    bundleDefinitions,
    sharedVendorPlugin,
    fxViews,
    springViews
} from './build-common.mjs';

const browserSync = browserSyncFactory.create();
const root = process.cwd();
const nodeModules = path.join(root, 'node_modules');

await copyStaticFiles();

const esbuildContexts = [];
for (const item of bundleDefinitions()) {
    const ctx = await context({
        entryPoints: [item.entry],
        bundle: true,
        platform: 'browser',
        format: 'iife',
        outfile: item.outfile,
        sourcemap: true,
        logLevel: 'info',
        nodePaths: [nodeModules],
        plugins: [
            sharedVendorPlugin(item.entry),
            {
                name: 'browser-reload',
                setup(build) {
                    build.onEnd((result) => {
                        if (result.errors.length === 0 && browserSync.active) {
                            browserSync.reload();
                        }
                    });
                }
            }
        ]
    });
    await ctx.watch();
    esbuildContexts.push(ctx);
}

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
    springViews,
    fxViews
], {
    ignoreInitial: true,
    awaitWriteFinish: {
        stabilityThreshold: 100,
        pollInterval: 25
    }
});

let staticRefreshQueue = Promise.resolve();

function queueStaticRefresh() {
    staticRefreshQueue = staticRefreshQueue
        .then(() => copyStaticFiles())
        .then(() => {
            if (browserSync.active) browserSync.reload();
        })
        .catch((error) => console.error('Static refresh failed:', error));
}

copyWatch.on('add', queueStaticRefresh);
copyWatch.on('change', queueStaticRefresh);
copyWatch.on('unlink', queueStaticRefresh);

async function shutdown() {
    await copyWatch.close();
    for (const ctx of esbuildContexts) await ctx.dispose();
    browserSync.exit();
    process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

console.log('Spring MVC app expected at http://localhost:8081/module-web/');
console.log('BrowserSync proxy: http://localhost:3000/module-web/');
console.log('Source changes rebuild/reload automatically.');
