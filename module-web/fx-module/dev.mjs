import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { context } from 'esbuild';

const root = process.cwd();
const resourceRoot = path.join(root, 'src', 'main', 'resources', 'fx');
const outputDir = path.join(root, 'target', 'classes', 'META-INF', 'resources', 'fx');
const entry = path.join(resourceRoot, 'FxPage.js');
const vendorEntry = path.join(resourceRoot, 'vendor.js');
const nodeModules = path.join(root, 'node_modules');

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

const ctx = await context({
    entryPoints: [entry],
    bundle: true,
    platform: 'browser',
    format: 'iife',
    outfile: path.join(outputDir, 'fx.js'),
    sourcemap: true,
    logLevel: 'info',
    nodePaths: [nodeModules],
    plugins: [sharedVendorPlugin(entry)]
});

await ctx.watch();

async function shutdown() {
    await ctx.dispose();
    process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

console.log('Watching FX frontend. Output: target/classes/META-INF/resources/fx/fx.js');
