/** Deterministic source-only P1 inventory; stdout JSON by default.
 * Usage: node scripts/p1_course_inventory.mjs [--output path.json]
 */
import {writeFileSync} from 'node:fs';
import {buildP1Inventory} from '../src/course-catalog-p1.mjs';
const args=process.argv.slice(2);
if(args.length&&!(args.length===2&&args[0]==='--output'&&args[1].endsWith('.json')))
 throw Error('Usage: node scripts/p1_course_inventory.mjs [--output path.json]');
const output=JSON.stringify(buildP1Inventory(),null,2)+'\n';
if(args.length)writeFileSync(args[1],output,'utf8');
else process.stdout.write(output);
