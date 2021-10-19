async function start() {
  try {
    require('sds.js');
  } catch (error) {
    console.log('-----', 'error');
  }
}

start();
