import { $ } from '@wdio/globals';

class SignupLoginPage {
  get newUserSignupHeader() { return $('.signup-form h2'); }
  get signupNameInput() { return $('[data-qa="signup-name"]'); }
  get signupEmailInput() { return $('[data-qa="signup-email"]'); }
  get signupButton() { return $('[data-qa="signup-button"]'); }
}

export default new SignupLoginPage();
