import { test, expect } from "@playwright/test";

test("admin approves a pending enrollment", async ({ page }) => {
  await page.goto("/enrollments");

  await expect(
    page.getByRole("heading", {
      name: "Enrollment Records",
    })
  ).toBeVisible();

  const firstApprove = page
    .getByRole("button", { name: "Approve" })
    .first();

  await expect(firstApprove).toBeVisible();

  await firstApprove.click();

  await expect(
    page.getByText("Approved").first()
  ).toBeVisible();
});