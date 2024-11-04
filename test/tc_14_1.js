import { Browser, Builder, By, Key, until } from "selenium-webdriver";
import { expect } from "chai";
import { describe, before, after, it } from "mocha";

describe("GuiVanBan_TC_14_1 - Gửi tin nhắn văn bản không nhập nội dung tin nhắn vào", function () {
  let driver;

  this.timeout(30000);

  before(async function () {
    // Khởi tạo WebDriver cho trình duyệt Chrome
    driver = await new Builder().forBrowser(Browser.CHROME).build();
  });

  after(async function () {
    // Đóng WebDriver sau khi hoàn thành kiểm thử
    await driver.quit();
  });

  it("should display an error when sending an empty message", async function () {
    // Giả định người dùng đã đăng nhập và đang ở trang nhắn tin
    await driver.get("http://localhost:5173/chats/6641d48a0e56ccbea8104679"); // URL trang nhắn tin

    // Bước 1: Không nhập nội dung vào ô tin nhắn
    const messageInput = await driver.findElement(
      By.css("textarea[placeholder='Aa']"),
    ); // ID của ô nhập tin nhắn
    await messageInput.clear(); // Đảm bảo ô tin nhắn trống

    // Bước 2: Nhấn Enter để gửi tin nhắn trống
    await messageInput.sendKeys(Key.ENTER);

    // Kiểm tra kết quả kỳ vọng: Hiển thị thông báo lỗi
    const errorElement = await driver.wait(
      until.elementLocated(
        By.css(
          ".Toastify__toast.Toastify__toast-theme--light.Toastify__toast--error",
        ),
      ),
      5000,
    );
    print(errorElement);
    const errorMessage = await errorElement?.getText();

    // So sánh với thông báo lỗi dự kiến
    expect(errorMessage).to.equal("Nội dung tin nhắn không được để trống");
  });
});
