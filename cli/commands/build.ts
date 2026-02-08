import { exec, execWithLocalServer, log } from '../helpers';

export async function buildCommand() {
  const isVercel = process.env.VERCEL === '1';

  if (process.env.NETLIFY) {
    await reinstallPuppeteer();
  }

  if (isVercel) {
    log.info('Building for Vercel with asset generation...');

    // Build inicial
    await exec('astro build');

    // Generar assets usando preview server
    log.info('Generating PDFs and OG images...');
    await exec('npx start-server-and-test "astro preview --port 4321 --host" http://localhost:4321 "npm run generate"');

    // Rebuild final con assets
    await exec('astro build');
  } else {
    // Desarrollo local (tu flujo actual)
    await execWithLocalServer('npm run generate');
    await exec('astro build');
  }

  process.exit(0);
}

async function reinstallPuppeteer() {
  log.info('Reinstalling puppeteer...');
  await exec('npm rm puppeteer --no-save');
  await exec('npm add puppeteer --no-save');
  log.success('Puppeteer reinstalled successfully');
}
