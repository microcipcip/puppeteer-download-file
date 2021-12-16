const puppeteer = require('puppeteer')
const path = require('path')

// Set url here
const url = 'https://url-here/'

// Step1: get a download folder
const downloadPath = path.resolve('./download')

(async () => {
  try {
    const browser = await puppeteer.launch({
      ignoreHTTPSErrors: true
    })
    const page = await browser.newPage()
    await downloadFile(page)
    await browser.close()
  } catch (error) {
    console.log(error)
  }
})()

async function downloadFile (page) {
  // Step2: set where I want to download the file
  await page._client.send('Page.setDownloadBehavior', {behavior: 'allow', downloadPath})

  await page.goto(url)
  await clickButtons(page)

  // Step3: wait for networkIdle so that we are sure the download is completed
  await page.waitForNetworkIdle({waitUntil: 'networkidle0'})
}

async function clickButtons (page) {
  await clickBtn('Continue without audio/or video')
  await page.click('[icon="bug-report"')
  await clickBtn('Download report')

  async function clickBtn (txt) {
    const btn = await page.$x(`//paper-button[contains(text(), \'${txt}\')]`)
    await btn[0].click()
  }
}
