import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { build } from 'esbuild';

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

await build({
    entryPoints: [entry],
    bundle: true,
    platform: 'browser',
    format: 'iife',
    outfile: path.join(outputDir, 'fx.js'),
    sourcemap: true,
    minify: true,
    logLevel: 'info',
    plugins: [workspaceCommonJsPlugin()]
});

console.log('Built FX JavaScript into META-INF/resources/fx.');
