// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function handleFieldError(arr: any[]) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== undefined) return arr[i] instanceof Array ? arr[i] : arr[i];
  }
  return;
}
