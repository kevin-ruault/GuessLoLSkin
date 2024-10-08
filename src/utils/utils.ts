export function getRandomElement<T>(array: T[]): T | undefined {
  if (array.length === 0) return undefined;
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

export function getRandomNum(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function setFocusOnInput(inputRef: HTMLInputElement | null): void {
  if (inputRef) {
    inputRef.focus();
  }
}
