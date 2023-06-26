import { createSlice } from '@reduxjs/toolkit';
import { applyEdgeChanges, applyNodeChanges, updateEdge as onUpdateEdge } from 'reactflow';

export const initialState = {
  mindMap: {
    bgcolor: '#fff',
    selectedNode: null,
    selectedEdge: null,
    nodes: [],
    edges: [],
  },
  history: [],
  currentIndex: -1,
};

const mindMapSlice = createSlice({
  name: 'mindMap',
  initialState,
  reducers: {
    restoreMindMap: (state, action) => {
      state.mindMap = action.payload;
      state.history.push(state.mindMap);
      state.currentIndex = state.history.length - 1;
    },
    changeNodes: (state, action) => {
      state.mindMap.nodes = applyNodeChanges(action.payload, state.mindMap.nodes);
    },
    changEdges: (state, action) => {
      state.mindMap.edges = applyEdgeChanges(action.payload, state.mindMap.edges);
    },
    renewEdges: (state, action) => {
      state.mindMap.edges = action.payload;
      state.history.push(state.mindMap);
      state.currentIndex = state.history.length - 1;
    },
    renewNodes: (state, action) => {
      state.mindMap.nodes = action.payload;
      state.history.push(state.mindMap);
      state.currentIndex = state.history.length - 1;
    },
    changEdge: (state, action) => {
      const changedEdgeIndex = state.mindMap.edges.findIndex(
        (edge) => edge.id === action.payload.id
      );
      state.mindMap.edges[changedEdgeIndex] = action.payload;
      state.history.push(state.mindMap);
      state.currentIndex = state.history.length - 1;
    },
    addNode: (state, action) => {
      state.mindMap.nodes.push(action.payload);
      state.history.push(state.mindMap);
      state.currentIndex = state.history.length - 1;
    },
    addEdge: (state, action) => {
      state.mindMap.edges.push(action.payload);
      state.history.push(state.mindMap);
      state.currentIndex = state.history.length - 1;
    },
    updateEdge: (state, action) => {
      const { oldEdge, newConnection } = action.payload;
      state.mindMap.edges = onUpdateEdge(oldEdge, newConnection, state.mindMap.edges);
      state.history.push(state.mindMap);
      state.currentIndex = state.history.length - 1;
    },
    deleteEdges: (state, action) => {
      state.mindMap.edges = action.payload;
      state.history.push(state.mindMap);
      state.currentIndex = state.history.length - 1;
    },
    deleteEdge: (state, action) => {
      state.mindMap.edges = state.mindMap.edges.filter((edge) => edge.id !== action.payload.id);
      state.history.push(state.mindMap);
      state.currentIndex = state.history.length - 1;
    },
    deleteNode: (state, action) => {
      state.mindMap.nodes = state.mindMap.nodes.filter((node) => node.id !== action.payload.id);
      state.history.push(state.mindMap);
      state.currentIndex = state.history.length - 1;
    },
    changeBgColor: (state, action) => {
      state.mindMap.bgcolor = action.payload;
      state.history.push(state.mindMap);
      state.currentIndex = state.history.length - 1;
    },
    undo: (state) => {
      if (state.currentIndex > 0 && state.currentIndex <= state.history.length - 1) {
        state.currentIndex--;
        state.mindMap = state.history[state.currentIndex];
      }
    },
    redo: (state) => {
      if (state.currentIndex >= 0 && state.currentIndex <= state.history.length - 1) {
        state.currentIndex++;
        state.mindMap = state.history[state.currentIndex];
      }
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
  undo,
  redo,
} = mindMapSlice.actions;

export default mindMapSlice.reducer;
