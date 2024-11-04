import { Browser, Builder, By, Key, until } from "selenium-webdriver";
import { expect } from "chai";
import { describe, before, after, it } from "mocha";
import handleLogin from "../login.js";
import fs from 'fs'

describe("GuiVanBan_TC_14 - Gửi tin nhắn văn bản", function () {
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

  it("GuiVanBan_TC_14_1 - Gửi tin nhắn văn bản không nhập nội dung tin nhắn vào", async function () {
    // Giả định người dùng đã đăng nhập và đang ở trang nhắn tin
    await driver.get("http://localhost:5173/chats/6641d48a0e56ccbea8104679"); // URL trang nhắn tin

    await driver.sleep(500);
    // Bước 1: Không nhập nội dung vào ô tin nhắn
    const messageInput = await driver.findElement(
      By.css("textarea[name='message']"),
    );

    await messageInput.sendKeys(''); // Đảm bảo ô tin nhắn trống

    // Bước 2: Nhấn Enter để gửi tin nhắn trống
    await messageInput.sendKeys(Key.ENTER);

    await driver.sleep(500);

    // Kiểm tra kết quả kỳ vọng: Hiển thị thông báo lỗi
    const errorElement = await driver.wait(
      until.elementLocated(
        By.css(
          ".Toastify__toast.Toastify__toast--error",
        ),
      ),
      5000,
    );

    const errorMessage = await errorElement?.getText();

    await driver.sleep(500);
    // So sánh với thông báo lỗi dự kiến
    expect(errorMessage).to.equal("Nội dung tin nhắn không được để trống");
  });

  it("GuiVanBan_TC_14_2 - Gửi tin nhắn văn bản nhập ký tự khoảng cách", async function () {
    // Giả định người dùng đã đăng nhập và đang ở trang nhắn tin
    await driver.get("http://localhost:5173/chats/6641d48a0e56ccbea8104679"); // URL trang nhắn tin

    await driver.sleep(500);
    // Bước 1: Không nhập nội dung vào ô tin nhắn
    const messageInput = await driver.findElement(
      By.css("textarea[name='message']"),
    );

    await messageInput.sendKeys('  ');

    // Bước 2: Nhấn Enter để gửi tin nhắn trống
    await messageInput.sendKeys(Key.ENTER);

    await driver.sleep(500);

    // Kiểm tra kết quả kỳ vọng: Hiển thị thông báo lỗi
    const errorElement = await driver.wait(
      until.elementLocated(
        By.css(
          ".Toastify__toast.Toastify__toast--error",
        ),
      ),
      5000,
    );

    const errorMessage = await errorElement?.getText();

    await driver.sleep(500);
    // So sánh với thông báo lỗi dự kiến
    expect(errorMessage).to.equal("Nội dung tin nhắn không được để trống");
  });

  it("GuiVanBan_TC_14_3 - Gửi tin nhắn văn bản nhập dưới 500 ký tự", async function () {
    // Giả định người dùng đã đăng nhập và đang ở trang nhắn tin
    await driver.get("http://localhost:5173/chats/6641d48a0e56ccbea8104679"); // URL trang nhắn tin

    await driver.sleep(500);
    // Bước 1: Không nhập nội dung vào ô tin nhắn
    const messageInput = await driver.findElement(
      By.css("textarea[name='message']"),
    );

    const messageContent = 'nội dung dưới 500 ký tự'
    await messageInput.sendKeys(messageContent);

    await messageInput.sendKeys(Key.ENTER);

    await driver.sleep(3000);

    // Lấy danh sách tin nhắn
    const messages = await driver.findElements(By.css(".message")); // `.message-content` là selector của mỗi tin nhắn

    // Lấy tin nhắn cuối cùng
    const lastMessage = messages[messages.length - 1];
    const lastMessageContent = await lastMessage.getText();

    // Kiểm tra xem nội dung tin nhắn cuối có khớp không
    expect(lastMessageContent).to.equal(messageContent);

  });

  it("GuiVanBan_TC_14_4 - Gửi tin nhắn văn bản nhập trên 500 ký tự", async function () {
    // Giả định người dùng đã đăng nhập và đang ở trang nhắn tin
    await driver.get("http://localhost:5173/chats/6641d48a0e56ccbea8104679"); // URL trang nhắn tin

    await driver.sleep(500);

    const messageInput = await driver.findElement(
      By.css("textarea[name='message']"),
    );
    const messageContent = `Việt Nam là một quốc gia nằm ở khu vực Đông Nam Á, nổi tiếng với nền văn hóa đa dạng và phong phú. Từ Bắc vào Nam, mỗi vùng miền đều mang trong mình nét đặc trưng riêng, từ trang phục truyền thống, phong tục, tập quán đến các món ăn nổi tiếng. Hà Nội, thủ đô của Việt Nam, có lịch sử lâu đời và sở hữu nhiều công trình kiến trúc cổ kính như Văn Miếu Quốc Tử Giám, Hồ Gươm. Trong khi đó, thành phố Hồ Chí Minh, trung tâm kinh tế lớn nhất, lại mang dáng vẻ hiện đại, sôi động với những tòa nhà chọc trời. Việt Nam còn có nhiều danh lam thắng cảnh nổi tiếng như Vịnh Hạ Long - kỳ quan thiên nhiên của thế giới, phố cổ Hội An, quần thể Tràng An ở Ninh Bình. Ẩm thực Việt Nam cũng là một phần quan trọng, được nhiều người trên thế giới yêu thích nhờ hương vị tinh tế, đậm đà. Những món ăn như phở, bánh mì, gỏi cuốn đều mang hương vị đặc trưng và hấp dẫn. Đặc biệt, lòng mến khách và tình cảm chân thành của người Việt để lại ấn tượng sâu sắc với du khách. Với tất cả vẻ đẹp văn hóa và tự nhiên, Việt Nam là một điểm đến du lịch hấp dẫn, thu hút đông đảo du khách quốc tế.`

    console.log('độ dài: ', messageContent.length);

    await messageInput.sendKeys(messageContent);

    await messageInput.sendKeys(Key.ENTER);

    await driver.sleep(500);

    // Kiểm tra kết quả kỳ vọng: Hiển thị thông báo lỗi
    const errorElement = await driver.wait(
      until.elementLocated(
        By.css(
          ".Toastify__toast.Toastify__toast--error",
        ),
      ),
      5000,
    );

    const errorMessage = await errorElement?.getText();

    await driver.sleep(500);
    // So sánh với thông báo lỗi dự kiến
    expect(errorMessage).to.equal("Nội dung tin nhắn chỉ chứa tối đa 500 ký tự");
  });

  it("GuiVanBan_TC_14_5 - Gửi tin nhắn văn bản nhập sql injection", async function () {
    // Giả định người dùng đã đăng nhập và đang ở trang nhắn tin
    await driver.get("http://localhost:5173/chats/6641d48a0e56ccbea8104679"); // URL trang nhắn tin

    await driver.sleep(500);

    const messageInput = await driver.findElement(
      By.css("textarea[name='message']"),
    );
    const messageContent = `' OR '1' = '1`

    await messageInput.sendKeys(messageContent);

    await messageInput.sendKeys(Key.ENTER);

    await driver.sleep(3000);

    // Lấy danh sách tin nhắn
    const messages = await driver.findElements(By.css(".message")); // `.message-content` là selector của mỗi tin nhắn

    // Lấy tin nhắn cuối cùng
    const lastMessage = messages[messages.length - 1];
    const lastMessageContent = await lastMessage.getText();

    // Kiểm tra xem nội dung tin nhắn cuối có khớp không
    expect(lastMessageContent).to.equal(messageContent);
  });

  it("GuiVanBan_TC_14_6 - Gửi tin nhắn văn bản nhập html injection", async function () {
    // Giả định người dùng đã đăng nhập và đang ở trang nhắn tin
    await driver.get("http://localhost:5173/chats/6641d48a0e56ccbea8104679"); // URL trang nhắn tin

    await driver.sleep(500);

    const messageInput = await driver.findElement(
      By.css("textarea[name='message']"),
    );
    const messageContent = `<script>alert('Đây là một cuộc tấn công HTML Injection!');</script>`

    await messageInput.sendKeys(messageContent);

    await messageInput.sendKeys(Key.ENTER);

    await driver.sleep(3000);

    // Lấy danh sách tin nhắn
    const messages = await driver.findElements(By.css(".message")); // `.message-content` là selector của mỗi tin nhắn

    // Lấy tin nhắn cuối cùng
    const lastMessage = messages[messages.length - 1];
    const lastMessageContent = await lastMessage.getText();

    // Kiểm tra xem nội dung tin nhắn cuối có khớp không
    expect(lastMessageContent).to.equal(messageContent);
  });
});
