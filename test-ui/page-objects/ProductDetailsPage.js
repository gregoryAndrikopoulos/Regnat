import { expect } from "@wdio/globals";

class ProductDetailsPage {
  get container() {
    return $(".product-details");
  }
  get title() {
    return $(".product-information h2");
  }
  get price() {
    return $(".product-information span > span");
  }

  async assertOnDetailsPage() {
    await this.container.waitForDisplayed();

    await browser.waitUntil(
      async () => (await browser.getUrl()).includes("/product_details"),
      {
        timeoutMsg: "URL did not include /product_details",
      }
    );
  }

  async assertBasicDetailsVisible() {
    await expect(this.title).toBeDisplayed();
    await expect(this.title).not.toHaveText("");

    await expect(this.price).toBeDisplayed();
    await expect(this.price).toHaveText(/Rs\.?\s*\d+/);

    const paragraphs = await $$(".product-information p");
    const texts = [];
    for (const el of paragraphs) {
      texts.push(await el.getText());
    }

    expect(texts.some((t) => /Category:/i.test(t))).toBe(true);
    expect(texts.some((t) => /Availability:/i.test(t))).toBe(true);
    expect(texts.some((t) => /Condition:/i.test(t))).toBe(true);
    expect(texts.some((t) => /Brand:/i.test(t))).toBe(true);
  }
}

export default new ProductDetailsPage();
