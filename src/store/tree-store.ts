import { Edge, Node } from "reactflow";
import { create } from "zustand";

interface PathResult {
  sum: number;
  path: string[];
}

interface TreeState {
  selectedNode: string | null;
  nodes: Node[];
  edges: Edge[];
  maxLeafToNodePath: PathResult | null;
  maxNodeToNodePath: PathResult | null;
  setSelectedNode: (node: string | null) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (value: number) => void;
  updateNodeValue: (id: string, value: number) => void;
  deleteNode: (id: string) => void;
  calculatePaths: () => void;
  clearPaths: () => void;
}

interface TreeNode {
  id: string;
  value: number;
  children: string[];
  parent: string | null;
}

const useTreeStore = create<TreeState>((set, get) => ({
  nodes: [],
  edges: [],
  maxLeafToNodePath: null,
  maxNodeToNodePath: null,
  selectedNode: null,

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setSelectedNode: (node) => set({ selectedNode: node }),

  addNode: (value) => {
    const { nodes, edges, selectedNode } = get();

    const newNodeId = `node-${Date.now()}`;
    let position;
    if (selectedNode) {
      const parentNode = nodes.find((n) => n.id === selectedNode);
      if (parentNode) {
        const childCount = edges.filter(
          (e) => e.source === selectedNode
        ).length;
        if (childCount === 2) {
          return;
        }
        position = {
          x: parentNode.position.x + (childCount % 2 ? 250 : -250),
          y: parentNode.position.y + 50,
        };
      }
    } else {
      position = { x: 250, y: 50 };
    }

    const newNode: Node = {
      id: newNodeId,
      type: "treeNode",
      position: position || { x: 350, y: 50 },
      data: { value },
    };

    const newEdge = selectedNode
      ? {
          id: `edge-${selectedNode}-${newNodeId}`,
          source: selectedNode,
          target: newNodeId,
          type: "smoothstep",
          animated: true,
        }
      : null;

    set({
      nodes: [...nodes, newNode],
      edges: newEdge ? [...edges, newEdge] : edges,
      maxLeafToNodePath: null,
      maxNodeToNodePath: null,
      selectedNode: newNodeId,
    });
  },

  updateNodeValue: (id, value) => {
    const { nodes } = get();
    set({
      nodes: nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, value } } : node
      ),
      maxLeafToNodePath: null,
      maxNodeToNodePath: null,
    });
  },

  deleteNode: (id) => {
    const { nodes, edges } = get();
    const nodesToDelete = new Set([id]);
    const getChildNodes = (nodeId: string) => {
      edges
        .filter((edge) => edge.source === nodeId)
        .forEach((edge) => {
          nodesToDelete.add(edge.target);
          getChildNodes(edge.target);
        });
    };
    getChildNodes(id);

    set({
      nodes: nodes.filter((node) => !nodesToDelete.has(node.id)),
      edges: edges.filter(
        (edge) =>
          !nodesToDelete.has(edge.source) && !nodesToDelete.has(edge.target)
      ),
      maxLeafToNodePath: null,
      maxNodeToNodePath: null,
    });
  },

  calculatePaths: () => {
    const { nodes, edges } = get();

    // Build tree structure
    const treeNodes = new Map<string, TreeNode>();
    nodes.forEach((node) => {
      treeNodes.set(node.id, {
        id: node.id,
        value: node.data.value,
        children: [],
        parent: null,
      });
    });

    edges.forEach((edge) => {
      const parent = treeNodes.get(edge.source);
      const child = treeNodes.get(edge.target);
      if (parent && child) {
        parent.children.push(child.id);
        child.parent = parent.id;
      }
    });

    // Find root node
    const root = Array.from(treeNodes.values()).find((node) => !node.parent);
    if (!root) return;

    // Helper function to find leaf-to-node maximum path
    const findMaxLeafToNodePath = (
      nodeId: string,
      visited: Set<string>
    ): [number, string[]] => {
      const node = treeNodes.get(nodeId);
      if (!node || visited.has(nodeId)) return [-Infinity, []];

      visited.add(nodeId);

      // If leaf node
      if (node.children.length === 0) {
        return [node.value, [nodeId]];
      }

      let maxSum = -Infinity;
      let maxPath: string[] = [];

      for (const childId of node.children) {
        const [childSum, childPath] = findMaxLeafToNodePath(
          childId,
          new Set(visited)
        );
        if (childSum + node.value > maxSum) {
          maxSum = childSum + node.value;
          maxPath = [nodeId, ...childPath];
        }
      }

      return [maxSum, maxPath];
    };

    // Helper function to find maximum path between any two nodes
    const findMaxPath = (nodeId: string): [number, string[]] => {
      const node = treeNodes.get(nodeId);
      if (!node) return [-Infinity, []];

      let maxSum = node.value;
      let maxPath = [nodeId];

      // Calculate maximum path through current node
      let leftMax = -Infinity;
      let rightMax = -Infinity;
      let leftPath: string[] = [];
      let rightPath: string[] = [];

      if (node.children.length > 0) {
        node.children.forEach((childId) => {
          const [sum, path] = findMaxLeafToNodePath(childId, new Set([nodeId]));
          if (sum > leftMax) {
            leftMax = sum;
            leftPath = path;
          } else if (sum > rightMax) {
            rightMax = sum;
            rightPath = path;
          }
        });
      }

      const throughNodeSum =
        (leftMax > 0 ? leftMax : 0) +
        node.value +
        (rightMax > 0 ? rightMax : 0);
      if (throughNodeSum > maxSum) {
        maxSum = throughNodeSum;
        maxPath = [...leftPath.reverse(), nodeId, ...rightPath];
      }

      // Recursively check all children
      node.children.forEach((childId) => {
        const [childSum, childPath] = findMaxPath(childId);
        if (childSum > maxSum) {
          maxSum = childSum;
          maxPath = childPath;
        }
      });

      return [maxSum, maxPath];
    };

    // Calculate both paths
    const [leafNodeSum, leafNodePath] = findMaxLeafToNodePath(
      root.id,
      new Set()
    );
    const [maxPathSum, maxPathNodes] = findMaxPath(root.id);

    set({
      maxLeafToNodePath: { sum: leafNodeSum, path: leafNodePath },
      maxNodeToNodePath: { sum: maxPathSum, path: maxPathNodes },
    });
  },

  clearPaths: () => set({ maxLeafToNodePath: null, maxNodeToNodePath: null }),
}));

export default useTreeStore;
