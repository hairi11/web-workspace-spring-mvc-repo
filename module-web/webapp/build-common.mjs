import { mkdir, cp, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { transform } from 'esbuild';

const root = process.cwd();
const distRoot = path.join(root, 'dist', 'module-web');
const vendorEntry = path.join(root, 'src', 'js', 'vendor.js');
const springViews = path.join(root, 'src', 'main', 'webapp', 'WEB-INF', 'views');
const fxViews = path.join(root, '..', 'fx-module', 'src', 'pages');

async function inlineCssImports(filePath, seen) {
    const absolutePath = path.resolve(filePath);
    seen = seen || new Set();
    if (seen.has(absolutePath)) return '';
    seen.add(absolutePath);

    const css = await readFile(absolutePath, 'utf8');
    const importPattern = /@import\s+(?:url\()?['"]([^'"]+)['"]\)?\s*;/g;
    let output = '';
    let lastIndex = 0;
    let match;

    while ((match = importPattern.exec(css)) !== null) {
        output += css.slice(lastIndex, match.index);
        const importedPath = path.resolve(path.dirname(absolutePath), match[1]);
        output += await inlineCssImports(importedPath, seen);
        lastIndex = importPattern.lastIndex;
    }

    output += css.slice(lastIndex);
    return output;
}

async function copySpringViews() {
    const target = path.join(distRoot, 'WEB-INF', 'views');

    await mkdir(target, { recursive: true });
    await cp(path.join(springViews, 'home.jsp'), path.join(target, 'home.jsp'));

    const fxTarget = path.join(target, 'fx');
    await mkdir(fxTarget, { recursive: true });

    for (const file of await readdir(fxViews)) {
        if (!file.endsWith('.jsp')) continue;
        await cp(path.join(fxViews, file), path.join(fxTarget, file));
    }
}

export async function bundleStyles(minify) {
    const entry = path.join(distRoot, 'assets', 'module-web.css');
    const bundled = await inlineCssImports(entry);
    const result = await transform(bundled, {
        loader: 'css',
        minify: minify === true
    });
    await writeFile(entry, result.code);
}

export async function copyStaticFiles(options) {
    options = options || {};

    await mkdir(path.join(distRoot, 'assets'), { recursive: true });
    await mkdir(path.join(distRoot, 'assets', 'styles'), { recursive: true });
    await mkdir(path.join(distRoot, 'webfonts'), { recursive: true });
    await mkdir(path.join(distRoot, 'fx'), { recursive: true });

    await copySpringViews();

    await cp(path.join(root, 'src', 'module-web.css'), path.join(distRoot, 'assets', 'module-web.css'));
    await cp(path.join(root, 'src', 'styles'), path.join(distRoot, 'assets', 'styles'), { recursive: true });
    await cp(path.join(root, 'node_modules', 'bootstrap', 'dist', 'css', 'bootstrap.min.css'), path.join(distRoot, 'assets', 'bootstrap.min.css'));
    await cp(path.join(root, 'node_modules', 'datatables.net-bs5', 'css', 'dataTables.bootstrap5.min.css'), path.join(distRoot, 'assets', 'dataTables.bootstrap5.min.css'));
    await cp(path.join(root, 'node_modules', 'datatables.net-select-bs5', 'css', 'select.bootstrap5.min.css'), path.join(distRoot, 'assets', 'select.bootstrap5.min.css'));
    await cp(path.join(root, 'node_modules', '@fortawesome', 'fontawesome-free', 'css', 'all.min.css'), path.join(distRoot, 'assets', 'fontawesome.min.css'));
    await cp(path.join(root, 'node_modules', '@fortawesome', 'fontawesome-free', 'webfonts'), path.join(distRoot, 'webfonts'), { recursive: true });
    await cp(path.join(root, 'node_modules', 'select2', 'dist', 'css', 'select2.min.css'), path.join(distRoot, 'assets', 'select2.min.css'));
    await cp(path.join(root, 'node_modules', 'flatpickr', 'dist', 'flatpickr.min.css'), path.join(distRoot, 'assets', 'flatpickr.min.css'));

    await bundleStyles(options.minifyCss === true);
}

export function bundleDefinitions() {
    return [
        { name: 'fx', entry: path.join(root, '..', 'fx-module', 'src', 'FxPage.js'), outfile: path.join(distRoot, 'fx', 'fx.js') }
    ];
}

export function sharedVendorPlugin(entryFile) {
    const normalizedEntry = path.resolve(entryFile);
    return {
        name: 'shared-vendor-bootstrap',
        setup(buildContext) {
            buildContext.onLoad({ filter: /\.js$/ }, async (args) => {
                if (path.resolve(args.path) !== normalizedEntry) return null;
                const source = await readFile(args.path, 'utf8');
                return { contents: `import ${JSON.stringify(vendorEntry)};\n${source}`, loader: 'js' };
            });
        }
    };
}

export { distRoot, fxViews, springViews };
