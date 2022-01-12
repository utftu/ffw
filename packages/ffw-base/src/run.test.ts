import Form from './form';

it('should 12', function () {
  const form = new Form({
    initData: {
      name: {
        disabled: 'haha',
      },
    },
  });
  console.log('-----', 'form', form.fields.name.data);
  // console.log('-----', 'form', form)
});
