import Form from './form';

it('should 12', function() {
  const form = new Form({
    initValues: {
      name: 'aleks'
    }
  })
  form.fields.a = 'b'
  console.log('-----', 'form.fields', form._fields)
  // console.log('-----', 'form', form)
});
