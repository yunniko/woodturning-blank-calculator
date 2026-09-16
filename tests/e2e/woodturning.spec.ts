import { expect, test } from "@playwright/test";

test("home page links to all three tools", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Woodturning Blank Calculator" })).toBeVisible();
  await expect(page.getByTestId("tool-card-bowl-blank-calculator")).toBeVisible();
  await expect(page.getByTestId("tool-card-rough-out-drying-calculator")).toBeVisible();
  await expect(page.getByTestId("tool-card-turning-wood-reference")).toBeVisible();
});

test("bowl blank calculator: default inputs render a yield result", async ({ page }) => {
  await page.goto("/bowl-blank-calculator");
  await expect(page.getByTestId("blank-count")).toBeVisible();
  await expect(page.getByTestId("max-bowl-diameter")).toBeVisible();
  await expect(page.getByTestId("height-range")).toBeVisible();
});

test("bowl blank calculator: zero log diameter shows an error, not a crash", async ({ page }) => {
  await page.goto("/bowl-blank-calculator");
  await page.getByTestId("log-diameter").fill("0");
  await expect(page.getByTestId("bowl-blank-result")).toContainText("greater than zero");
});

test("bowl blank calculator: a short log yields zero blanks", async ({ page }) => {
  await page.goto("/bowl-blank-calculator");
  await page.getByTestId("log-length").fill("3");
  await expect(page.getByTestId("blank-count")).toHaveText("0 blanks");
});

test("rough-out calculator: default inputs render a wall-thickness result", async ({ page }) => {
  await page.goto("/rough-out-drying-calculator");
  await expect(page.getByTestId("wall-thickness")).toContainText("1in rough wall");
  await expect(page.getByTestId("drying-range")).toBeVisible();
});

test("rough-out calculator: switching species changes the warp note", async ({ page }) => {
  await page.goto("/rough-out-drying-calculator");
  await page.getByTestId("species-select").selectOption("American Beech");
  await expect(page.getByTestId("rough-out-result")).toContainText("American Beech");
});

test("rough-out calculator: zero bowl diameter shows an error, not a crash", async ({ page }) => {
  await page.goto("/rough-out-drying-calculator");
  await page.getByTestId("bowl-diameter").fill("0");
  await expect(page.getByTestId("rough-out-result")).toContainText("greater than zero");
});

test("species reference: shows the sourced reference table", async ({ page }) => {
  await page.goto("/turning-wood-reference");
  await expect(page.getByTestId("species-chart")).toContainText("Black Walnut");
  await expect(page.getByTestId("species-chart")).toContainText("Shagbark Hickory");
});
