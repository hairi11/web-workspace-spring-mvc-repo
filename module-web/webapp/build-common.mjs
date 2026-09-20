import { access, mkdir, cp, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { transform } from 'esbuild';

const root = process.cwd();
const distRoot = path.join(root, 'dist', 'module-web');
const springViews = path.join(root, 'src', 'main', 'webapp', 'WEB-INF', 'views');
const moduleRoot = path.resolve(root, '..');

const featureResources = [
    {
        name: 'fx',
        views: path.join(
            moduleRoot,
            'fx-module',
            'src',
            'main',
            'resources',
            'META-INF',
            'resources',
            'WEB-INF',
            'views',
            'fx'
        ),
        bundle: path.join(
            moduleRoot,
            'fx-module',
            'target',
            'classes',
            'META-INF',
            'resources',
            'fx'
        )
    },
    {
        name: 'fc',
        views: path.join(
            moduleRoot,
            'fc-module',
            'src',
            'main',
            'resources',
            'META-INF',
            'resources',
            'WEB-INF',
            'views',
            'fc'
        ),
        bundle: path.join(
            moduleRoot,
            'fc-module',
            'target',
            'classes',
            'META-INF',
            'resources',
            'fc'
        )
    }
];

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

async function exists(target) {
    try {
        await access(target);
        return true;
    } catch {
        return false;
    }
}

async function copySpringViews() {
    const target = path.join(distRoot, 'WEB-INF', 'views');
    await mkdir(target, { recursive: true });
    await cp(path.join(springViews, 'home.jsp'), path.join(target, 'home.jsp'));
}

function relativeInside(parent, child) {
    const relative = path.relative(path.resolve(parent), path.resolve(child));
    if (relative.startsWith('..') || path.isAbsolute(relative)) return null;
    return relative;
}

export async function removeWatchedResource(sourcePath) {
    const source = path.resolve(sourcePath);
    const mappings = [
        {
            source: path.join(root, 'src', 'module-web.css'),
            target: path.join(distRoot, 'assets', 'module-web.css'),
            allowRoot: true
        },
        {
            source: path.join(root, 'src', 'styles'),
            target: path.join(distRoot, 'assets', 'styles'),
            allowRoot: true
        },
        {
            source: springViews,
            target: path.join(distRoot, 'WEB-INF', 'views'),
            allowRoot: false
        }
    ];

    featureResources.forEach((feature) => {
        mappings.push(
            {
                source: feature.views,
                target: path.join(distRoot, 'WEB-INF', 'views', feature.name),
                allowRoot: true
            },
            {
                source: feature.bundle,
                target: path.join(distRoot, feature.name),
                allowRoot: true
            }
        );
    });

    for (const mapping of mappings) {
        const relative = relativeInside(mapping.source, source);
        if (relative === null || (relative === '' && !mapping.allowRoot)) {
            continue;
        }

        await rm(path.join(mapping.target, relative), {
            recursive: true,
            force: true
        });
        return true;
    }

    return false;
}

export async function copyFeatureResources() {
    for (const feature of featureResources) {
        const viewTarget = path.join(distRoot, 'WEB-INF', 'views', feature.name);
        const bundleTarget = path.join(distRoot, feature.name);

        if (await exists(feature.views)) {
            await mkdir(viewTarget, { recursive: true });
            await cp(feature.views, viewTarget, { recursive: true });
        }

        if (await exists(feature.bundle)) {
            await mkdir(bundleTarget, { recursive: true });
            await cp(feature.bundle, bundleTarget, { recursive: true });
        }
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

    await copySpringViews();
    await copyFeatureResources();

    await cp(path.join(root, 'src', 'module-web.css'), path.join(distRoot, 'assets', 'module-web.css'));
    await cp(path.join(root, 'src', 'styles'), path.join(distRoot, 'assets', 'styles'), { recursive: true });
    await cp(path.join(root, 'node_modules', 'bootstrap', 'dist', 'css', 'bootstrap.min.css'), path.join(distRoot, 'assets', 'bootstrap.min.css'));
    await cp(path.join(root, 'node_modules', 'datatables.net-bs5', 'css', 'dataTables.bootstrap5.min.css'), path.join(distRoot, 'assets', 'dataTables.bootstrap5.min.css'));
    await cp(path.join(root, 'node_modules', 'datatables.net-buttons-bs5', 'css', 'buttons.bootstrap5.min.css'), path.join(distRoot, 'assets', 'buttons.bootstrap5.min.css'));
    await cp(path.join(root, 'node_modules', 'datatables.net-select-bs5', 'css', 'select.bootstrap5.min.css'), path.join(distRoot, 'assets', 'select.bootstrap5.min.css'));
    await cp(path.join(root, 'node_modules', '@fortawesome', 'fontawesome-free', 'css', 'all.min.css'), path.join(distRoot, 'assets', 'fontawesome.min.css'));
    await cp(path.join(root, 'node_modules', '@fortawesome', 'fontawesome-free', 'webfonts'), path.join(distRoot, 'webfonts'), { recursive: true });
    await cp(path.join(root, 'node_modules', 'select2', 'dist', 'css', 'select2.min.css'), path.join(distRoot, 'assets', 'select2.min.css'));
    await cp(path.join(root, 'node_modules', 'flatpickr', 'dist', 'flatpickr.min.css'), path.join(distRoot, 'assets', 'flatpickr.min.css'));
    await cp(path.join(root, 'node_modules', 'jquery-contextmenu', 'dist', 'jquery.contextMenu.min.css'), path.join(distRoot, 'assets', 'jquery.contextMenu.min.css'));

    await bundleStyles(options.minifyCss === true);
}

export { distRoot, springViews, featureResources };
