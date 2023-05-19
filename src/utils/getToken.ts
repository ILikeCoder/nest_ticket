import { Builder, By } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';

const LOGIN_URL =
  'https://platform.sdstm.cn/main/?client_id=c62694f343a64aa28d3b14ab66806bc2&redirect_uri=https://ticket.sdstm.cn/backend/admin/manageLogin#/login';

export interface User {
  remark: string;
  phone: string;
}

export async function getToken(user) {
  const options = new Options().addArguments(
    '--headless',
    '--disable-gpu',
    '--no-sandbox',
  );
  const browser = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
  try {
    // 打开对应的网站
    await browser.get(LOGIN_URL);
    // 输入用户名和密码
    const usernameInput = await browser.findElement(
      By.css('input[placeholder="用户名"]'),
    );
    const passwordInput = await browser.findElement(
      By.css('input[placeholder="密码"]'),
    );
    await usernameInput.sendKeys(user.phone);
    await passwordInput.sendKeys('123456');

    // 点击登录按钮
    const loginButton = await browser.findElement(By.css('.login-button'));
    await loginButton.click();

    // 等待 cookie 中存在 token
    let count = 0;
    while (true) {
      const cookies = await browser.manage().getCookies();
      if (cookies.some((cookie) => cookie.name === 'token')) {
        break;
      }
      count++;
      if (count > 8) {
        return null;
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    // 获取 cookie
    const cookies = await browser.manage().getCookies();
    for (const cookie of cookies) {
      if (cookie.name.includes('token')) {
        const token = cookie.value;
        return {
          remark: user.remark,
          token,
        };
      }
    }
    // 清除缓存和 cookie 并返回登录页面
    await browser.manage().deleteAllCookies();
    await browser.executeScript('window.sessionStorage.clear()');
    await browser.executeScript('window.localStorage.clear()');
    // 访问网页前先删除 cookies
    await browser.get(LOGIN_URL);
    await browser.manage().deleteAllCookies();
    await browser.executeScript('window.sessionStorage.clear()');
    await browser.executeScript('window.localStorage.clear()');
    await browser.get(LOGIN_URL);
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser.quit();
  }
}
