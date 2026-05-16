import { expect, test } from '@playwright/test';

test('gift form renders optional media sections', async ({ page }) => {
  await page.goto('/gift');

  await expect(page.getByText('Add a Memory Photo (Optional)')).toBeVisible();
  await expect(page.getByText('Add a Voice Note (Optional)')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Record' })).toBeVisible();
  await expect(page.getByText('Upload', { exact: true })).toBeVisible();
});

test('gift form submits and navigates to result route', async ({ page }) => {
  await page.goto('/gift');

  await page.getByLabel('Their Name').fill('Ava');
  await page.getByLabel('Your Name').fill('Noah');
  await page.locator('#date').fill('2000-01-01');
  await page.getByLabel('Your Personal Message').fill('You light up every room.');

  await page.getByRole('button', { name: 'Generate Universe' }).click();
  await expect(page).toHaveURL(/\/gift\/result/);
});

test('optional voice upload preview and remove works', async ({ page }) => {
  await page.goto('/gift');

  const fileInput = page.locator('input[type="file"][accept="audio/*"]');
  await fileInput.setInputFiles('public/bg music.mp3');

  await expect(page.locator('audio[controls]')).toBeVisible();
  await page.getByRole('button', { name: 'Remove' }).click();
  await expect(page.locator('audio[controls]')).toHaveCount(0);

  await page.getByLabel('Their Name').fill('Liam');
  await page.getByLabel('Your Name').fill('Mia');
  await page.locator('#date').fill('2001-02-03');
  await page.getByLabel('Your Personal Message').fill('Your voice deserves to be remembered.');

  await page.getByRole('button', { name: 'Generate Universe' }).click();
  await expect(page).toHaveURL(/\/gift\/result/);
});
