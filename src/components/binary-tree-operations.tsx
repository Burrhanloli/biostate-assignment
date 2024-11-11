"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import Dagre from "@dagrejs/dagre";
import {
  CalculatorIcon,
  MessageSquareWarning,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useSession } from "next-auth/react";
import "react-toastify/dist/ReactToastify.css";
import ReactFlow, {
  Background,
  ConnectionLineType,
  Edge,
  Controls as FlowControls,
  Node,
  Panel,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";

import {
  fetchHistory,
  saveResult,
} from "@/app/(protected)/binary-tree-path/actions";
import TreeNode from "@/components/tree-node";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BinaryTreePathSelectSchema } from "@/db/schema/binary-tree-path";
import useTreeStore from "@/store/tree-store";
import { toast } from "@/utils/toast";

import { Controls } from "./controls";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

const nodeTypes = {
  treeNode: TreeNode,
};
const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "TB" });

  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  nodes.forEach((node) =>
    g.setNode(node.id, {
      ...node,
      width: 150,
      height: 50,
    })
  );

  Dagre.layout(g);

  return {
    nodes: nodes.map((node) => {
      const position = g.node(node.id);
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      const x = position.x - 150 / 2;
      const y = position.y - 50 / 2;

      return { ...node, position: { x, y } };
    }),
    edges,
  };
};

