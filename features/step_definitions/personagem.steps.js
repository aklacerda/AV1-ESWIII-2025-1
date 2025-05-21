const { Given, When, Then, setDefaultTimeout } = require('@cucumber/cucumber');
const puppeteer = require('puppeteer');
const assert = require('assert');

// Aumenta o tempo limite para 20 segundos
setDefaultTimeout(20 * 1000);

let browser, page;

Given('que estou na página de criação de personagens', async () => {
 browser = await puppeteer.launch({
  headless: true,
  slowMo: 50,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

  page = await browser.newPage();
  await page.goto('http://localhost:3000'); // ajuste se necessário
});

When('eu preencho o nome {string}', async (nome) => {
  await page.waitForSelector('#nome');
  await page.type('#nome', nome);
});

When('escolho a classe {string}', async (classe) => {
  await page.waitForSelector('#classe');
  await page.select('#classe', classe);
});

When('clico no botão de criação de personagem', async () => {
  await page.waitForSelector('#criar');
  await page.click('#criar');
});

Then('vejo {string} na lista de personagens', async (esperado) => {
  await page.waitForSelector('.personagem');

  const personagens = await page.$$eval('.personagem', itens =>
    itens.map(i => i.firstChild.textContent.trim())
  );

  assert.ok(
    personagens.includes(esperado),
    `Esperava encontrar "${esperado}", mas encontrei: [${personagens.join(', ')}]`
  );

  await browser.close();
});

// Passo combinado para reaproveitamento
Given('eu crio o personagem {string} com a classe {string}', async (nome, classe) => {
  await page.waitForSelector('#nome');
  await page.type('#nome', nome);

  await page.waitForSelector('#classe');
  await page.select('#classe', classe);

  await page.click('#criar');
});

When('eu marco {string} como pronta', async (nome) => {
  await page.waitForSelector('.personagem');

  const personagens = await page.$$('.personagem');

  for (const p of personagens) {
    const content = await p.evaluate(el => el.firstChild.textContent.trim());
    if (content.startsWith(nome)) {
      const btn = await p.$('button');
      await btn.click();
      return;
    }
  }

  throw new Error(`Não foi possível encontrar o personagem ${nome}`);
});

Then('vejo {string} marcada como pronta', async (nome) => {
  await page.waitForSelector('.personagem.pronto');

  const prontos = await page.$$eval('.personagem.pronto', els =>
    els.map(el => el.textContent.trim())
  );

  const encontrado = prontos.find(text => text.startsWith(nome));
  assert.ok(encontrado, `Esperava encontrar "${nome}" como pronto, mas não encontrei`);

  await browser.close();
});
