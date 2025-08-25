import { expect } from "@wdio/globals";

class ContactUsPage {
  get getInTouchHeader() {
    return $('//h2[contains(.,"Get In Touch")]');
  }
  get nameInput() {
    return $('[data-qa="name"]');
  }
  get emailInput() {
    return $('[data-qa="email"]');
  }
  get subjectInput() {
    return $('[data-qa="subject"]');
  }
  get messageTextarea() {
    return $('[data-qa="message"]');
  }
  get uploadInput() {
    return $('input[name="upload_file"]');
  }
  get submitButton() {
    return $('[data-qa="submit-button"]');
  }
  get successAlert() {
    return $(".status.alert-success");
  }

  async fillForm({ name, email, subject, message }) {
    if (name !== undefined) await this.nameInput.setValue(name);
    if (email !== undefined) await this.emailInput.setValue(email);
    if (subject !== undefined) await this.subjectInput.setValue(subject);
    if (message !== undefined) await this.messageTextarea.setValue(message);
  }

  async submit() {
    await this.submitButton.click();
  }

  async attachFile(localPath) {
    const el = await this.uploadInput;
    await el.waitForExist();
    const remotePath = await browser.uploadFile(localPath);
    await el.setValue(remotePath);
  }

  async assertGetInTouchVisible() {
    await this.getInTouchHeader.waitForDisplayed();
    await expect(this.getInTouchHeader).toBeDisplayed();
  }
}

export default new ContactUsPage();
