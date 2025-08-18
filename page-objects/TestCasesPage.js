import { SHORT_TIMEOUT } from "../support/utils/testConstants.js";

class TestCasesPage {
  get header() {
    return $(".col-sm-9.col-sm-offset-1 > h2.title.text-center");
  }
  get practiceNote() {
    return $(".panel-group h5");
  }
  get panelGroup() {
    return $(".panel-group");
  }

  async assertLanded() {
    await this.header.waitForDisplayed({ timeout: SHORT_TIMEOUT });
    await expect(this.header).toBeDisplayed();
    await this.practiceNote.waitForDisplayed({ timeout: SHORT_TIMEOUT });

    await this.panelGroup.waitForExist({ timeout: SHORT_TIMEOUT });

    await browser.waitUntil(
      async () => (await browser.getUrl()).includes("/test_cases"),
      { timeout: SHORT_TIMEOUT, timeoutMsg: "URL did not include /test_cases" }
    );
  }
}

export default new TestCasesPage();
