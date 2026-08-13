import { test, expect } from "@playwright/test";

test("landing page loads and shows hero", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  
  await expect(page.locator("h1").first()).toBeVisible();
  await expect(page.getByText("BloomLab").first()).toBeVisible();
});

test("login page loads", async ({ page }) => {
  await page.goto("http://localhost:3000/login");
  
  await expect(page.locator('input[placeholder="Email"]')).toBeVisible();
  await expect(page.locator('input[placeholder="Password"]')).toBeVisible();
});

test("playground button page shows animated button", async ({ page }) => {
  await page.goto("http://localhost:3000/playground/button");
  
  await expect(page.getByText("Animated Send Button")).toBeVisible();
  await expect(page.getByText("Force Success")).toBeVisible();
  await expect(page.getByText("Force Failure")).toBeVisible();
});