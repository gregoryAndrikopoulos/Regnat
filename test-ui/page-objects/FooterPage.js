import { $, expect } from "@wdio/globals";

class FooterPage {
  get root() {
    return $("#footer");
  }

  get subscriptionHeader() {
    return this.root.$("h2=Subscription");
  }

  get emailInput() {
    return this.root.$("#susbscribe_email"); // site typo
  }

  get subscribeButton() {
    return this.root.$("#subscribe");
  }

  get successAlert() {
    return this.root.$("#success-subscribe .alert-success");
  }

  async scrollIntoView() {
    await this.root.scrollIntoView();
  }

  async assertSubscriptionHeaderVisible() {
    await this.subscriptionHeader.waitForDisplayed();
    await expect(this.subscriptionHeader).toHaveText(/subscription/i);
  }

  async subscribe(email) {
    await this.emailInput.waitForDisplayed();
    await this.emailInput.setValue(email);
    await this.subscribeButton.click();
  }

  async assertSubscribedSuccess() {
    await this.successAlert.waitForDisplayed();
    await expect(this.successAlert).toHaveText(
      /You have been successfully subscribed!/i
    );
  }
}

export default new FooterPage();
