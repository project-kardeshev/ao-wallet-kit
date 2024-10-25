import { exec } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const wallet =
  process.env.DEPLOY_KEY ??
  fs.readFileSync(path.join(__dirname, 'wallet.json'), 'utf-8').trim();
const b64EncodedWallet =
  process.env.DEPLOY_KEY ?? Buffer.from(wallet).toString('base64');

async function main() {
  const deployProcess = exec(
    `yarn build-storybook && permaweb-deploy --ant-process $DEPLOY_ANT_PROCESS_ID --undername ao-wallet-kit --deploy-folder $DEPLOY_DIR`,
    {
      env: {
        ...process.env,
        DEPLOY_KEY: b64EncodedWallet,
        DEPLOY_ANT_PROCESS_ID: 'wJVTnZTedI9FIY4r2cB9C4CpAJKImvhu0WjOh0AecjQ',
        DEPLOY_DIR: path.join(__dirname, '..', 'storybook-static'),
      },
    },
  );

  deployProcess.stdout.pipe(process.stdout);
  deployProcess.stderr.pipe(process.stderr);
  deployProcess.on('exit', (code) => {
    if (code !== 0) {
      process.exit(code);
    }
  });
}

main().catch(console.error);
