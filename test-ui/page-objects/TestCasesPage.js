import { expect } from "@wdio/globals";

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
    await this.header.waitForDisplayed();
    await expect(this.header).toBeDisplayed();
    await this.practiceNote.waitForDisplayed();

    await this.panelGroup.waitForExist();

    await browser.waitUntil(
      async () => (await browser.getUrl()).includes("/test_cases"),
      { timeoutMsg: "URL did not include /test_cases" }
    );
  }
}

export default new TestCasesPage();
