import { $ } from "@wdio/globals";

class ConsentScreen {

    /* Landing page */

    get consentButton() { return $('button[aria-label="Consent"]'); }

    get manageOptionsButton() { return $('button[aria-label="Manage options"]'); }

    get learnMoreToggle() { return $('div.fc-faq-icon'); }

    get vendorsListLink() { return $('a.fc-vendors-list-dialog'); }

    get closeVendorsListButton() { return $('button.fc-help-dialog-close-button'); }


    /* Main controls of Manage Options page */

    get backButton() { return $('button[aria-label="Back"]'); }

    get acceptAllButton() { return $('button[aria-label="Accept all"]'); }

    get confirmChoicesButton() { return $('button[aria-label="Confirm choices"]'); }


    /* TFC vendors */
    get tcfVendorsLink() { return $('div.fc-preference-divider button.fc-help-tip'); }

    get vendorPreferencesButton() { return $('button[aria-label="Vendor preferences"]'); }


    /* Consent sliders */
    /**
     * @param {number} id
     */
    getConsentSliderById(id) { return $(`input.fc-preference-consent.purpose[data-id="${id}"] + span.fc-slider-el`); }


    /* Legitimate Interest sliders */
    /**
     * @param {number} id
     */
    getLegitimateInterestSliderById(id) { return $(`input.fc-preference-legitimate-interest.purpose[data-id="${id}"] + span.fc-slider-el`); }


    /* View Details */
    getViewDetailsButtonByPurposeId(id) { return $(`a.fc-purpose-feature-more-info[data-purpose-id="${id}"]`); }

    getViewDetailsButtonByFeatureId(id) { return $(`a.fc-purpose-feature-more-info[data-feature-id="${id}"]`); }

    getViewDetailsButtonBySpecialPurposeId(id) { return $(`a.fc-purpose-feature-more-info[data-special-purpose-id="${id}"]`); }

    get closeDetailsButton() { return $('p.fc-help-dialog-close-button-label'); }

}

export default new ConsentScreen();

