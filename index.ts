import { Page, chromium } from 'playwright'
import * as looksSame from 'looks-same'
import * as readline from 'readline'
import * as fs from 'fs'

const DELAY_TIME = 3000
const SCREENSHOTS = [
  {
    url: 'https://localhost:5173/',
    folderName: 'local',
  },
  {
    url: 'https://nfc.predev2.sheeta-dev.com/',
    folderName: 'pre-dev2',
  },
]

/**
 * Checks if all images on the page have loaded.
 * @returns {boolean} True if all images are complete, otherwise false.
 */
const imagesHaveLoaded = (): boolean => {
  return Array.from(document.images).every((i) => i.complete)
}

const scrollToBottom = async (page: Page) => {
  return await page.evaluate(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  })
}

/**
 * Prepares the page for screenshot by waiting for loading spinner to disappear,
 * scrolling to the bottom of the page, and ensuring all images have loaded.
 * @param {import('playwright').Page} page - The Playwright page object.
 */
const readyForPage = async (page: Page) => {
  await page.waitForTimeout(DELAY_TIME)

  // Wait for the loading spinner to disappear
  while (await page.locator('.MuiCircularProgress-svg').count()) {
    await page.waitForTimeout(DELAY_TIME)
  }

  await scrollToBottom(page)

  await page.waitForFunction(imagesHaveLoaded)

  await page.waitForTimeout(DELAY_TIME)
}

/**
 * Takes a screenshot of the specified URL after ensuring the page is fully loaded.
 * Saves the screenshot with a timestamp in the filename.
 */
const screenshotPageByUrl = async (
  url: string,
  folderName: string,
  fileName: string
) => {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 50,
  })
  const context = await browser.newContext({ ignoreHTTPSErrors: true })
  const page = await context.newPage()

  try {
    await page.goto(url, {
      waitUntil: 'networkidle',
    })

    await readyForPage(page)

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    const askQuestion = async (question: string): Promise<string> => {
      return new Promise((resolve) => {
        rl.question(question, (answer) => {
          resolve(answer)
        })
      })
    }

    const answer = await askQuestion(
      'Do you want to screenshot this page? (y/n): '
    )
    if (answer.toLowerCase() === 'y') {
      await page.setViewportSize({ width: 1920, height: 1200 })
      await page.screenshot({
        path: `screenshots/${folderName}/screenshot_${fileName}`,
        fullPage: true,
      })
    }

    rl.close()
  } catch (error) {
    console.error(error)
  } finally {
    await browser.close()
  }
}

/**
 * Compares two screenshots and generates a diff image.
 * Logs whether the images are equal and saves the diff image with a timestamp in the filename.
 */

const compareImages = async (
  path1: string,
  path2: string,
  fileName: string
) => {
  if (!fs.existsSync('diff')) {
    fs.mkdirSync('diff')
  }

  if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots')
  }

  const { equal, diffImage } = await looksSame(
    `screenshots/${path1}`,
    `screenshots/${path2}`,
    { createDiffImage: true }
  )

  if (!equal && diffImage) {
    await diffImage.save(`diff/compare_${fileName}`)
  } else {
    console.log('Images are equal')
  }
}

const processScreenshots = async () => {
  const now = new Date()
  const fileName = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}_${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}.png`

  for (const { url, folderName } of SCREENSHOTS) {
    await screenshotPageByUrl(url, folderName, fileName)
  }

  await compareImages(
    `${SCREENSHOTS[0].folderName}/screenshot_${fileName}`,
    `${SCREENSHOTS[1].folderName}/screenshot_${fileName}`,
    fileName
  )
}

processScreenshots()
