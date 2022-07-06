import lazyFunc from './lazy-func.js'

describe('memo', () => {
  it('', () => {
    const instance = lazyFunc(() => {
      console.log('-----', 'memo exec')
    }, () => ([]))
    instance()
    instance()
  })
  
})