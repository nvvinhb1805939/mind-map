import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { TYPES } from 'src/config-global';

export const EdgeEditing = (props) => {
  const {
    mindMap: { selected },
  } = useSelector((state) => state[TYPES.MIND_MAP]);
  return <div>EdgeEditing {selected[0].element.id}</div>;
};
