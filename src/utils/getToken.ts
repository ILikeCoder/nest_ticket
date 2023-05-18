import { Builder, By } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';
const options = new Options();
options.addArguments('--headless', '--disable-gpu', '--no-sandbox');

export interface User {
  remark: string;
  phone: string;
}
const url =
  'https://platform.sdstm.cn/main/?client_id=c62694f343a64aa28d3b14ab66806bc2&redirect_uri=https://ticket.sdstm.cn/backend/admin/manageLogin#/login';

export async function getToken(user: User) {
  const browser = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
  try {
    await browser.get(url);
    // 输入用户名和密码
    const username_input = await browser.findElement(
      By.xpath(
        '/html/body/div/div/div/div[1]/div[2]/div[1]/div[3]/form[1]/div[1]/div/div/input',
      ),
    );
    const password_input = await browser.findElement(
      By.xpath(
        '/html/body/div/div/div/div[1]/div[2]/div[1]/div[3]/form[1]/div[2]/div/div[1]/input',
      ),
    );
    await username_input.sendKeys(user.phone);
    await password_input.sendKeys(123456);

    // 找到登录按钮，点击
    const login_button = await browser.findElement(
      By.xpath(
        '/html/body/div/div/div/div[1]/div[2]/div[1]/div[3]/form[1]/div[3]',
      ),
    );
    await login_button.click();

    // 等待 cookie 中存在 token
    let count = 0;
    while (true) {
      const cookies = await browser.manage().getCookies();
      if (cookies.some((cookie) => cookie.name === 'token')) {
        break;
      }
      count++;
      if (count > 8) {
        console.log(
          `${user.remark}  token获取失败,请检查密码是否错误,或者网络环境不好`,
        );
        break;
      } else {
        await new Promise((resolve) => setTimeout(resolve, 500));
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
    await browser.get(url);
    await browser.manage().deleteAllCookies();
    await browser.executeScript('window.sessionStorage.clear()');
    await browser.executeScript('window.localStorage.clear()');
    await browser.get(url);
  } finally {
    await browser.quit();
  }
}
