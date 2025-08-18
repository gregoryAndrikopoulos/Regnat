import { $ } from "@wdio/globals";

class RegistrationPage {
  get formRoot() {
    return $(".login-form");
  }
  get enterAccountInfoHeader() {
    return this.formRoot.$("h2=Enter Account Information");
  }
  get addressInfoHeader() {
    return this.formRoot.$("h2=Address Information");
  }
  get titleMrLabel() {
    return $('label[for="id_gender1"]');
  }
  get titleMrsLabel() {
    return $('label[for="id_gender2"]');
  }
  get nameInput() {
    return $('[data-qa="name"]');
  }
  get emailInput() {
    return $('[data-qa="email"]');
  }
  get passwordInput() {
    return $('[data-qa="password"]');
  }
  get daysDropdown() {
    return $('[data-qa="days"]');
  }
  get monthsDropdown() {
    return $('[data-qa="months"]');
  }
  get yearsDropdown() {
    return $('[data-qa="years"]');
  }
  get newsletterCheckbox() {
    return $("#newsletter");
  }
  get newsletterLabel() {
    return $('label[for="newsletter"]');
  }
  get offersCheckbox() {
    return $("#optin");
  }
  get offersLabel() {
    return $('label[for="optin"]');
  }
  get firstNameInput() {
    return $('[data-qa="first_name"]');
  }
  get lastNameInput() {
    return $('[data-qa="last_name"]');
  }
  get companyInput() {
    return $('[data-qa="company"]');
  }
  get addressInput() {
    return $('[data-qa="address"]');
  }
  get address2Input() {
    return $('[data-qa="address2"]');
  }
  get countryDropdown() {
    return $('[data-qa="country"]');
  }
  get stateInput() {
    return $('[data-qa="state"]');
  }
  get cityInput() {
    return $('[data-qa="city"]');
  }
  get zipcodeInput() {
    return $('[data-qa="zipcode"]');
  }
  get mobileNumberInput() {
    return $('[data-qa="mobile_number"]');
  }
  get createAccountButton() {
    return $('[data-qa="create-account"]');
  }

  async selectTitle(title = "Mr") {
    if (title === "Mr") await this.titleMrLabel.click();
    if (title === "Mrs") await this.titleMrsLabel.click();
  }

  async setPasswordAndDob({ password, day, month, year }) {
    await this.passwordInput.setValue(password);
    await this.daysDropdown.selectByAttribute("value", String(day));
    if (/^\d+$/.test(String(month))) {
      await this.monthsDropdown.selectByAttribute("value", String(month));
    } else {
      await this.monthsDropdown.selectByVisibleText(String(month));
    }
    await this.yearsDropdown.selectByAttribute("value", String(year));
  }

  async setPreferenceToggles({ newsletter, offers }) {
    const nl = await this.newsletterCheckbox.isSelected();
    if (newsletter !== undefined && newsletter !== nl)
      await this.newsletterLabel.click();

    const of = await this.offersCheckbox.isSelected();
    if (offers !== undefined && offers !== of) await this.offersLabel.click();
  }

  async fillAddressInfo({
    firstName,
    lastName,
    company,
    address,
    address2,
    country,
    state,
    city,
    zipcode,
    mobile,
  }) {
    await this.firstNameInput.setValue(firstName);
    await this.lastNameInput.setValue(lastName);
    if (company) await this.companyInput.setValue(company);
    await this.addressInput.setValue(address);
    if (address2) await this.address2Input.setValue(address2);
    await this.countryDropdown.selectByVisibleText(country);
    await this.stateInput.setValue(state);
    await this.cityInput.setValue(city);
    await this.zipcodeInput.setValue(zipcode);
    await this.mobileNumberInput.setValue(mobile);
  }

  async submit() {
    await this.createAccountButton.click();
  }
}

export default new RegistrationPage();
