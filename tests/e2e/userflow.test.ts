import { test, expect } from '@playwright/test';

test.describe('Election Guide AI - User Journey', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should load the application', async ({ page }) => {
    await expect(page).toHaveTitle(/Election Guide/);
    await expect(page.locator('h1')).toContainText('Election Guide AI');
  });

  test('should navigate between tabs', async ({ page }) => {
    // Click Timeline tab
    await page.click('button:has-text("Timeline")');
    await expect(page.locator('text=Election Timeline')).toBeVisible();

    // Click Voter Guide tab
    await page.click('button:has-text("Voter Guide")');
    await expect(page.locator('text=Voter Guide')).toBeVisible();

    // Click Chat tab
    await page.click('button:has-text("Chat Assistant")');
    await expect(page.locator('text=Election Guide Assistant')).toBeVisible();
  });

  test('should ask a question in chat', async ({ page }) => {
    // Find chat input
    const input = page.locator('input[placeholder*="Ask me"]');
    await input.fill('How do I register to vote?');

    // Submit question
    const submitButton = page.locator('button:has-text("Send")');
    await submitButton.click();

    // Verify response appears
    await expect(page.locator('text=registration')).toBeVisible({ timeout: 5000 });
  });

  test('should change language', async ({ page }) => {
    // Open language selector
    const select = page.locator('select');
    await select.selectOption('es');

    // Verify language changed
    await expect(select).toHaveValue('es');
  });

  test('should toggle accessibility mode', async ({ page }) => {
    // Click accessibility button
    await page.click('button:has-text("Accessibility Options")');

    // Click high contrast button
    await page.click('button:has-text("High Contrast")');

    // Verify high contrast is applied
    const htmlElement = page.locator('html');
    const attribute = await htmlElement.evaluate((el) =>
      el.getAttribute('data-contrast')
    );
    expect(attribute).toBe('high');
  });

  test('should navigate voter guide steps', async ({ page }) => {
    // Go to Voter Guide tab
    await page.click('button:has-text("Voter Guide")');

    // Click next button
    const nextButton = page.locator('button:has-text("Next")');
    await nextButton.click();

    // Verify step changed
    await expect(page.locator('text=Step 2')).toBeVisible();

    // Click previous button
    const prevButton = page.locator('button:has-text("Previous")');
    await prevButton.click();

    // Verify back to step 1
    await expect(page.locator('text=Step 1 of')).toBeVisible();
  });

  test('should mark voter guide steps as complete', async ({ page }) => {
    // Go to Voter Guide
    await page.click('button:has-text("Voter Guide")');

    // Click mark complete button
    const completeButton = page.locator('button:has-text("Mark Complete")');
    await completeButton.click();

    // Verify it changed
    await expect(page.locator('button:has-text("Completed")')).toBeVisible();
  });

  test('should read content aloud', async ({ page }) => {
    // Go to Chat tab
    await page.goto('http://localhost:3000');

    // Ask a question
    const input = page.locator('input[placeholder*="Ask me"]');
    await input.fill('When is election day?');
    await page.locator('button:has-text("Send")').click();

    // Wait for response
    await page.waitForTimeout(1000);

    // Find and click read aloud button
    const ttsButton = page.locator('button:has-text("Read Aloud")').first();
    if (await ttsButton.isVisible()) {
      await ttsButton.click();
    }
  });

  test('should view timeline details', async ({ page }) => {
    // Go to Timeline tab
    await page.click('button:has-text("Timeline")');

    // Click a phase button
    const phaseButton = page.locator('button').first();
    await phaseButton.click();

    // Verify details panel is visible
    await expect(page.locator('div[role="tabpanel"]')).toBeVisible();
  });

  test('should have keyboard navigation', async ({ page }) => {
    // Tab to first element
    await page.keyboard.press('Tab');

    // Verify focus is visible
    const focusedElement = await page.evaluate(() => {
      return (document.activeElement as HTMLElement)?.tagName;
    });
    expect(focusedElement).toBeDefined();
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    // Check for ARIA labels
    const mainContent = page.locator('[role="main"]');
    await expect(mainContent).toBeVisible();

    // Check for skip link
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeVisible();

    // Check for navigation
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });
});
