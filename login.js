import { By } from "selenium-webdriver";
import { ThenableWebDriver } from "selenium-webdriver";

/**
 * 
 * @param {ThenableWebDriver} driver 
 */
const handleLogin = async (driver) => {
    await driver.get("http://localhost:5173/login");
    const emailInput = await driver.findElement(
        By.css("input[name='email']"),
    );
    const passwordInput = await driver.findElement(
        By.css("input[name='password']"),
    );
    const submitBtn = await driver.findElement(By.css("button[type='submit']"));

    await emailInput.sendKeys('sonnn.21it@vku.udn.vn')
    await passwordInput.sendKeys('123456')

    await driver.sleep(500);

    await submitBtn.click()
    await driver.sleep(500);
}

export default handleLogin;