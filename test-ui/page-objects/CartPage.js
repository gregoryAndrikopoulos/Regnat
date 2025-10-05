import { $, $$, expect } from "@wdio/globals";

function parseRs(text) {
  return Number(String(text).replace(/[^\d]/g, ""));
}

class CartPage {
  get root() {
    return $("#cart_items");
  }
  get rows() {
    return $$('#cart_info_table tbody tr[id^="product-"]');
  }
  get table() {
    return $("#cart_info_table");
  }
  get proceedToCheckoutButton() {
    return $("a.btn.btn-default.check_out");
  }
  get checkoutModal() {
    return $("#checkoutModal .modal-content");
  }
  get breadcrumbActive() {
    return $(".breadcrumb .active");
  }
  get cartTable() {
    return $("#cart_info_table");
  }
  get emptyCartNotice() {
    return $("#empty_cart");
  }
  get proceedToCheckoutBtn() {
    return $("#do_action .check_out");
  }
  get cartUrl() {
    return "https://www.automationexercise.com/view_cart";
  }

  async isEmpty() {
    return await this.emptyCartNotice.isDisplayed().catch(() => false);
  }

  async clickProceedToCheckout() {
    if (await this.isEmpty()) {
      throw new Error("Cannot proceed to checkout: cart is empty.");
    }

    await this.proceedToCheckoutButton.scrollIntoView();
    await this.proceedToCheckoutButton.click();

    const modalVisible = await this.checkoutModal
      .waitForDisplayed({ timeout: 2000 })
      .then(() => true)
      .catch(() => false);

    if (!modalVisible) {
      await browser.waitUntil(
        async () => (await browser.getUrl()).includes("/checkout"),
        { timeoutMsg: "Did not navigate to /checkout after proceeding" }
      );
    }
  }

  async getItems() {
    await this.root.waitForDisplayed();
    const rows = await this.rows;
    const items = [];
    for (const r of rows) {
      const idAttr = await r.getAttribute("id");
      const productId = Number(idAttr.replace(/[^\d]/g, ""));
      const name = await r.$(".cart_description h4 a").getText();
      const unitPrice = parseRs(await r.$(".cart_price p").getText());
      const quantity = Number(await r.$(".cart_quantity button").getText());
      const lineTotal = parseRs(
        await r.$(".cart_total .cart_total_price").getText()
      );
      items.push({ productId, name, unitPrice, quantity, lineTotal });
    }
    return items;
  }

  async assertItemsCount(expected) {
    const items = await this.getItems();
    await expect(items.length).toBe(expected);
  }

  async assertContainsNames(expectedNames = []) {
    const items = await this.getItems();
    const actualNames = items.map((i) => i.name);
    for (const n of expectedNames) {
      await expect(actualNames).toContain(n);
    }
  }

  async assertExpectedDetails(expected = []) {
    const items = await this.getItems();
    const byName = new Map(items.map((i) => [i.name, i]));
    for (const e of expected) {
      const row = byName.get(e.name);
      if (!row) throw new Error(`Cart missing expected product "${e.name}"`);
      await expect(row.unitPrice).toBe(e.price);
      await expect(row.quantity).toBe(e.qty);
      await expect(row.lineTotal).toBe(e.total);
      await expect(row.unitPrice * row.quantity).toBe(row.lineTotal);
    }
  }

  async assertQuantityForName(name, expectedQty) {
    const items = await this.getItems();
    const row = items.find((i) => i.name === name);
    if (!row) throw new Error(`Cart missing expected product "${name}"`);
    await expect(row.quantity).toBe(expectedQty);
  }

  async assertCartPageVisible() {
    await this.root.waitForDisplayed();
    await expect(browser).toHaveUrl(this.cartUrl);

    await expect(this.breadcrumbActive).toBeDisplayed();
    await expect(this.breadcrumbActive).toHaveText(/Shopping Cart/i);

    const tableVisible = await this.cartTable.isDisplayed().catch(() => false);
    const rowCount = tableVisible ? (await this.rows).length : 0;
    const emptyVisible = await this.emptyCartNotice
      .isDisplayed()
      .catch(() => false);

    await expect(emptyVisible || (tableVisible && rowCount > 0)).toBe(true);

    if (!emptyVisible) {
      await expect(this.proceedToCheckoutBtn).toBeDisplayed();
    }
  }

  async removeFirstItem() {
    const rows = await this.rows;
    if (rows.length === 0) throw new Error("Cart is already empty.");
    const firstRow = rows[0];
    const deleteBtn = await firstRow.$(".cart_delete .cart_quantity_delete");
    await deleteBtn.scrollIntoView();
    await deleteBtn.click();
    await firstRow.waitForExist({ reverse: true, timeout: 10000 });
  }

  async assertCartEmpty() {
    await browser.waitUntil(
      async () =>
        (await this.rows).length === 0 ||
        (await this.emptyCartNotice.isDisplayed().catch(() => false)),
      { timeout: 10000, timeoutMsg: "Cart did not become empty." }
    );
    if (await this.emptyCartNotice.isExisting()) {
      await expect(this.emptyCartNotice).toBeDisplayed();
    }
  }
}

export default new CartPage();
