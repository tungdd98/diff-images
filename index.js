"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var playwright_1 = require("playwright");
var looksSame = require("looks-same");
var readline = require("readline");
var fs = require("fs");
var DELAY_TIME = 3000;
var SCREENSHOTS = [
    {
        url: 'https://localhost:5173/',
        folderName: 'local',
    },
    {
        url: 'https://nfc.predev2.sheeta-dev.com/',
        folderName: 'pre-dev2',
    },
];
/**
 * Checks if all images on the page have loaded.
 * @returns {boolean} True if all images are complete, otherwise false.
 */
var imagesHaveLoaded = function () {
    return Array.from(document.images).every(function (i) { return i.complete; });
};
var scrollToBottom = function (page) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.evaluate(function () {
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
/**
 * Prepares the page for screenshot by waiting for loading spinner to disappear,
 * scrolling to the bottom of the page, and ensuring all images have loaded.
 * @param {import('playwright').Page} page - The Playwright page object.
 */
var readyForPage = function (page) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.waitForTimeout(DELAY_TIME)
                // Wait for the loading spinner to disappear
            ];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [4 /*yield*/, page.locator('.MuiCircularProgress-svg').count()];
            case 3:
                if (!_a.sent()) return [3 /*break*/, 5];
                return [4 /*yield*/, page.waitForTimeout(DELAY_TIME)];
            case 4:
                _a.sent();
                return [3 /*break*/, 2];
            case 5: return [4 /*yield*/, scrollToBottom(page)];
            case 6:
                _a.sent();
                return [4 /*yield*/, page.waitForFunction(imagesHaveLoaded)];
            case 7:
                _a.sent();
                return [4 /*yield*/, page.waitForTimeout(DELAY_TIME)];
            case 8:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
/**
 * Takes a screenshot of the specified URL after ensuring the page is fully loaded.
 * Saves the screenshot with a timestamp in the filename.
 */
var screenshotPageByUrl = function (url, folderName, fileName) { return __awaiter(void 0, void 0, void 0, function () {
    var browser, context, page, rl_1, askQuestion, answer, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, playwright_1.chromium.launch({
                    headless: false,
                    slowMo: 50,
                })];
            case 1:
                browser = _a.sent();
                return [4 /*yield*/, browser.newContext({ ignoreHTTPSErrors: true })];
            case 2:
                context = _a.sent();
                return [4 /*yield*/, context.newPage()];
            case 3:
                page = _a.sent();
                _a.label = 4;
            case 4:
                _a.trys.push([4, 11, 12, 14]);
                return [4 /*yield*/, page.goto(url, {
                        waitUntil: 'networkidle',
                    })];
            case 5:
                _a.sent();
                return [4 /*yield*/, readyForPage(page)];
            case 6:
                _a.sent();
                rl_1 = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout,
                });
                askQuestion = function (question) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, new Promise(function (resolve) {
                                rl_1.question(question, function (answer) {
                                    resolve(answer);
                                });
                            })];
                    });
                }); };
                return [4 /*yield*/, askQuestion('Do you want to screenshot this page? (y/n): ')];
            case 7:
                answer = _a.sent();
                if (!(answer.toLowerCase() === 'y')) return [3 /*break*/, 10];
                return [4 /*yield*/, page.setViewportSize({ width: 1920, height: 1200 })];
            case 8:
                _a.sent();
                return [4 /*yield*/, page.screenshot({
                        path: "screenshots/".concat(folderName, "/screenshot_").concat(fileName),
                        fullPage: true,
                    })];
            case 9:
                _a.sent();
                _a.label = 10;
            case 10:
                rl_1.close();
                return [3 /*break*/, 14];
            case 11:
                error_1 = _a.sent();
                console.error(error_1);
                return [3 /*break*/, 14];
            case 12: return [4 /*yield*/, browser.close()];
            case 13:
                _a.sent();
                return [7 /*endfinally*/];
            case 14: return [2 /*return*/];
        }
    });
}); };
/**
 * Compares two screenshots and generates a diff image.
 * Logs whether the images are equal and saves the diff image with a timestamp in the filename.
 */
var compareImages = function (path1, path2, fileName) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, equal, diffImage;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!fs.existsSync('diff')) {
                    fs.mkdirSync('diff');
                }
                if (!fs.existsSync('screenshots')) {
                    fs.mkdirSync('screenshots');
                }
                return [4 /*yield*/, looksSame("screenshots/".concat(path1), "screenshots/".concat(path2), { createDiffImage: true })];
            case 1:
                _a = _b.sent(), equal = _a.equal, diffImage = _a.diffImage;
                if (!(!equal && diffImage)) return [3 /*break*/, 3];
                return [4 /*yield*/, diffImage.save("diff/compare_".concat(fileName))];
            case 2:
                _b.sent();
                return [3 /*break*/, 4];
            case 3:
                console.log('Images are equal');
                _b.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); };
var processScreenshots = function () { return __awaiter(void 0, void 0, void 0, function () {
    var now, fileName, _i, SCREENSHOTS_1, _a, url, folderName;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                now = new Date();
                fileName = "".concat(now.getFullYear(), "-").concat(now.getMonth() + 1, "-").concat(now.getDate(), "_").concat(now.getHours(), "-").concat(now.getMinutes(), "-").concat(now.getSeconds(), ".png");
                _i = 0, SCREENSHOTS_1 = SCREENSHOTS;
                _b.label = 1;
            case 1:
                if (!(_i < SCREENSHOTS_1.length)) return [3 /*break*/, 4];
                _a = SCREENSHOTS_1[_i], url = _a.url, folderName = _a.folderName;
                return [4 /*yield*/, screenshotPageByUrl(url, folderName, fileName)];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [4 /*yield*/, compareImages("".concat(SCREENSHOTS[0].folderName, "/screenshot_").concat(fileName), "".concat(SCREENSHOTS[1].folderName, "/screenshot_").concat(fileName), fileName)];
            case 5:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
processScreenshots();
