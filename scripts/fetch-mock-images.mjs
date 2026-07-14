/**
 * fetch-mock-images.mjs
 *
 * Downloads the curated mock-photography set from Unsplash and processes it
 * into src/content/. Idempotent: files that already exist are skipped, so the
 * repo builds offline once images are committed.
 *
 * Run from the repo root:  node scripts/fetch-mock-images.mjs
 */
import sharp from 'sharp';
import { mkdir, access } from 'node:fs/promises';
import path from 'node:path';

const Q = '?q=85&w=3000&fm=jpg';
const u = (id) => `https://images.unsplash.com/${id}${Q}`;

/**
 * Curated manifest. Every shoot is built from ONE photographer's session so
 * the frames read as a single evening of work. All URLs verified 200/image.
 */
const manifest = {
  'unaweep-homestead-elopement': [
    { url: u('photo-1695138885775-8d3293937f7e'), file: '01.webp', alt: 'foreheads together by the stone wall' },
    { url: u('photo-1695138884708-41814f906593'), file: '02.webp', alt: 'bride under the ceremony arch' },
    { url: u('photo-1695138885147-2bbccd8fd94a'), file: '03.webp', alt: 'bride with bouquet by the fence' },
    { url: u('photo-1695138885419-4516d00f3f25'), file: '04.webp', alt: 'vows beneath the arch' },
    { url: u('photo-1695138884143-222c4e7eb9a0'), file: '05.webp', alt: 'bouquet and dress detail' },
    { url: u('photo-1695138888424-131ddb7c0220'), file: '06.webp', alt: 'celebration after the vows' },
    { url: u('photo-1695138886580-8909868d8b3e'), file: '07.webp', alt: 'walking out hand in hand' },
    { url: u('photo-1695138887567-f9701f0a1412'), file: '08.webp', alt: 'couple under the desert tree' },
  ],
  'little-book-cliffs-elopement': [
    { url: u('photo-1758565177153-570f99aa43eb'), file: '01.webp', alt: 'bride full length in golden hills' },
    { url: u('photo-1758565177094-dec8395e78e9'), file: '02.webp', alt: 'hands and new ring' },
    { url: u('photo-1758565177415-33b15a0729de'), file: '03.webp', alt: 'walking through dry grass' },
    { url: u('photo-1758565177135-1146d10cb83f'), file: '04.webp', alt: 'the dip with bouquet' },
    { url: u('photo-1758565177130-cd964fa6d26f'), file: '05.webp', alt: 'quiet embrace at sunset' },
    { url: u('photo-1758565177095-f3dbdbd00e4f'), file: '06.webp', alt: 'smiling over the bouquet' },
  ],
  'glade-park-proposal': [
    { url: u('photo-1755322824388-d27c4780300b'), file: '01.webp', alt: 'kiss into the setting sun' },
    { url: u('photo-1755322824386-59826bdfc4dd'), file: '02.webp', alt: 'down on one knee with horse' },
    { url: u('photo-1755322825305-5a9ef002cf7b'), file: '03.webp', alt: 'wide view with two horses' },
    { url: u('photo-1755322824387-8fe344cb329f'), file: '04.webp', alt: 'embrace in tall grass' },
    { url: u('photo-1755322763603-9db933e157e5'), file: '05.webp', alt: 'her hand in his, new ring' },
    { url: u('photo-1755322763607-85b1dc3b0b7e'), file: '06.webp', alt: 'spinning through the dusk' },
    { url: u('photo-1755322763602-03ba06dea990'), file: '07.webp', alt: 'hat brims and ring detail' },
  ],
  'fruita-fields-engagement': [
    { url: u('photo-1721245446417-c63ea048a8d9'), file: '01.webp', alt: 'her arm around him, laughing' },
    { url: u('photo-1721245446577-395b90873566'), file: '02.webp', alt: 'kiss on the cheek in dry grass' },
    { url: u('photo-1721245446569-cb5722033805'), file: '03.webp', alt: 'cheek kiss, smiling at camera' },
    { url: u('photo-1721245446428-7224cc626788'), file: '04.webp', alt: 'laughing at each other' },
    { url: u('photo-1721245445958-7c963cd41922'), file: '05.webp', alt: 'looking up at him, low angle' },
    { url: u('photo-1721245446822-2c4ad0e7468b'), file: '06.webp', alt: 'peace sign, both grinning' },
    { url: u('photo-1721245446623-3c941e301ec4'), file: '07.webp', alt: 'her ring hand on his chest' },
  ],
  'redlands-family-golden-hour': [
    { url: u('photo-1643130420750-8d326e74ecf5'), file: '01.webp', alt: 'parents kiss, daughter with balloons' },
    { url: u('photo-1643130420837-811817d8d1ce'), file: '02.webp', alt: 'family of three in gold field' },
    { url: u('photo-1643130420763-964c891d218c'), file: '03.webp', alt: 'dad scoops her up for a kiss' },
    { url: u('photo-1643130420752-e2730e8f6a9f'), file: '04.webp', alt: 'leaning into mom at sunset' },
    { url: u('photo-1643130420857-cb8cf55809a8'), file: '05.webp', alt: 'walking hand in hand, all three' },
    { url: u('photo-1643130420613-886ba8952e75'), file: '06.webp', alt: 'holding the little brother onesie' },
    { url: u('photo-1643130420759-1ab3e8b08940'), file: '07.webp', alt: 'girl with fistful of blue balloons' },
    { url: u('photo-1643130420752-5a3d18960313'), file: '08.webp', alt: 'blue balloons at golden hour' },
  ],
  'fruita-home-place-family': [
    { url: u('photo-1738748712479-3ff8c7bc4c23'), file: '01.webp', alt: 'upside down between mom and dad' },
    { url: u('photo-1738748711032-377d48cab59b'), file: '02.webp', alt: 'passing their girl between them' },
    { url: u('photo-1738748712153-04f836f5ad38'), file: '03.webp', alt: 'mom swings her in tall grass' },
    { url: u('photo-1738748715132-571735a54749'), file: '04.webp', alt: 'mid-swing, hair flying' },
    { url: u('photo-1738748712581-41d28889b6e1'), file: '05.webp', alt: 'backlit at sundown' },
    { url: u('photo-1738748710405-cc903d4cca28'), file: '06.webp', alt: 'carried home on the dirt path' },
    { url: u('photo-1738750204130-088a0da0d926'), file: '07.webp', alt: 'the blanket hammock' },
  ],
  'highline-lake-senior': [
    { url: u('photo-1689866499971-78b9f47e48c6'), file: '01.webp', alt: 'laughing in the truck, lake behind' },
    { url: u('photo-1689866499956-3b9a57427142'), file: '02.webp', alt: 'cross-legged on the tailgate' },
    { url: u('photo-1689866499898-cf0842274e60'), file: '03.webp', alt: 'leaning out the driver window' },
    { url: u('photo-1689866499892-53e5e619c3fc'), file: '04.webp', alt: 'sun flare off the water' },
    { url: u('photo-1689866500116-f1836c32e2e1'), file: '05.webp', alt: 'second outfit, on the blankets' },
    { url: u('photo-1689866499902-f7ab6a2c7eb9'), file: '06.webp', alt: 'stretched out on the quilt' },
    { url: u('photo-1689866499921-11e00db1c91e'), file: '07.webp', alt: 'watching the sun over the tailgate' },
  ],
  'palisade-prom-send-off': [
    { url: u('photo-1689620323343-09d697fcc726'), file: '01.webp', alt: 'a twirl on the lawn' },
    { url: u('photo-1689620400465-cd736688c41f'), file: '02.webp', alt: 'the dip by the front doors' },
    { url: u('photo-1689620471599-7be7db37e082'), file: '03.webp', alt: 'navy tux and the borrowed car' },
  ],
  'monument-sunset-senior': [
    { url: u('photo-1757908422567-bb33591078ff'), file: '01.webp', alt: 'knee-deep in backlit grass' },
    { url: u('photo-1757908422569-1ad60782c6c4'), file: '02.webp', alt: 'standing still in the gold field' },
    { url: u('photo-1757908422580-0f659a7197a2'), file: '03.webp', alt: 'walking the field edge' },
    { url: u('photo-1757908422565-d939e69293e7'), file: '04.webp', alt: 'wildflower held to the low sun' },
  ],
};

