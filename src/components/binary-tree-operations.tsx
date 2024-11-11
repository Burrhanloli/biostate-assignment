"use client";

import { useCallback, useMemo, useRef, useState } from "react";

import dagre from "@dagrejs/dagre";
import { Plus } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactFlow, {
  Background,
  Connection,
  ConnectionLineType,
  Controls,
  Edge,
  Handle,
  Node,
  NodeToolbar,
  Panel,
  Position,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodeId,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const nodeWidth = 150;
const nodeHeight = 40;

export function BinaryTreeOperations() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getLayoutedElements = useCallback((nodes: any[], edges: any[]) => {
    dagreGraph.setGraph({ rankdir: "TB" });
    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const newNodes = nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      const newNode = {
        ...node,
        type: "node-with-toolbar",
        targetPosition: "top",
        sourcePosition: "bottom",
        // We are shifting the dagre node position (anchor=center center) to the top left
        // so it matches the React Flow node anchor point (top left).
        position: {
          x: nodeWithPosition.x - nodeWidth / 2,
          y: nodeWithPosition.y - nodeHeight / 2,
        },
      };

      return newNode;
    });

    return { nodes: newNodes, edges };
  }, []);

  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(
    () => getLayoutedElements(initialNodes, initialEdges),
    [getLayoutedElements]
  );

  const NodeWithToolbar = ({ data }) => {
    const nodeId = useNodeId();

    const onClick = () => {
      const newNode: Node = {
        type: "node-with-toolbar",
        id: nodeIdCounter.current.toString(),
        data: { label: `${Math.floor(Math.random() * 10)}` },
        position: { x: Math.random() * 250, y: Math.random() * 250 },
      };

      setNodes((nds) => nds.concat(newNode));

      setEdges((eds) =>
        addEdge(
          {
            id: `e${Math.floor(Math.random() * 100 * Math.random())}`,
            source: nodeId!,
            target: newNode.id,
            type: ConnectionLineType.SmoothStep,
            animated: true,
          },
          eds
        )
      );
      nodeIdCounter.current++;
    };

    return (
      <>
        <NodeToolbar isVisible position={Position.Right}>
          <Button
            onClick={onClick}
            variant="outline"
            size="sm"
            className="m-0 p-1 px-2"
          >
            <Plus />
          </Button>
        </NodeToolbar>
        <div className="react-flow__node-default">{data?.label}</div>
        <Handle type="target" position={Position.Top} />
        <Handle type="source" position={Position.Bottom} />
      </>
    );
  };

  const nodeTypes = useMemo(
    () => ({
      "node-with-toolbar": NodeWithToolbar,
    }),
    []
  );
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  const [rootNodeAdded, setRootNodeAdded] = useState(false);
  const nodeIdCounter = useRef(1);

  const onConnect = useCallback(
    (params: Edge | Connection) =>
      setEdges((eds) =>
        addEdge(
          { ...params, type: ConnectionLineType.SmoothStep, animated: true },
          eds
        )
      ),
    [setEdges]
  );

  const addNode = useCallback(() => {
    const newNode: Node = {
      type: "node-with-toolbar",
      id: nodeIdCounter.current.toString(),
      data: { label: `${Math.floor(Math.random() * 100)}` },
      position: { x: Math.random() * 250, y: Math.random() * 250 },
    };
    setNodes((nds) => nds.concat(newNode));
    nodeIdCounter.current++;
    setRootNodeAdded(true);
  }, [setNodes]);

  const onLayout = useCallback(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges
    );

    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges]);
  }, [getLayoutedElements, nodes, edges, setNodes, setEdges]);

  return (
    <ReactFlowProvider>
      <Card className="m-4">
        <CardHeader>
          <CardTitle>Binary Tree Operations</CardTitle>
          <CardDescription>Build and analyze binary trees</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            {!rootNodeAdded && <Button onClick={addNode}>Add Root Node</Button>}
          </div>
        </CardContent>
      </Card>
      <div className="h-[700px] border-2 bg-white">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          snapToGrid
          nodeTypes={nodeTypes}
          connectionLineType={ConnectionLineType.SmoothStep}
        >
          <Panel position="top-right">
            <Button variant="secondary" onClick={() => onLayout()}>
              Arrange
            </Button>
          </Panel>
          <Background color="#ccc" />
          <Controls />
        </ReactFlow>
      </div>
      <ToastContainer position="bottom-right" />
    </ReactFlowProvider>
  );
}
