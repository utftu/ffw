import {Form} from 'ffw-base'

class FormSvelte extends Form{
  constructor(...args) {
    super(...args)
    
    this.svelte = this.s = {
      valid: {
        subscribe(cb) {
          cb(this.valid)
          function handle() {
            cb(this.valid)
          }
          this.emitter.subscribe('ffw.valid', handle)
          return () => this.emitter.unsubscribe('ffw.valid', handle)
        }
      }
    }
  }
}