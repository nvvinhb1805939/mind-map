import { createSlice, current } from '@reduxjs/toolkit';
import { applyEdgeChanges, applyNodeChanges } from 'reactflow';

const initialState = {
  isEdit: false,
  nodes: [],
  edges: [],
};

const mindMapSlice = createSlice({
  name: 'mindMap',
  initialState,
  reducers: {
    changeNodes: (state, action) => {
      state.nodes = applyNodeChanges(action.payload, state.node);
    },
    changEdges: (state, action) => {
      state.edges = applyEdgeChanges(action.payload, state.edge);
    },
    addNodes: (state, action) => {
      state.nodes.push(action.payload);
    },
    addEdges: (state, action) => {
      state.edges = applyEdgeChanges(action.payload, state.edges);
    },
    toggleEdit: (state, action) => {
      state.isEdit = action.payload;
    },
  },
});

export const { changeNodes, changEdges, onEdgesChange, addNodes, addEdges, toggleEdit } =
  mindMapSlice.actions;

export default mindMapSlice.reducer;
