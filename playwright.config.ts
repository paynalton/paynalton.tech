import { defineConfig, devices } from '@playwright/test';

const port=Number(process.env.E2E_PORT??4321);
if(!Number.isInteger(port)||port<1024||port>65535)throw new Error('Invalid E2E_PORT');
export default defineConfig({
  testDir: './tests',
  testIgnore: ['**/content/**', '**/design/**'],
  fullyParallel: true,
  workers: 2,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: 'retain-on-failure',
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
      : {},
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    // Keep Astro in the foreground even when an agent launches the test runner.
    command: `npm run preview -- --host 127.0.0.1 --port ${port} --ignore-lock`,
    url: `http://127.0.0.1:${port}/es/`,
    reuseExistingServer: false,
  },
});
