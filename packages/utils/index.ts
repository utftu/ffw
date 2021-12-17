export async function waitAsync(milliseconds = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}
