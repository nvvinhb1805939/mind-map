import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { TYPES } from 'src/config-global';

export const NodeEditing = (props) => {
  const {
    mindMap: { selected },
  } = useSelector((state) => state[TYPES.MIND_MAP]);
  return <div>NodeEditing {selected[0].element.data.label}</div>;
};
