import { expect } from "@wdio/globals";

class CheckoutPage {
  get commentTextarea() {
    return $('textarea[name="message"]');
  }
  get placeOrderButton() {
    return $(
      '//a[contains(@class,"check_out") and contains(normalize-space(.),"Place Order")]'
    );
  }
  get addressSection() {
    return $('[data-qa="checkout-info"]');
  }
  get reviewSection() {
    return $("#cart_info table");
  }

  async assertAddressAndReviewVisible() {
    await this.addressSection.waitForDisplayed();
    await expect(this.reviewSection).toBeDisplayed();
  }

  async placeOrder(comment) {
    await this.commentTextarea.setValue(comment);
    await this.placeOrderButton.click();
  }
}

export default new CheckoutPage();