/** Landing-page hero: canyon rim at dusk, dark foreground for the text scrim. */
const hero = {
  url: u('photo-1763793928603-7d635b06cf79'),
  dest: 'src/content/site/hero.webp',
};

const exists = (p) => access(p).then(() => true, () => false);

async function processOne(url, dest) {
  if (await exists(dest)) {
    console.log(`skip   ${dest} (exists)`);
    return;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const type = res.headers.get('content-type') || '';
  if (!type.startsWith('image/')) throw new Error(`Not an image (${type}) for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await mkdir(path.dirname(dest), { recursive: true });
  // .rotate() applies EXIF orientation; sharp strips metadata by default.
  await sharp(buf)
    .rotate()
    .resize(2400, 2400, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(dest);
  console.log(`wrote  ${dest}`);
}

const jobs = [];
for (const [slug, images] of Object.entries(manifest)) {
  for (const { url, file } of images) {
    jobs.push({ url, dest: path.join('src/content/shoots', slug, file) });
  }
}
jobs.push({ url: hero.url, dest: hero.dest });

const failures = [];
for (const job of jobs) {
  try {
    await processOne(job.url, job.dest);
  } catch (err) {
    console.error(`FAIL   ${job.dest}: ${err.message}`);
    failures.push({ ...job, error: err.message });
  }
}

console.log(`\n${jobs.length - failures.length}/${jobs.length} images in place.`);
if (failures.length > 0) {
  console.error('\nFailed downloads:');
  for (const f of failures) console.error(`  ${f.dest} <- ${f.url} (${f.error})`);
  process.exit(1);
}
