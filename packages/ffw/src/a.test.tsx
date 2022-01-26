/**
 * @jest-environment jsdom
 */

import React from 'react';
import {cleanup, render} from '@testing-library/react';

// Note: running cleanup afterEach is done automatically for you in @testing-library/react@9.0.0 or higher
// unmount and cleanup DOM after the test is finished.
afterEach(cleanup);

it('CheckboxWithLabel changes the text after click', () => {
  const {queryByLabelText, getByLabelText} = render(
    <div>hello</div>,
  );
});
