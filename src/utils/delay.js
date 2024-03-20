export async function randomDelay(maxSeconds) {
  const delay = Math.random() * maxSeconds * 1000;
  await new Promise((resolve) => setTimeout(resolve, delay));
}
