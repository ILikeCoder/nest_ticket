import dayjs from 'dayjs';
export function getWeekDay(date: string) {
  const day = dayjs(date).day();
  const week = ['日', '一', '二', '三', '四', '五', '六'];
  return `${date}  ||  星期${week[day]}`;
}
