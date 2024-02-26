import {test, expect} from '@playwright/test'
import { assert } from 'console'

test.beforeEach(async({page}) => {
    await page.goto('hhtp://localhost:4200/')
})

test.describe('Form Layouts page', () => {
    test.beforeEach( async({page}) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })

    // Input fields
    test('input fields', async({page}) => {
        const usingTheGridEmailInput = page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"})

        await usingTheGridEmailInput.fill('test@test.com') // 'fill' is used to enter text into a field
        await usingTheGridEmailInput.clear() // 'clear' is used to clear the input field
        await usingTheGridEmailInput.pressSequentially('test2@test.com', {delay: 500}) // 'pressSequentially' is used to simulate key strokes

        // Generic assertion
        // const inputValue = await usingTheGridEmailInput.inputValue()
        // expect(inputValue).toEqual('test2@test.com')

        // Locator Assertion
        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com')
    })

    // Lists and dropdowns
    test('lists and dropdwons', async({page}) => {
        const dropDownMenu = page.locator('ngx-header nb-select')
        await dropDownMenu.click()

        page.getByRole('list') // Used when the list has a UL tag
        page.getByRole('listitem') // Used when the list has an LI tag

        const optionList = page.locator('nb-option-list nb-option')
        await expect(optionList).toHaveText(["Dark", "Light", "Cosmic"]) // 'toHaveText' is used for assertion
        await optionList.filter({hasText: "Light"}).click() // 'filter' is used for selecting a list item

        const colors = {
            "Dark": "rgb(34, 43, 69)", "Light": "rgb(255, 255, 255)", "Cosmic": "rgb(50, 50, 89)"
        }

        const header = page.locator('nb-layout-header')
        await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89')

        await dropDownMenu.click()
        for(const color in colors){
            await optionList.filter({hasText: color}).click()
            await expect(header).toHaveCSS('background-color', color[color])
            if (color != "Cosmic")
                await dropDownMenu.click()
        }
    })

    // Trimmed version of lists
    test('selecting items from list and dropdown', async ({ page }) => {
        const dropDownMenu = page.locator('ngx-header nb-select') // Locate the dropdown menu element
        await dropDownMenu.click() // Click on the dropdown menu to open it
    
        const optionList = page.locator('nb-option-list nb-option') // Locate the list of options in the dropdown menu
    
        // Assert that the option list contains specific text values: "Dark", "Light", and "Cosmic"
        await expect(optionList).toHaveText(["Dark", "Light", "Cosmic"])
    
        const optionsToSelect = ["Dark", "Light", "Cosmic"] // Define an array with options to select
        
        for (const option of optionsToSelect) { // Loop through each option and select it
            await optionList.filter({ hasText: option }).click() // Filter and click on the option
        }
    })      
    

    // Radio buttons
    test('radio buttons', async({page}) => {
        const usingTheGridForm = page.locator('nb-card', {hasText: "Using the Grid"})

        // await usingTheGridForm.getByLabel('Option 1').check({force: true})
        await usingTheGridForm.getByRole('radio', {name: "Option 1"}).check({force:true})
        const radioStatus = await usingTheGridForm.getByRole('radio', {name: "Option 1"}).isChecked()
        expect(radioStatus).toBeTruthy()
        await expect (usingTheGridForm.getByRole('radio', {name: "Option 1"})).toBeChecked

        await usingTheGridForm.getByRole('radio', {name: "Option 2"}).check({force: true})
        expect(await usingTheGridForm.getByRole('radio', {name: "Option 1"}).isChecked()).toBeFalsy()
        expect(await usingTheGridForm.getByRole('radio', {name: "Option 2"}).isChecked()).toBeTruthy()
    })

    // Checkboxes
    test('checkboxes', async({page}) => {

        await page.getByText('Modal & Overlays').click()
        await page.getByText('Toastr').click()

        await page.getByRole('checkbox', {name: "Hide on click"}).uncheck({force: true})
        await page.getByRole('checkbox', {name: "Prevent arising of duplicate toast"}).check({force: true})

        const allBoxes = page.getByRole('checkbox')
        for (const box of await allBoxes.all()){
            await box.uncheck({force: true})
            expect(await box.isChecked()).toBeFalsy()
        }
    })

    // Web tables
    test('web tables', async({page}) => {
        await page.getByText('Tables & Data').click()
        await page.getByText('Smart Table').click()

        // 1 get the row by any test in this row
        const targetRow = page.getByRole('row', {name: "twitter@outlook.com"})
        await targetRow.locator('.nb-edit').click()
        await page.locator('input-editor').getByPlaceholder('Age').clear()
        await page.locator('input-editor').getByPlaceholder('Age').fill('35')
        await page.locator('.nb-checkmark').click()

        // 2 get the row based on the value in a specific column
        await page.locator('.ng2-smart-pagination-nav').getByText('2').click()
        const targetRowById = page.getByRole('row', {name: "11"}).filter({has: page.locator('td').nth(1).getByText('11')})
        await targetRowById.locator('.nbedit').click()
        await page.locator('input editor').getByPlaceholder('E-mail').clear()
        await page.locator('input editor').getByPlaceholder('E-mail').fill('test@test.com')
        await page.locator('.nb-checkmark').click()
        await expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com')

        // 3 test filter of the table

        const ages = ["20", "30", "40", "200"]

        for (let age of ages){
            await page.locator('input-filter').getByPlaceholder('Age').clear()
            await page.locator('input-filter').getByPlaceholder('Age').fill(age)
            await page.waitForTimeout(500)
            const ageRows = page.locator('tbody tr')

            for (let row of await ageRows.all()){
                const cellValue = await row.locator('td').last().textContent()

                if(age=="200"){
                    expect(await page.getByRole('table').textContent()).toContain('No data found')
                } else {
                    expect(cellValue).toEqual(age)
                }
            }
        }
    })

})