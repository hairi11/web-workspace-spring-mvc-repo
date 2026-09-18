import { copyStaticFiles } from './build-common.mjs';

await copyStaticFiles({ minifyCss: true });

console.log('Built shared webapp resources.');
