import { createSlice } from '@reduxjs/toolkit';
import { applyEdgeChanges, applyNodeChanges, updateEdge as onUpdateEdge } from 'reactflow';
import { EDIT_MODES } from 'src/config-global';

export const initialState = {
  mindMap: {},
  history: [],
  currentIndex: -1,
};

const pushHistory = (state) => {
  state.history.push(state.mindMap);
  state.currentIndex = state.history.length - 1;
};

const mindMapSlice = createSlice({
  name: 'mindMap',
  initialState,
  reducers: {
    /** this action is used to renew mind map */
    renewMindMap: (state, action) => {
      state.mindMap = action.payload;
      pushHistory(state);
    },
    /** this action is triggered when nodes change */
    changeNodes: (state, action) => {
      state.mindMap.nodes = applyNodeChanges(action.payload, state.mindMap.nodes);
    },
    /** this action is triggered when edges change */
    changEdges: (state, action) => {
      state.mindMap.edges = applyEdgeChanges(action.payload, state.mindMap.edges);
    },
    /** this action is used to elevate z-index of edge on hover */
    elevateEdge: (state, action) => {
      state.mindMap.edges = state.mindMap.edges.map((edge) =>
        edge.id === action.payload.id ? action.payload : { ...edge, zIndex: 0 }
      );
    },
    /** this action is used to add a new node */
    addNode: (state, action) => {
      state.mindMap.nodes = state.mindMap.nodes.map((node) => ({ ...node, selected: false }));
      state.mindMap.nodes.push({ ...action.payload, selected: true });
      state.mindMap.selected = [{ element: action.payload, type: EDIT_MODES.NODE_EDITING }];
      pushHistory(state);
    },
    /** this action is used to add a new edge */
    addEdge: (state, action) => {
      state.mindMap.edges.push(action.payload);

      pushHistory(state);
    },
    /** this action is triggered when user drag edge to another node */
    updateEdge: (state, action) => {
      const { oldEdge, newConnection } = action.payload;
      state.mindMap.edges = onUpdateEdge(oldEdge, newConnection, state.mindMap.edges);
      pushHistory(state);
    },
    /** this action is used to delete edges */
    deleteEdges: (state, action) => {
      state.mindMap.edges = action.payload;
      pushHistory(state);
    },
    /** this action is used to delete an edge */
    deleteEdge: (state, action) => {
      state.mindMap.edges = state.mindMap.edges.filter((edge) => edge.id !== action.payload.id);
      pushHistory(state);
    },
    /** this action is used to delete a node */
    deleteNode: (state, action) => {
      state.mindMap.nodes = state.mindMap.nodes.filter((node) => node.id !== action.payload.id);
      pushHistory(state);
    },
    /** this action is used to change background color */
    changeBgColor: (state, action) => {
      state.mindMap.bgcolor = action.payload;
      pushHistory(state);
    },
    /** this action is used to undo the most recent action */
    undo: (state) => {
      if (state.currentIndex > 0 && state.currentIndex <= state.history.length - 1) {
        state.currentIndex--;
        state.mindMap = state.history[state.currentIndex];
      }
    },
    /** this action is used to redo a previously undone action */
    redo: (state) => {
      if (state.currentIndex >= 0 && state.currentIndex <= state.history.length - 1) {
        state.currentIndex++;
        state.mindMap = state.history[state.currentIndex];
      }
    },
    /** this action is used to set selected elements */
    setSelected: (state, action) => {
      const clearSelectedNodes = () => {
        state.mindMap.nodes = state.mindMap.nodes.map((node) => ({ ...node, selected: false }));
      };
      const clearSelectedEdges = () => {
        state.mindMap.edges = state.mindMap.edges.map((edge) => ({ ...edge, selected: false }));
      };
      const updateNodeSelection = (node) =>
        node.id === action.payload.element.id
          ? { ...node, selected: true }
          : { ...node, selected: false };
      const updateEdgeSelection = (edge) =>
        edge.id === action.payload.element.id
          ? { ...edge, selected: true }
          : { ...edge, selected: false };

      // in this case, it's clear selected
      if (!action.payload) {
        state.mindMap.selected = [];
        clearSelectedNodes();
        clearSelectedEdges();
        return;
      }

      state.mindMap.selected = [{ element: action.payload.element, type: action.payload.type }];

      switch (action.payload.type) {
        case EDIT_MODES.NODE_EDITING:
          clearSelectedEdges();

          state.mindMap.nodes = state.mindMap.nodes.map((node) => updateNodeSelection(node));
          break;
        case EDIT_MODES.EDGE_EDITING:
          clearSelectedNodes();

          state.mindMap.edges = state.mindMap.edges.map((edge) => updateEdgeSelection(edge));
          break;

        default:
          clearSelectedNodes();
          clearSelectedEdges();
          break;
      }
    },
    /** this action is used to push current state to history */
    pushStateToHistory: (state) => {
      pushHistory(state);
    },
  },
});

export const {
  renewMindMap,
  changeNodes,
  changEdges,
  elevateEdge,
  addNode,
  addEdge,
  updateEdge,
  deleteEdge,
  deleteEdges,
  deleteNode,
  changeBgColor,
  undo,
  redo,
  setSelected,
  pushStateToHistory,
} = mindMapSlice.actions;

export default mindMapSlice.reducer;
