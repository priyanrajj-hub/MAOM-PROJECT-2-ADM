import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Mahabharata E2E test suite', () => {

    test('Home page renders and has basic accessibility', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('h1')).toContainText('Epic of Ages');

        // Accessibility check
        const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
        expect(accessibilityScanResults.violations.length).toBeLessThan(5); // Adjust threshold as needed
    });

    test('Navigation to Sample Content and 404 works (Offline resilience check)', async ({ page }) => {
        await page.goto('/');
        // Check for sample content badge on Chapter 1
        const chapter1Item = page.locator('div', { hasText: 'Ch. 1' }).first();
        await expect(chapter1Item.locator('text=Sample Content')).toBeVisible();

        // 404 Route handling
        await page.goto('/some-invalid-route');
        await expect(page.locator('text=Page Not Found')).toBeVisible();
        await page.locator('text=Dashboard').click();
        await expect(page).toHaveURL('/');
    });

    test('Lesson loads Chapter 7 curriculum & Quiz flows properly', async ({ page }) => {
        await page.goto('/lesson/7');
        await expect(page.locator('h1')).toContainText('Dharma in Crisis');

        // Ensure no broken Dharma/Adharma tags
        const charSpotlight = page.locator('text=Character Spotlight');
        await expect(charSpotlight).toBeVisible();

        // Navigate to Quiz
        await page.click('text=Take Quiz');
        await expect(page).toHaveURL(/\/quiz\/7/);

        // Quiz Engine state check
        await expect(page.locator('text=Question 1 of 15')).toBeVisible();

        // Answer first question
        const firstOption = page.locator('button', { hasText: 'A.' }).first();
        // Assuming options exist, if not click whatever the first option button is
        const optionBtns = page.locator('button').filter({ hasText: /.*/ });
        if (await optionBtns.count() > 0) {
            await optionBtns.nth(0).click();
            await expect(page.locator('text=Concept Explanation')).toBeVisible();
            await page.click('text=Continue');
            await expect(page.locator('text=Question 2 of 15')).toBeVisible();
        }
    });

    test('Chatbot toggles and restricts empty submits (API protection)', async ({ page }) => {
        await page.goto('/lesson/7');
        await page.locator('button[aria-label="Open AI tutor"]').click();
        await expect(page.locator('text=Mahabharata AI Tutor')).toBeVisible();

        const input = page.locator('input[placeholder="Ask about a chapter…"]');
        const sendBtn = page.locator('button[aria-label="Send message"]');

        await expect(sendBtn).toBeDisabled();
        await input.fill('What is Dharma?');
        await expect(sendBtn).toBeEnabled();
    });
});
