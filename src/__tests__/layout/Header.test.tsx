import { mount, shallow } from 'enzyme';
import React from 'react';

import Header from '../../modules/layout/components/Header';

describe('Header component', () => {
  const defaultProps = {
    title: 'default'
  };

  test('renders Header successfully', () => {
    shallow(<Header {...defaultProps} />);
  });

  test('renders successfully with default value', () => {
    const wrapper = mount(<Header {...defaultProps} />);
    const props = wrapper.props();

    expect(props).toMatchObject(defaultProps);
  });
});
