import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { context } from 'esbuild';

const root = process.cwd();
const resourceRoot = path.join(root, 'src', 'main', 'resources', 'fx');
const outputDir = path.join(root, 'target', 'classes', 'META-INF', 'resources', 'fx');
const entry = path.join(resourceRoot, 'FxPage.js');
const commonJsEntry = path.resolve(
    root,
    '..',
    '..',
    'common-js-web',
    'src',
    'index.js'
);

function workspaceCommonJsPlugin() {
    return {
        name: 'fx-workspace-common-js',
        setup(buildContext) {
            buildContext.onResolve(
                { filter: new RegExp('^@company/common-js-web$') },
                () => ({ path: commonJsEntry })
            );
        }
    };
}

await mkdir(outputDir, { recursive: true });

const ctx = await context({
    entryPoints: [entry],
    bundle: true,
    platform: 'browser',
    format: 'iife',
    outfile: path.join(outputDir, 'fx.js'),
    sourcemap: true,
    logLevel: 'info',
    plugins: [workspaceCommonJsPlugin()]
});

await ctx.watch();

async function shutdown() {
    await ctx.dispose();
    process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

console.log('Watching FX frontend. Output: target/classes/META-INF/resources/fx/fx.js');
