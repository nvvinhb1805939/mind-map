import { createSlice } from '@reduxjs/toolkit';
import { Edge, EdgeChange, Node, NodeChange, applyEdgeChanges, applyNodeChanges } from 'reactflow';

const initialState = {
  nodes: [
    {
      id: 'root',
      type: 'mindmap',
      data: { label: 'Sơ đồ tư duy' },
      position: { x: 0, y: 0 },
    },
  ],
  edges: [],
};

const mindMapSlice = createSlice({
  name: 'mindMap',
  initialState,
  reducers: {
    setNodes: (state, action) => {
      state.nodes = applyNodeChanges(action.payload, state.nodes);
    },
    setEdges: (state, action) => {
      state.edges = applyEdgeChanges(action.payload, state.edges);
    },
  },
});

export const { setNodes, setEdges } = mindMapSlice.actions;

export default mindMapSlice.reducer;
