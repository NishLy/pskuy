export default function getSimplifyNumber(num: number) {
  if (num < 1000) return num;
  return num / 1000 + "K";
}
