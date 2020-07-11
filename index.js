const puppeteer = require('puppeteer');
const yaml = require('yaml');
const fs = require('fs');


const scrapper = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const script = yamlParser('./script.yaml').script;
    await page.goto(script.url);
    for (const element of script.input) {
        await page.type('input[' + element.type + '="' + element.value + '"]', element.content);
    }
    page.on('response', response => {
        if(response.request()._method === 'POST') {
            console.log('Response status: ' + response._status)
        }
    });
    await page.$eval(script.form, form => form.submit());
    await browser.close();
}

const yamlParser = (path) => {
    const file = fs.readFileSync(path, 'utf8')
    return yaml.parse(file);
}

scrapper();