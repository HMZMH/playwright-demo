import {test, expect} from '@playwright/test'

test.beforeEach(async({page}) => {
    await page.goto('http://uitestingplayground.com/ajax')
    await page.getByText('Button Triggering AJAX Request').click()
})

test('auto waiting', async({page}) => {
    const successButton = page.locator('.bg-success')

    // await successButton.click()

    // const text = await successButton.textContent()

    // const text = await successButton.allTextContents()

    // expect(text).toEqual('Data loaded with AJAX get request')

    await expect(successButton).toHaveText('Data loaded with AJAX get request.', {timeout: 20000})
})

test('alternative waits', async({page}) => {
    const successButton = page.locator('.bg-success')

    // ___ wait for element
    // await page.waitForSelector('.bg-success')

    // __ wait for particular response
    // await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

    // __ wait for network calls to be completed ('NOT RECOMMENDED')

    await page.waitForLoadState('networkidle')

    const text = await successButton.allTextContents()
    expect(text).toContain('Data loaded with AJAX get request.')
})

// Default timeout is 30 seconds
// Define timeouts in playwright.config.ts
test('timeouts', async ({page}) => {

    // test.setTimeout(10000)

    // test.slow()
    const successButton = page.locator('.bg-success')

    await successButton.click({timeout: 15000}) //timeouts with click() will override timeouts defined in playwright.config.ts

})