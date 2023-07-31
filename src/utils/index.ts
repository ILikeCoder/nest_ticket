import { Builder, By } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';
import * as CryptoJS from 'crypto-js';
import { randomIdentityCard, type User } from './constans';
import axios, { AxiosProxyConfig } from 'axios';

export async function getToken(user: User) {
  const LOGIN_URL =
    'https://platform.sdstm.cn/main/?client_id=c62694f343a64aa28d3b14ab66806bc2&redirect_uri=https://ticket.sdstm.cn/backend/admin/manageLogin#/login';
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

    await passwordInput.sendKeys(user.password);

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
      if (count > 16) {
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

// 手机号加密 存储到数据库 作为唯一标识
export function encryptString(phone) {
  const hash = CryptoJS.MD5(phone + 'sqy555666sqy');
  const encryptedData = hash.toString();
  return encryptedData.substring(0, 13);
}
// 获取5个随机身份证
export function getRandomIdentityCard() {
  const result: { name: string; card: string }[] = [];
  while (result.length < 5) {
    const randomIndex = Math.floor(Math.random() * randomIdentityCard.length);
    const randomItem = randomIdentityCard[randomIndex];
    if (randomItem) result.push(randomItem);
  }
  return result;
}

export async function getProxy(): Promise<AxiosProxyConfig> {
  const proxy = await axios.get(
    'https://service.ipzan.com/core-extract?num=1&no=20230428084434660179&minute=1&format=txt&repeat=1&protocol=1&pool=ordinary&mode=whitelist&secret=hopkumabgcjfto',
  );

  if (proxy) {
    const [host, port] = proxy.data.split(':');
    return {
      host,
      port: Number(port),
    };
  }
  return null;
}

export function maskIdCard(idCard) {
  if (idCard.length === 18) {
    return idCard.substring(0, 6) + '*'.repeat(8) + idCard.substring(14);
  } else if (idCard.length === 15) {
    return idCard.substring(0, 6) + '*'.repeat(3) + idCard.substring(9);
  } else {
    return idCard;
  }
}
