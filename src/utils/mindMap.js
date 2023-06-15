export const hasConnectBetweenTwoNode = (edges, node1, node2) => {
  return edges.some(
    (edge) =>
      (edge.source === node1 && edge.target === node2) ||
      (edge.source === node2 && edge.target === node1)
  );
};
