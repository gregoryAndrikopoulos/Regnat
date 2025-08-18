import { SHORT_TIMEOUT } from "../support/utils/testConstants.js";

class ProductsPage {
  get allProductsHeader() {
    return $("h2.title.text-center");
  }
  get productCards() {
    return $$(".col-sm-4 .product-image-wrapper");
  }
  get firstViewProductLink() {
    return $('.col-sm-4 .choose a[href^="/product_details/"]');
  }
  get searchInput() {
    return $("#search_product");
  }
  get searchButton() {
    return $("#submit_search");
  }
  get resultsHeader() {
    return $("h2.title.text-center");
  }
  get searchedProductsHeader() {
    return $(
      `//h2[contains(@class,"title") and normalize-space()="Searched Products"]`
    );
  }

  async assertAllProductsVisible() {
    await this.allProductsHeader.waitForDisplayed({ timeout: SHORT_TIMEOUT });
    await expect(this.allProductsHeader).toHaveText(/All Products/i);
    await expect(this.productCards).toBeElementsArrayOfSize({ gte: 1 });
    await expect(this.productCards[0]).toBeDisplayed();

    await browser.waitUntil(
      async () => (await browser.getUrl()).includes("/products"),
      { timeout: SHORT_TIMEOUT, timeoutMsg: "URL did not include /products" }
    );
  }

  async viewFirstProduct() {
    const link = await this.firstViewProductLink;
    await link.scrollIntoView();
    await link.click();

    await browser.waitUntil(
      async () => (await browser.getUrl()).includes("/product_details"),
      {
        timeout: SHORT_TIMEOUT,
        timeoutMsg: "Did not navigate to product details",
      }
    );
  }

  async searchFor(term) {
    await this.searchInput.waitForDisplayed({ timeout: SHORT_TIMEOUT });
    await this.searchInput.setValue(term);
    await this.searchButton.click();

    await browser.waitUntil(
      async () =>
        (await this.resultsHeader.getText()).match(/Searched Products/i),
      {
        timeout: SHORT_TIMEOUT,
        timeoutMsg: 'Results header did not change to "Searched Products"',
      }
    );
  }

  async assertSearchedProductsVisible() {
    await this.searchedProductsHeader.waitForDisplayed({
      timeout: SHORT_TIMEOUT,
    });
    await expect(this.searchedProductsHeader).toHaveText(/Searched Products/i);

    await browser.waitUntil(async () => (await this.productCards).length > 0, {
      timeout: SHORT_TIMEOUT,
      timeoutMsg: "No product cards found after search",
    });
    await expect((await this.productCards)[0]).toBeDisplayed();
  }

  normalize(text) {
    return (text || "")
      .replace(/&amp;/g, "&") // decode "&amp;"
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  async getCardTitle(card) {
    const overlayTitle = await card.$(".product-overlay .overlay-content p");
    const regularTitle = await card.$(".single-products .productinfo p");

    let text = "";
    if (await overlayTitle.isExisting()) text = await overlayTitle.getText();
    if (!text && (await regularTitle.isExisting()))
      text = await regularTitle.getText();
    return this.normalize(text);
  }

  /**
   * Assert that every result matches a *prefix token* rule derived from the search term.
   *  - Split normalized term into tokens
   *  - Ignore tokens < 3 chars to avoid noise (e.g., "dr" alone)
   *  - For each result title, EVERY token must be a prefix of SOME word in the title
   *    (e.g., "sleeveless dr" → "sleeveless" matches "sleeveless", "dr" matches "dress").
   */
  async assertAllResultsContainTerm(term) {
    const tokens = this.normalize(term)
      .split(/\s+/)
      .filter((t) => t.length >= 3); // ignore very short noise like "dr" if mixed with others

    const cards = await this.productCards;
    const failures = [];

    for (const card of cards) {
      const title = await this.getCardTitle(card); // already normalized
      const words = title.split(/\s+/);

      // Every token must be a prefix of at least one title word
      const ok = tokens.every((tok) => words.some((w) => w.startsWith(tok)));

      if (!ok) {
        const missing = tokens.filter(
          (tok) => !words.some((w) => w.startsWith(tok))
        );
        failures.push({ title, missing });
      }
    }

    if (failures.length) {
      const msg = failures
        .map(
          (f) => `Title: "${f.title}" | Missing tokens: ${f.missing.join(", ")}`
        )
        .join("\n");
      throw new Error(`Some results did not satisfy prefix matching:\n${msg}`);
    }

    await expect(failures.length === 0).toBe(true);
  }

  async getAllCardTitles() {
    const cards = await this.productCards;
    const titles = [];
    for (const c of cards) {
      titles.push(await this.getCardTitle(c)); // uses your existing getCardTitle + normalize
    }
    return titles;
  }

  async assertResultCountIs(expected) {
    await browser.waitUntil(
      async () => (await this.productCards).length === expected,
      {
        timeout: SHORT_TIMEOUT,
        timeoutMsg: `Expected ${expected} search results, got ${(await this.productCards).length}`,
      }
    );
    await expect((await this.productCards).length).toBe(expected);
  }

  async assertResultsTitlesInclude(expectedTitles = []) {
    const expected = expectedTitles.map((t) => this.normalize(t));
    const actual = await this.getAllCardTitles();

    // ensure counts match (no extras)
    await expect(actual.length).toBe(expected.length);

    // check every expected is present (order-insensitive)
    const missing = expected.filter((e) => !actual.includes(e));
    if (missing.length) {
      throw new Error(
        `Missing expected titles:\n${missing.join("\n")}\n\nActual:\n${actual.join("\n")}`
      );
    }
    await expect(missing.length === 0).toBe(true);
  }
}

export default new ProductsPage();
