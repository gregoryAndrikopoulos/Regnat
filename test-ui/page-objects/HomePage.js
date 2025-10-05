import { $, expect } from "@wdio/globals";
import { HOMEPAGE_LINK } from "../../test-support/utils/testConstants.js";

class HomePage {
  get logo() {
    return $('header .logo img[alt="Website for automation practice"]');
  }
  get homeMenuLink() {
    return $('header .nav a[href="/"]');
  }
  get productsMenuLink() {
    return $('header .nav a[href="/products"]');
  }
  get cartMenuLink() {
    return $('header .nav a[href="/view_cart"]');
  }
  get signupLoginLink() {
    return $('header .nav a[href="/login"]');
  }
  get testCasesMenuLink() {
    return $('header .nav a[href="/test_cases"]');
  }
  get apiTestingMenuLink() {
    return $('header .nav a[href="/api_list"]');
  }
  get videoTutorialsMenuLink() {
    return $('header .nav a[href*="youtube.com"][href*="AutomationExercise"]');
  }
  get contactUsMenuLink() {
    return $('header .nav a[href="/contact_us"]');
  }
  get deleteAccountMenuLink() {
    return $('header .nav a[href="/delete_account"]');
  }
  get logoutMenuLink() {
    return $('header .nav a[href="/logout"]');
  }
  get loggedInBanner() {
    return $("header*=Logged in as");
  }
  get loggedInUsername() {
    return this.loggedInBanner.$("b");
  }
  get homeNavActive() {
    return $('header .shop-menu a[href="/"][style*="color: orange"]');
  }
  get heroCarousel() {
    return $("#slider-carousel");
  }
  get homeMarker() {
    return $(".features_items .title.text-center");
  }
  get featuresTitle() {
    return $(".features_items h2.title");
  }
  get categoryTitle() {
    return $(".left-sidebar > h2");
  }
  get brandsTitle() {
    return $(".brands_products h2");
  }
  get recommendedItemsTitle() {
    return $(".recommended_items h2.title");
  }
  get continueButton() {
    return $('[data-qa="continue-button"]');
  }
  get firstHomeViewProductLink() {
    return $('.features_items .choose a[href^="/product_details/"]');
  }
  get blueTopAddToCartBtn() {
    return $('a.add-to-cart[data-product-id="1"]');
  }
  get addedModalRoot() {
    return $(".modal-content");
  }
  get viewCartInAddedModalLink() {
    return $('.modal-content a[href="/view_cart"]');
  }

  async viewFirstProductFromHome() {
    const link = await this.firstHomeViewProductLink;
    await link.scrollIntoView();
    await link.click();

    await browser.waitUntil(
      async () => (await browser.getUrl()).includes("/product_details"),
      { timeoutMsg: "Did not navigate to product details from home" }
    );
  }

  async commonHomePageAssertions() {
    await expect(browser).toHaveUrl(HOMEPAGE_LINK);
    await expect(this.logo).toBeDisplayed();
    await expect(this.homeMenuLink).toBeDisplayed();
    await expect(this.productsMenuLink).toBeDisplayed();
    await expect(this.cartMenuLink).toBeDisplayed();
    await expect(this.testCasesMenuLink).toBeDisplayed();
    await expect(this.apiTestingMenuLink).toBeDisplayed();
    await expect(this.videoTutorialsMenuLink).toBeDisplayed();
    await expect(this.contactUsMenuLink).toBeDisplayed();
    await expect(this.homeNavActive).toBeDisplayed();
    await expect(this.homeMarker).toBeDisplayed();
    await expect(this.heroCarousel).toBeDisplayed();
    await expect(this.featuresTitle).toBeDisplayed();
    await expect(this.featuresTitle).toHaveText(/Features Items/i);
    await expect(this.categoryTitle).toBeDisplayed();
    await expect(this.categoryTitle).toHaveText(/Category/i);
    await expect(this.brandsTitle).toBeDisplayed();
    await expect(this.brandsTitle).toHaveText(/Brands/i);
    await expect(this.recommendedItemsTitle).toBeDisplayed();
    await expect(this.recommendedItemsTitle).toHaveText(/Recommended Items/i);
  }

  async assertHomePageVisible() {
    await this.commonHomePageAssertions();
    await expect(this.signupLoginLink).toBeDisplayed();
  }

  async assertHomePageVisiblePostLogin() {
    await this.commonHomePageAssertions();
  }

  async addBlueTopFromHome() {
    await this.blueTopAddToCartBtn.scrollIntoView();
    await this.blueTopAddToCartBtn.click();
  }

  async clickViewCartInAddedModal() {
    await this.addedModalRoot.waitForDisplayed({ timeout: 10000 });
    await this.viewCartInAddedModalLink.click();
    await browser.waitUntil(
      async () => (await browser.getUrl()).includes("/view_cart"),
      {
        timeout: 10000,
        timeoutMsg: "Did not navigate to /view_cart from modal",
      }
    );
  }
}

export default new HomePage();
