import { createSlice } from '@reduxjs/toolkit';
import { applyEdgeChanges, applyNodeChanges, updateEdge as onUpdateEdge } from 'reactflow';
import { EDIT_MODES } from 'src/config-global';
import { v4 as uuidv4 } from 'uuid';

export const INITIAL_MIND_MAP = {
  bgcolor: '#ffffff',
  nodes: [],
  edges: [],
  selected: [],
  copied: null,
  elementContext: null,
  isMultiSelection: false,
};

export const initialState = {
  mindMap: INITIAL_MIND_MAP,
  history: [],
  currentIndex: -1,
};

const pushHistory = (state) => {
  state.history.splice(++state.currentIndex, 0, state.mindMap);
};
const clearSelectedNodes = (state) => {
  state.mindMap.nodes = state.mindMap.nodes.map((node) => ({
    ...node,
    selected: false,
    ...(state.mindMap.isMultiSelection && { draggable: false }),
  }));
};
const clearSelectedEdges = (state) => {
  state.mindMap.edges = state.mindMap.edges.map((edge) => ({ ...edge, selected: false }));
};
const updateNodeSelection = (node, action) =>
  node.id === action.payload.element.id
    ? { ...node, selected: true }
    : { ...node, selected: false };
const updateEdgeSelection = (edge, action) =>
  edge.id === action.payload.element.id
    ? { ...edge, selected: true }
    : { ...edge, selected: false };
