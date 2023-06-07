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
    const extraPhone = [
      '13655383851',
      '15064126456',
      '18653444506',
      '15288852596',
      '13409094120',
      '19315749293',
      '13434288880',
    ];
    if (extraPhone.includes(user.phone)) {
      await passwordInput.sendKeys('sunshine1.');
    } else {
      await passwordInput.sendKeys('123456');
    }

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

// 接口传递过来的参数，删除掉随机参数，传递给后端进行查询
export function del_radom_mima(str, indices = [0, 3, 5, 6, 10]) {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    if (!indices.includes(i)) {
      // 不在要删除的位置中
      result += str.charAt(i); // 将字符添加到结果中
    }
  }
  return result.substring(0, 13);
}

export const constans = {
  '622bef718fd86': 0,
  '2f3531121a798': 1,
  eec98f50f6fee: 2,
  b68dcce136b7b: 3,
  '33c0b3f4e497b': 4,
};
