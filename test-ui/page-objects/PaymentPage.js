import { $, expect } from "@wdio/globals";

class PaymentPage {
  get paymentHeading() {
    return $('//h2[normalize-space()="Payment"]');
  }
  get formRoot() {
    return $("#payment-form");
  }
  get nameOnCard() {
    return $('[data-qa="name-on-card"]');
  }
  get cardNumber() {
    return $('[data-qa="card-number"]');
  }
  get cvc() {
    return $('[data-qa="cvc"]');
  }
  get expiryMonth() {
    return $('[data-qa="expiry-month"]');
  }
  get expiryYear() {
    return $('[data-qa="expiry-year"]');
  }
  get payButton() {
    return $('[data-qa="pay-button"]');
  }
  get successAlert() {
    return $("#success_message .alert-success");
  }
  get orderPlacedHeader() {
    return $('[data-qa="order-placed"]');
  }
  get orderCongratsText() {
    return $('//p[contains(normalize-space(),"Congratulations!")]');
  }
  get downloadInvoice() {
    return $('a[href^="/download_invoice"]');
  }
  get continueAfterOrder() {
    return $('[data-qa="continue-button"]');
  }

  async assertOnPaymentPage() {
    await this.paymentHeading.waitForDisplayed();
    await expect(this.formRoot).toBeDisplayed();
    await expect(this.payButton).toBeDisplayed();
  }

  async payAndConfirm({
    name = "Test User",
    number = "4111111111111111",
    cvc = "123",
    expiryMonth = "12",
    expiryYear = "2026",
  } = {}) {
    await this.assertOnPaymentPage();

    await this.nameOnCard.setValue(name);
    await this.cardNumber.setValue(number);
    await this.cvc.setValue(cvc);
    await this.expiryMonth.setValue(expiryMonth);
    await this.expiryYear.setValue(expiryYear);

    await this.payButton.click();
  }

  async assertOrderSuccess() {
    await browser.waitUntil(
      async () => {
        const newOk =
          (await this.orderPlacedHeader.isExisting()) &&
          (await this.orderPlacedHeader.isDisplayed());
        const oldOk =
          (await this.successAlert.isExisting()) &&
          (await this.successAlert.isDisplayed());
        return newOk || oldOk;
      },
      { timeout: 10000, timeoutMsg: "Order success UI did not appear" }
    );

    if (await this.orderPlacedHeader.isDisplayed()) {
      await expect(this.orderPlacedHeader).toHaveText("ORDER PLACED!");
      await expect(this.orderCongratsText).toBeDisplayed();
      await expect(this.downloadInvoice).toBeDisplayed();
      await expect(this.continueAfterOrder).toBeDisplayed();
    }
  }
}

export default new PaymentPage();
