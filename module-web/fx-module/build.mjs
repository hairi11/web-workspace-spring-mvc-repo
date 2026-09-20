import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { build } from 'esbuild';

const root = process.cwd();
const resourceRoot = path.join(root, 'src', 'main', 'resources', 'fx');
const outputDir = path.join(root, 'target', 'classes', 'META-INF', 'resources', 'fx');
const entry = path.join(resourceRoot, 'FxPage.js');
const vendorEntry = path.join(resourceRoot, 'vendor.js');
const nodeModules = path.join(root, 'node_modules');
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
                { filter: /^@company\\/common-js-web$/ },
                () => ({ path: commonJsEntry })
            );
        }
    };
}

function sharedVendorPlugin(entryFile) {
    const normalizedEntry = path.resolve(entryFile);

    return {
        name: 'fx-vendor-bootstrap',
        setup(buildContext) {
            buildContext.onLoad({ filter: /\.js$/ }, async (args) => {
                if (path.resolve(args.path) !== normalizedEntry) return null;

                const { readFile } = await import('node:fs/promises');
                const source = await readFile(args.path, 'utf8');

                return {
                    contents: `import ${JSON.stringify(vendorEntry)};\n${source}`,
                    loader: 'js'
                };
            });
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
    nodePaths: [nodeModules],
    plugins: [
        workspaceCommonJsPlugin(),
        sharedVendorPlugin(entry)
    ]
});

console.log('Built FX JavaScript into META-INF/resources/fx.');
