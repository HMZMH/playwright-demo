// Importing test and expect functions from the '@playwright/test' library
import { test, expect } from '@playwright/test';

// Defining a test setup function to run before each test
test.beforeEach(async ({ page }) => {
    // Navigating the browser page to a specific URL
    await page.goto('http://localhost:4200/');
    
    // Clicking on an element with the text 'Forms' on the page
    await page.getByText('Forms').click();
    
    // Clicking on an element with the text 'Form Layouts' on the page
    await page.getByText('Form Layouts').click();
});

test('Locator syntax rules', async({page}) => {

    // Tag name
    page.locator('#inputEmail1')

    // Class value
    page.locator('.shape-rectangle')

    // Attribute
    page.locator('[placeholder="Email1"]')

    // Full class value
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

    // Combine different selectors
    page.locator('input[placeholder="Email"] [nbinput]')

    // XPath (not recommended)
    page.locator('//*[@id="inputEmail1"]')

    // Partial text match
    page.locator(':text("Using")')

    // Exact text match
    page.locator(':test-is("Using the grid")')

})


test('User facing locators', async({page}) => {

    await page.getByRole('textbox', {name: "Email"}).first().click()
    await page.getByRole('button', {name: "Sign in"}).first().click()

    await page.getByLabel('Email').first().click()

    await page.getByPlaceholder('Jane Doe').click()

    await page.getByText('Using the Grid').click()

    await page.getByTestId('Sign in').click()

    await page.getByTitle('IoT Dashboard').click()

})


test('locating child elements', async({page}) => {

    await page.locator('nb-card nb-radio :text-is("Option 1")').click()
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()
    
    await page.locator('nb-card').getByRole('button', {name: "Sign in"}).first().click()

    await page.locator('nb-card').nth(3).getByRole('button').click()

})


test('locating parent elements', async({page}) => {

    await page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"}).click()
    await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('textbox', {name: "Email"}).click()

    await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('textbox', {name: "Email"}).click()
    await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: "Password"}).click()

    await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: "Sign in"}).getByRole('textbox', {name: "Email"}).click()

    await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', {name: "Emaail"}).click()
})


test('Reusing the locators', async({page}) => {

    const basicForm = page.locator('nb-card').filter({hasText: "Basic Form"})
    const emailField = basicForm.getByRole('textbox', {name: "Email"})

    await emailField.fill('test@test.com')
    await basicForm.getByRole('textbox', {name: "Password"}).fill('Welcome123')
    await basicForm.locator('nb-checkbox').click()
    await basicForm.getByRole('button').click()

    await expect(emailField).toHaveValue('test@test.com')

})


test('extracting values', async({page}) => {

    // Single test value
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const buttonText = await basicForm.locator('button').textContent()
    expect(buttonText).toEqual('submit')

    // All text values
    const allRadioButtonsLabels = await page.locator('nb-radio').allTextContents()
    expect(allRadioButtonsLabels).toContain("Option 1")

    // Input value
    const emailField = basicForm.getByRole('textbox', {name: "Email"})
    await emailField.fill('test@test.com')
    const emailValue = await emailField.inputValue()
    expect(emailValue).toEqual('test@test.com')

    const placeholderValue = await emailField.getAttribute('placeholder')
    expect(placeholderValue).toEqual('Email')

})


test('assertions', async ({page}) => {
    const basicFormButton = page.locator('nb-card').filter({hasText: "Basic form"}).locator('button')

    // General assertions
    const value  = 5
    expect(value).toEqual(5)

    const text = await basicFormButton.textContent()
    expect(text).toEqual("Submit")

    // Locator assertion
    await expect(basicFormButton).toHaveText('Submit')

    // Soft assertion
    await expect.soft(basicFormButton).toHaveText('Submit')
    await basicFormButton.click()

})


/*
test.describe.only('suite1', () => {
    test.beforeEach(async({page}) => {
        await page.getByText('Charts').click()
    })

    test('the first test', async({page}) => {
        await page.getByText('Form Layouts').click()
    })

    test('navigate to datepicker page', async({page}) => {
        await page.getByText('Datepicker').click()
    })
})


test.describe('suite1', () => {
    test.beforeEach(async({page}) => {
        await page.getByText('Forms').click()
    })

    test('the first test1', async({page}) => {
        await page.getByText('Form Layouts').click()
    })

    test('navigate to datepicker page1', async({page}) => {
        await page.getByText('Datepicker').click()
    })
})
*/