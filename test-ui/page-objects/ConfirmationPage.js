import { $ } from "@wdio/globals";

class ConfirmationPage {
  get accountCreatedHeader() {
    return $('[data-qa="account-created"]');
  }
  get accountDeletedHeader() {
    return $('[data-qa="account-deleted"]');
  }
  get continueButton() {
    return $('[data-qa="continue-button"]');
  }
}

export default new ConfirmationPage();
