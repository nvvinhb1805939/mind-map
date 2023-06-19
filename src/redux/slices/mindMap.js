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
    renewEdges: (state, action) => {
      state.edges = action.payload;
    },
    renewNodes: (state, action) => {
      state.nodes = action.payload;
    },
    changEdge: (state, action) => {
      const changedEdgeIndex = state.edges.findIndex((edge) => edge.id === action.payload.id);
      state.edges[changedEdgeIndex] = action.payload;
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
    deleteEdges: (state, action) => {
      const extractIds = action.payload.map((edge) => edge.id);
      state.edges = state.edges.filter((edge) => !extractIds.includes(edge.id));
    },
    deleteEdge: (state, action) => {
      state.edges = state.edges.filter((edge) => edge.id !== action.payload.id);
    },
    deleteNode: (state, action) => {
      state.nodes = state.nodes.filter((node) => node.id !== action.payload.id);
    },
    toggleEdit: (state, action) => {
      state.isEdit = action.payload;
    },
  },
});

export const {
  changeNodes,
  changEdges,
  renewNodes,
  renewEdges,
  changEdge,
  addNode,
  addEdge,
  updateEdge,
  deleteEdge,
  deleteEdges,
  deleteNode,
  toggleEdit,
} = mindMapSlice.actions;

export default mindMapSlice.reducer;
