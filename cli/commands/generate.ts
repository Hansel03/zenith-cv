import { assertServerIsRunning, exec } from '../helpers';

export async function generateCommand() {
  await assertServerIsRunning();

  await exec('concurrently "npm:generate:*(!watch)" -c red,yellow,blue');

  process.exit(0);
}
