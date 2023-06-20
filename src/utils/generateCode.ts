const randomIdentityCard = [
  {
    name: '马敏',
    card: '370104199503074067',
  },
  {
    name: '钱孝东',
    card: '370104199503079247',
  },
  {
    name: '车燕',
    card: '370104199503073929',
  },
  {
    name: '王海涛',
    card: '370104199503073267',
  },
  {
    name: '茆洪操',
    card: '370104199503073902',
  },
  {
    name: '马勇',
    card: '370104199503071165',
  },
  {
    name: '何群龙',
    card: '370104199503073160',
  },
  {
    name: '尚彦城',
    card: '370104199503071288',
  },
  {
    name: '张志强',
    card: '370104199503078906',
  },
  {
    name: '丁军',
    card: '370104199503078623',
  },
  {
    name: '金波',
    card: '370104199503076687',
  },
  {
    name: '顾勤',
    card: '370104199503077145',
  },
  {
    name: '王歌',
    card: '370104199503074040',
  },
  {
    name: '史志斌',
    card: '37010419950307530X',
  },
  {
    name: '徐振东',
    card: '370104199503078682',
  },
  {
    name: '范存贵',
    card: '370104199503078682',
  },
  {
    name: '王珊',
    card: '370104199503079247',
  },
  {
    name: '钟爱婷',
    card: '370104199503078543',
  },
  {
    name: '唐保军',
    card: '370104199503076329',
  },
  {
    name: '徐陆平',
    card: '370104199503075748',
  },
  {
    name: '黄正英',
    card: '370104199503072387',
  },
  {
    name: '冯仰玉',
    card: '370104199503070808',
  },
  {
    name: '付建志',
    card: '370104199503070322',
  },
  {
    name: '刘立英',
    card: '370104199503076847',
  },
  {
    name: '任亚利',
    card: '370104199503073689',
  },
];
export function getRandomIdentityCard() {
  const result: { name: string; card: string }[] = [];
  while (result.length < 5) {
    const randomIndex = Math.floor(Math.random() * randomIdentityCard.length);
    const randomItem = randomIdentityCard[randomIndex];
    if (randomItem) result.push(randomItem);
    return result;
  }
}
