import { createSlice } from '@reduxjs/toolkit';
import { applyEdgeChanges, applyNodeChanges, updateEdge as onUpdateEdge } from 'reactflow';

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
      state.nodes = applyNodeChanges(action.payload, state.nodes);
    },
    changEdges: (state, action) => {
      state.edges = applyEdgeChanges(action.payload, state.edges);
    },
    addNode: (state, action) => {
      state.nodes.push(action.payload);
    },
    addEdge: (state, action) => {
      state.edges.push(action.payload);
    },
    updateEdge: (state, action) => {
      const { oldEdge, newConnection } = action.payload;
      state.edges = onUpdateEdge(oldEdge, newConnection, state.edges);
    },
    deleteEdge: (state, action) => {
      const { edge } = action.payload;
      state.edges.filter((edge) => edge.id !== edge.id);
    },
    toggleEdit: (state, action) => {
      state.isEdit = action.payload;
    },
  },
});

export const { changeNodes, changEdges, addNode, addEdge, updateEdge, deleteEdge, toggleEdit } =
  mindMapSlice.actions;

export default mindMapSlice.reducer;
