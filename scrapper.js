const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.goto('https://vrising.gaming.tools/recipes ', { waitUntil: 'networkidle2' });
    const recipeLinks = await page.$$eval('.grid a[href^="/recipes/"]', links => links.map(link => link.href));

    let count = 0
    const allRecipes = [];

    for (const link of recipeLinks) {
        try {
            await page.goto(link, { waitUntil: 'networkidle2' });

            const name = await page.$eval('.header-title', el => el.textContent.trim())
            const description = await page.$eval('.header-desc', el => el.textContent.trim())
            const workstations = await page.$$eval("::-p-text(Workstations) + thead + tbody tr", r=> r.map(el => ({
                id: el.querySelector('td:first-child a').href.split('/').pop(),
                name: el.querySelector('td:first-child a').textContent,
            })));
            const inputs = await page.$$eval("::-p-text(Requirements) + thead + tbody tr", r=> r.reduce((acc, el) => ({
                ...acc,
                [el.querySelector('td:first-child a').href.split('/').pop()]: Number(el.querySelector('td:nth-child(2)').textContent)
            }), {}));
            const outputs = await page.$$eval("::-p-text(Outputs) + thead + tbody tr", r=> r.map(el => ({
                rarity: el.querySelector('td:first-child a span').classList.values().find(x => x.startsWith('rarity-'))?.replace('rarity-', ''),
                id: el.querySelector('td:first-child a').href.split('/').pop(),
                name: el.querySelector('td:first-child a').textContent.trim(),
                output_qty: Number(el.querySelector('td:nth-child(2)').textContent)
            })));
            const output= outputs.find(x => x.name === name) ?? {}
            const local_image_path = await page.$eval('.tooltip-body img', el => 'images/items/' + el.src.split('/').pop())

            count++;
            console.log(`Обработано рецептов: ${count}/${recipeLinks.length}`);

            allRecipes.push({
                name,
                description,
                workstations,
                inputs,
                id: output.id,
                rarity: output.rarity,
                output_qty: output.output_qty,
                local_image_path
            });
        } catch (err) {
            console.error(`Ошибка при обработке ${link}:`, err.message);
        }
    }


    const recipes = allRecipes.reduce((acc, val) => ({...acc, [val.id]: val}), {});
    const inputs = Object.values(recipes).flatMap(x => Object.keys(x.inputs)).filter((x, i, arr) => arr.indexOf(x) === i)
    const baseMaterials = new Set(inputs).difference(new Set(Object.keys(recipes)))

    count = 0
    const baseRecipes = [];
    for (const id of baseMaterials) {
        try {
            await page.goto(`https://vrising.gaming.tools/items/${id}`, { waitUntil: 'networkidle2' });

            const name = await page.$eval('.header-title', el => el.textContent.trim())
            const description = await page.$eval('.header-desc', el => el.textContent.trim())
            const local_image_path = await page.$eval('.tooltip-body img', el => 'images/items/' + el.src.split('/').pop())

            count++;
            console.log(`Обработано рецептов: ${count}/${baseMaterials.size}`);

            baseRecipes.push({
                name,
                description,
                inputs,
                id,
                rarity: 0,
                output_qty: 1,
                local_image_path
            });
        } catch (err) {
            console.error(`Ошибка при обработке ${id}:`, err.message);
        }
    }

    fs.writeFileSync('parsed.json', JSON.stringify(
        {...recipes, ...baseRecipes.reduce((acc, val) => ({...acc, [val.id]: val}), {})},
        null,
        2
    ));

    await browser.close();
})();