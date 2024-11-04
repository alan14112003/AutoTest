import { Browser, Builder, By, Key, until } from "selenium-webdriver";
import { expect } from "chai";
import { describe, before, after, it } from "mocha";
import handleLogin from "../login.js";
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from "fs";

// Lấy đường dẫn của file hiện tại
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe("GuiFile_TC_16 - Gửi tin nhắn file", function () {

    let driver;

    this.timeout(30000);

    before(async function () {
        // Khởi tạo WebDriver cho trình duyệt Chrome
        driver = await new Builder().forBrowser(Browser.CHROME).build();

        await handleLogin(driver);
    });

    after(async function () {
        // Đóng WebDriver sau khi hoàn thành kiểm thử
        await driver.quit();
    });

    afterEach(async () => {
        await driver.sleep(1000)
    })

    it("GuiFile_TC_16_1 - Gửi tin nhắn file hợp lệ", async function () {
        const pathKey = path.resolve(__dirname, '../files', 'change.png')
        const expectRs = 'a'

        // Giả định người dùng đã đăng nhập và đang ở trang nhắn tin
        await driver.get("http://localhost:5173/chats/6641d48a0e56ccbea8104679"); // URL trang nhắn tin

        await driver.sleep(500);
        // Bước 1: Không nhập nội dung vào ô tin nhắn
        const sendFileInput = await driver.findElement(
            By.id("upload-file-btn"),
        );

        await sendFileInput.sendKeys(pathKey);

        await driver.sleep(7000);

        // Lấy danh sách tin nhắn
        const messages = await driver.findElements(By.css(".message")); // `.message-content` là selector của mỗi tin nhắn

        // Lấy tin nhắn cuối cùng
        const lastMessage = messages[messages.length - 1];

        const lastMessageTag = await lastMessage.getTagName(); // Lấy tên thẻ

        // So sánh với tên thẻ mong đợi
        expect(lastMessageTag).to.equal(expectRs);
    });

    it("GuiFile_TC_16_2 - Gửi tin nhắn file với đuôi file không được phép", async function () {
        const pathKey = path.resolve(__dirname, '../files', 'change.zip')
        const expectRs = "File không được phép gửi"

        // Giả định người dùng đã đăng nhập và đang ở trang nhắn tin
        await driver.get("http://localhost:5173/chats/6641d48a0e56ccbea8104679"); // URL trang nhắn tin

        await driver.sleep(500);
        // Bước 1: Không nhập nội dung vào ô tin nhắn
        const sendImageInput = await driver.findElement(
            By.id("upload-file-btn"),
        );

        await sendImageInput.sendKeys(pathKey);

        // Kiểm tra kết quả kỳ vọng: Hiển thị thông báo lỗi
        const errorElement = await driver.wait(
            until.elementLocated(
                By.css(
                    ".Toastify__toast.Toastify__toast--error",
                ),
            ),
            5000,
        );

        const errorMessage = await errorElement.getText();

        await driver.sleep(500);
        // So sánh với thông báo lỗi dự kiến
        expect(errorMessage).to.equal(expectRs);
    });
});
