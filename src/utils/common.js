export function timestampToTime(timestamp) {
  let date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let Y = date.getFullYear() + "-";
  let M = date.getMonth() + 1 + "-";
  let D = date.getDate() + " ";
  let h = date.getHours() + ":";
  let m = date.getMinutes() + ":";
  let s =
    date.getSeconds() + 1 < 10
      ? "0" + (date.getSeconds() + 1)
      : date.getSeconds() + 1;
  return Y + M + D + h + m + s;
}
