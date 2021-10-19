import Field from './field';
import Form from './form';

export async function waitAsync(milliseconds = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

export async function batch(cb: () => void) {
  try {
    const renderPackage = await Promise.race([
      import('react-dom'),
      // @ts-ignore
      import('react-native'),
    ]);
    renderPackage.unstable_batchedUpdates(cb);
  } catch (error) {
    console.log('-----', 'error');
    throw new Error('You don\'t use nor "react-dom" nor "react-native"');
  }
}