const LayoutView = () => {
  const { data: session } = useSession({
    required: true,
  });
  const [newValue, setNewValue] = useState<string>("");
  const {
    edges,
    addNode,
    deleteNode,
    calculatePaths,
    clearPaths,
    nodes,
    maxLeafToNodePath,
    maxNodeToNodePath,
    setSelectedNode,
    selectedNode,
  } = useTreeStore();
  const { fitView } = useReactFlow();

  const [reactFlowNodes, setReactFlowNodes, onNodesChange] = useNodesState([]);
  const [reactFlowEdges, setReactFlowEdges, onEdgesChange] = useEdgesState([]);

  const [historyData, setHistoryData] = useState<
    BinaryTreePathSelectSchema[] | null
  >(null);

  const onSave = async () => {
    const treeData = {
      nodes: nodes,
      edges: edges,
    };

    if (!maxLeafToNodePath || !maxNodeToNodePath) {
      return;
    }

    const response = await saveResult({
      data: treeData,
      maxLeafToNode: {
        ...maxLeafToNodePath,
        path: maxLeafToNodePath.path
          .map((node) => nodes.find((rfNode) => rfNode.id === node))!
          .map((rfNode) => rfNode?.data.value),
      },
      maxNodeToNode: {
        ...maxNodeToNodePath,
        path: maxNodeToNodePath.path
          .map((node) => nodes.find((rfNode) => rfNode.id === node))!
          .map((rfNode) => rfNode?.data.value),
      },
      userId: session!.user!.id!,
    });
    toast(response);
    fetchHistory().then((value) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setHistoryData(value as any);
    });
  };

  useEffect(() => {
    fetchHistory().then((value) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setHistoryData(value as any);
    });
  }, []);

  // Sync Zustand store with React Flow state
  useEffect(() => {
    setReactFlowNodes(nodes);
    setReactFlowEdges(edges);
  }, [nodes, edges, setReactFlowNodes, setReactFlowEdges]);

  const onLayout = useCallback(() => {
    const layouted = getLayoutedElements(nodes, edges);

    setReactFlowNodes([...layouted.nodes]);
    setReactFlowEdges([...layouted.edges]);

    window.requestAnimationFrame(() => {
      fitView();
    });
  }, [nodes, edges, setReactFlowNodes, setReactFlowEdges, fitView]);

  useEffect(() => {
    onLayout();
    fitView();
  }, [fitView, onLayout]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNode(node.id);
    },
    [setSelectedNode]
  );

  const onPaneClick = useCallback(() => {
    fitView();
  }, [fitView]);

  const handleAddNode = () => {
    const value = parseInt(newValue);
    if (!isNaN(value)) {
      addNode(value);
      setNewValue("");
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleAddNode();
    }
  };
  return (
    <>
      <Card className="m-4">
        <CardHeader>
          <CardTitle>Binary Tree Operations</CardTitle>
          <CardDescription>Build and analyze binary trees</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <MessageSquareWarning size={25} />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
              To add a child node you need to select the parent node firt and
              then enter the value in the input and click add button this will
              create the child node.
            </AlertDescription>
          </Alert>
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Node value"
            />
            <Button onClick={handleAddNode} title="Add node">
              Add
              <Plus size={20} />
            </Button>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => selectedNode && deleteNode(selectedNode)}
              disabled={!selectedNode}
              title="Delete selected node"
              variant="destructive"
            >
              Delete
              <Trash2 size={20} />
            </Button>

            <Button
              onClick={calculatePaths}
              variant="outline"
              title="Calculate paths"
              disabled={reactFlowNodes.length < 2}
            >
              Calculate path
              <CalculatorIcon size={20} />
            </Button>
            <Button
              onClick={clearPaths}
              variant="outline"
              title="Clear paths"
              disabled={reactFlowNodes.length < 2}
            >
              Clear path
              <RefreshCw size={20} />
            </Button>
            <Button
              onClick={onSave}
              disabled={!maxLeafToNodePath || !maxNodeToNodePath}
            >
              Save Result
            </Button>
            <div className="flex items-end justify-end">
              <Sheet>
                <SheetTrigger className="hover:text-accent-foregroundinline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
                  History
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Previous operations</SheetTitle>
                    <SheetDescription>
                      View all your previour operations
                    </SheetDescription>
                  </SheetHeader>
                  <Separator className="my-4" />
                  <ScrollArea className="h-[calc(100dvh-120px)]">
                    <div className="flex flex-col gap-2">
                      {historyData?.map((value, index) => (
                        <Card key={index}>
                          <CardHeader>
                            <Button asChild variant="link" size="sm">
                              <Link
                                prefetch
                                href={`/binary-tree-path/${value.id}`}
                              >
                                View Operation
                              </Link>
                            </Button>
                          </CardHeader>
                          <CardContent>
                            Max Leaf-to-Node sum was {value.maxLeafToNode.sum}
                            <CardDescription>
                              Path: {value.maxLeafToNode.path.join(" → ")}
                            </CardDescription>
                          </CardContent>
                          <CardContent>
                            Max Node-to-Node sum was {value.maxNodeToNode.sum}
                            <CardDescription>
                              Path: {value.maxNodeToNode.path.join(" → ")}
                            </CardDescription>
                          </CardContent>
                          <CardFooter className="text-muted-foreground">
                            {/* @ts-expect-error user.email is custom property */}
                            {value.user.email}
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          {(maxLeafToNodePath || maxNodeToNodePath) && (
            <div className="space-y-2 text-sm">
              {maxLeafToNodePath && (
                <div className="rounded bg-green-100 p-2 text-primary-foreground">
                  <div className="font-semibold text-primary-foreground">
                    Max Leaf-to-Node Path Sum:{" "}
                    <strong className="text-2xl">
                      {maxLeafToNodePath.sum}
                    </strong>
                  </div>
                  <div className="mt-1 text-xl text-primary-foreground">
                    Path:{" "}
                    {maxLeafToNodePath.path
                      .map((id) => {
                        const node = nodes.find((n) => n.id === id);
                        return node ? node.data.value : "";
                      })
                      .join(" → ")}
                  </div>
                </div>
              )}
              {maxNodeToNodePath && (
                <div className="rounded bg-orange-100 p-2">
                  <div className="font-semibold text-primary-foreground">
                    Max Node-to-Node Path Sum:{" "}
                    <strong className="text-2xl">
                      {maxNodeToNodePath.sum}
                    </strong>
                  </div>
                  <div className="mt-1 text-xl text-primary-foreground">
                    Path:{" "}
                    {maxNodeToNodePath.path
                      .map((id) => {
                        const node = nodes.find((n) => n.id === id);
                        return node ? node.data.value : "";
                      })
                      .join(" → ")}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      <div className="m-4 h-[640px] border-2 bg-white">
        <ReactFlow
          nodes={reactFlowNodes}
          edges={reactFlowEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          fitView
          snapToGrid
          nodeTypes={nodeTypes}
          connectionLineType={ConnectionLineType.SmoothStep}
        >
          <Background />
          <FlowControls />
          <Panel position="top-left">
            <Controls />
          </Panel>
        </ReactFlow>
      </div>
    </>
  );
};

export function BinaryTreeOperationsNew() {
  return (
    <ReactFlowProvider>
      <LayoutView />
    </ReactFlowProvider>
  );
}