const setAllSelectedElements = (state, action) => {
  if (action.payload.type === 'nodes') clearSelectedEdges(state);
  else clearSelectedNodes(state);

  const selectedElements = action.payload.elements.map((element) => ({
    element: { ...element, selected: true, draggable: true },
    type: action.payload.type === 'nodes' ? EDIT_MODES.NODE_EDITING : EDIT_MODES.EDGE_EDITING,
  }));

  state.mindMap[action.payload.type] = selectedElements.map((element) => element.element);
  state.mindMap.selected = selectedElements;
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
    addNodes: (state, action) => {
      const newNodes = action.payload;

      state.mindMap.nodes = state.mindMap.nodes.map((node) => ({ ...node, selected: false }));
      state.mindMap.nodes.push(...newNodes);
      state.mindMap.selected = newNodes.map((node) => ({
        element: node,
        type: EDIT_MODES.NODE_EDITING,
      }));
    },
    /** this action is used to add a new edge */
    addEdge: (state, action) => {
      state.mindMap.edges.push(action.payload);
    },
    /** this action is triggered when user drag edge to another node */
    updateEdge: (state, action) => {
      const { oldEdge, newConnection } = action.payload;
      state.mindMap.edges = onUpdateEdge(oldEdge, newConnection, state.mindMap.edges);
      pushHistory(state);
    },
    updateIncomerEdges: (state, action) => {
      state.mindMap.edges = state.mindMap.edges.map((edge) => {
        const newIndex = action.payload.findIndex((newEdge) => newEdge.id === edge.id);

        return newIndex !== -1 ? action.payload[newIndex] : edge;
      });
    },
    /** this action is used to update node props */
    updateElementProps: (state, action) => {
      const { type, ids, elementProps = null } = action.payload;

      state.mindMap.selected = [];

      state.mindMap[type] = state.mindMap[type].map((element) => {
        if (!ids.includes(element.id)) return element;

        const styledElement = {
          ...element,
          ...(elementProps && elementProps(element)),
        };

        state.mindMap.selected.push({
          element: styledElement,
          type: type === 'nodes' ? EDIT_MODES.NODE_EDITING : EDIT_MODES.EDGE_EDITING,
        });

        return styledElement;
      });

      pushHistory(state);
    },
    /** this action is used to delete edges */
    deleteEdges: (state, action) => {
      state.mindMap.edges = action.payload;
    },
    /** this action is used to delete edges */
    deleteNodes: (state, action) => {
      state.mindMap.nodes = action.payload;
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
      // in this case, it's clear selected
      if (!action.payload) {
        state.mindMap.selected = [];
        clearSelectedNodes(state);
        clearSelectedEdges(state);
        return;
      }

      state.mindMap.selected = [
        {
          element: action.payload.element,
          type: action.payload.type,
          anchorEl: action.payload.anchorEl,
        },
      ];

      switch (action.payload.type) {
        case EDIT_MODES.NODE_EDITING:
          clearSelectedEdges(state);

          state.mindMap.nodes = state.mindMap.nodes.map((node) =>
            updateNodeSelection(node, action)
          );
          break;
        case EDIT_MODES.EDGE_EDITING:
          clearSelectedNodes(state);

          state.mindMap.edges = state.mindMap.edges.map((edge) =>
            updateEdgeSelection(edge, action)
          );
          break;

        default:
          clearSelectedNodes(state);
          clearSelectedEdges(state);
          break;
      }
    },
    /** this action is used to set all selected nodes or edges */
    setAllSelectedNodesOrEdges: (state, action) => {
      setAllSelectedElements(state, action);

      pushHistory(state);
    },
    /** this action is used to set selected all (all nodes and all edges) */
    setAllSelected: (state) => {
      const selectedNodes = state.mindMap.nodes.map((node) => ({
        element: { ...node, selected: true, draggable: true },
        type: EDIT_MODES.NODE_EDITING,
      }));
      const selectedEdges = state.mindMap.edges.map((edge) => ({
        element: { ...edge, selected: true },
        type: EDIT_MODES.EDGE_EDITING,
      }));

      state.mindMap.nodes = selectedNodes.map((node) => node.element);
      state.mindMap.edges = selectedEdges.map((edge) => edge.element);
      state.mindMap.selected = [...selectedNodes, ...selectedEdges];

      pushHistory(state);
    },
    setMultiSelectedElements: (state, action) => {
      const { type, element, selected } = action.payload;

      state.mindMap.selected = selected;
      state.mindMap[type] = state.mindMap[type].map((item) =>
        item.id === element.id ? element : item
      );
    },
    /** this action is used to push current state to history */
    pushStateToHistory: (state) => {
      pushHistory(state);
    },
    /** this action is used to insert node between two nodes */
    insertNodeBetweenTwoEdges: (state, action) => {
      const {
        edge,
        edge: { source, target },
        node,
      } = action.payload;

      state.mindMap.edges = state.mindMap.edges.filter((e) => e.id !== edge.id); // delete edge

      /** add node */
      state.mindMap.nodes = state.mindMap.nodes.map((node) => ({ ...node, selected: false }));
      state.mindMap.nodes.push({ ...node, selected: true });
      state.mindMap.selected = [{ element: node, type: EDIT_MODES.NODE_EDITING }];

      /** add two new edges */
      const newEdge1 = {
        id: uuidv4(),
        source,
        target: node.id,
      };
      const newEdge2 = {
        id: uuidv4(),
        source: node.id,
        target,
      };

      state.mindMap.edges.push(newEdge1, newEdge2);

      pushHistory(state);
    },
    /** this action is used to copy format of element */
    copyFormat: (state, action) => {
      state.mindMap.copied = action.payload;
    },
    /** this action is used to paste format of edge */
    pasteEdgeFormat: (state, action) => {
      state.mindMap.edges = state.mindMap.edges.map((edge) =>
        action.payload.id === edge.id ? action.payload : edge
      );

      pushHistory(state);
    },
    /** this action is used to toggle multi selection mode */
    toggleMultiSelection: (state, action) => {
      state.mindMap.isMultiSelection = action.payload;
      state.mindMap.nodes = state.mindMap.nodes.map((node) => ({
        ...node,
        draggable: !action.payload,
      }));
      state.mindMap.edges = state.mindMap.edges.map((edge) => ({
        ...edge,
        updatable: !action.payload,
      }));
    },
    /** this action is used to set element context */
    setElementContext: (state, action) => {
      state.mindMap.elementContext = action.payload;
    },
  },
});

export const {
  renewMindMap,
  changeNodes,
  changEdges,
  elevateEdge,
  addNodes,
  addEdge,
  updateIncomerEdges,
  updateEdge,
  updateElementProps,
  deleteEdges,
  deleteNodes,
  changeBgColor,
  undo,
  redo,
  setSelected,
  setAllSelectedNodesOrEdges,
  setAllSelected,
  setMultiSelectedElements,
  pushStateToHistory,
  insertNodeBetweenTwoEdges,
  copyFormat,
  pasteEdgeFormat,
  toggleMultiSelection,
  setElementContext,
} = mindMapSlice.actions;

export default mindMapSlice.reducer;
