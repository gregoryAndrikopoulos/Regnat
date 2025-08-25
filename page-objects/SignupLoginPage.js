import { $ } from "@wdio/globals";

class SignupLoginPage {
  get newUserSignupHeader() {
    return $(".signup-form h2");
  }
  get signupNameInput() {
    return $('[data-qa="signup-name"]');
  }
  get signupEmailInput() {
    return $('[data-qa="signup-email"]');
  }
  get signupButton() {
    return $('[data-qa="signup-button"]');
  }
  get loginHeader() {
    return $(".login-form h2");
  }
  get loginEmailInput() {
    return $('[data-qa="login-email"]');
  }
  get loginPasswordInput() {
    return $('[data-qa="login-password"]');
  }
  get loginButton() {
    return $('[data-qa="login-button"]');
  }
  get signupEmailExistsError() {
    return $("p=Email Address already exist!");
  }
  get loginErrorMessage() {
    return $("p=Your email or password is incorrect!");
  }
}

export default new SignupLoginPage();
