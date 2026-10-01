import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { build } from 'esbuild';

const root = process.cwd();
const resourceRoot = path.join(root, 'src', 'main', 'resources', 'fc');
const outputDir = path.join(root, 'target', 'classes', 'META-INF', 'resources', 'fc');
const entry = path.join(resourceRoot, 'FcPage.js');
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
        name: 'fc-workspace-common-js',
        setup(buildContext) {
            buildContext.onResolve(
                { filter: new RegExp('^@company/common-js-web$') },
                () => ({ path: commonJsEntry })
            );
        }
    };
}

await mkdir(outputDir, { recursive: true });

await build({
    entryPoints: [entry],
    bundle: true,
    platform: 'browser',
    format: 'iife',
    outfile: path.join(outputDir, 'fc.js'),
    sourcemap: true,
    minify: true,
    logLevel: 'info',
    plugins: [workspaceCommonJsPlugin()]
});

console.log('Built FC JavaScript into META-INF/resources/fc.');
