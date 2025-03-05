describe('Sample Test', function() {
    it('should have the correct title', async function() {
        await browser.url('https://www.automationexercise.com/');
        await expect(browser).toHaveTitle('Automation Exercise');
    });
});

