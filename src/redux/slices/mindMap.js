import { createSlice } from '@reduxjs/toolkit';
import { applyEdgeChanges, applyNodeChanges, updateEdge as onUpdateEdge } from 'reactflow';
import { TYPES } from 'src/config-global';

export const initialState = {
  bgcolor: '#fff',
  selectedNode: null,
  selectedEdge: null,
  nodes: [],
  edges: [],
};

const mindMapSlice = createSlice({
  name: 'mindMap',
  initialState,
  reducers: {
    restoreMindMap: (state, action) => {
      const { bgcolor, selectedNode, selectedEdge, nodes, edges } = action.payload;

      state.bgcolor = bgcolor;
      state.selectedNode = selectedNode;
      state.selectedEdge = selectedEdge;
      state.nodes = nodes;
      state.edges = edges;
    },
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
      state.edges = action.payload;
    },
    deleteEdge: (state, action) => {
      state.edges = state.edges.filter((edge) => edge.id !== action.payload.id);
    },
    deleteNode: (state, action) => {
      state.nodes = state.nodes.filter((node) => node.id !== action.payload.id);
    },
    changeBgColor: (state, action) => {
      state.bgcolor = action.payload;
    },
  },
});

export const {
  restoreMindMap,
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
  changeBgColor,
} = mindMapSlice.actions;

export const presentMindMap = (state) => state[TYPES.MIND_MAP].present;

export default mindMapSlice.reducer;
