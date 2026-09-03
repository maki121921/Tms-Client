import { test as setup, expect } from "@playwright/test";

setup("authenticate as admin", async ({ page }) => {
  const email = process.env["TMS_ADMIN_EMAIL"];
  const password = process.env["TMS_ADMIN_PASSWORD"];

  if (!email || !password) {
    throw new Error("Missing TMS_ADMIN_EMAIL or TMS_ADMIN_PASSWORD in .env");
  }

  page.on("request", request => {
    if (request.url().includes("/api/")) {
      console.log("REQUEST:", request.method(), request.url());
    }
  });

  page.on("response", async response => {
    if (response.url().includes("/api/")) {
      console.log("RESPONSE:", response.status(), response.url());

      if (response.url().includes("/auth/login")) {
        console.log("LOGIN RESPONSE BODY:", await response.text());
      }
    }
  });

  page.on("console", message => {
    console.log("BROWSER:", message.type(), message.text());
  });

  page.on("pageerror", error => {
    console.log("PAGE ERROR:", error.message);
  });

  await page.goto("/login");

  console.log("BEFORE LOGIN URL:", page.url());

  await page.getByLabel(/email|username/i).fill(email);
  await page.getByLabel("Password").fill(password);

  await page.getByRole("button", { name: "Sign In" }).click();

  // Wait for successful navigation instead of relying only on a timeout
  await expect(page).toHaveURL(/instructor-dashboard/, {
    timeout: 10000,
  });
  await expect(
  page.getByText(/Instructor Command Center/i)
).toBeVisible();

  console.log("AFTER LOGIN URL:", page.url());

  console.log("PAGE CONTENT:");
  console.log(await page.locator("body").innerText());

  // IMPORTANT: save authenticated browser state
  await page.context().storageState({
    path: "playwright/.auth/admin.json",
  });

  console.log("AUTH STATE SAVED: playwright/.auth/admin.json");
});