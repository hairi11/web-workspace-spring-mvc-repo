import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { context } from 'esbuild';

const root = process.cwd();
const resourceRoot = path.join(root, 'src', 'main', 'resources', 'fc');
const outputDir = path.join(root, 'target', 'classes', 'META-INF', 'resources', 'fc');
const entry = path.join(resourceRoot, 'FcPage.js');
const localFieldTranslator = path.join(
    root,
    'src',
    'main',
    'resources',
    'META-INF',
    'resources',
    'fc',
    'FieldTranslator.local.js'
);
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

await mkdir(path.dirname(localFieldTranslator), { recursive: true });

try {
    await writeFile(localFieldTranslator, '', { flag: 'wx' });
} catch (error) {
    if (error.code !== 'EEXIST') throw error;
}

await mkdir(outputDir, { recursive: true });

const ctx = await context({
    entryPoints: [entry],
    bundle: true,
    platform: 'browser',
    format: 'iife',
    outfile: path.join(outputDir, 'fc.js'),
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

console.log('Watching FC frontend. Output: target/classes/META-INF/resources/fc/fc.js');
