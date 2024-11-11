import { memo } from "react";

import { Handle, Position } from "reactflow";

import useTreeStore from "@/store/tree-store";

interface TreeNodeProps {
  id: string;
  data: { value: number };
  isConnectable: boolean;
  selected: boolean;
}

const TreeNode = memo(
  ({ id, data, isConnectable, selected }: TreeNodeProps) => {
    const { maxLeafToNodePath, maxNodeToNodePath, selectedNode } =
      useTreeStore();

    const isInLeafPath = maxLeafToNodePath?.path.includes(id);
    const isInNodePath = maxNodeToNodePath?.path.includes(id);

    let borderColor =
      selectedNode === id || selected ? "border-blue-500" : "border-gray-200";
    if (isInLeafPath && isInNodePath) {
      borderColor = "border-purple-500";
    } else if (isInLeafPath) {
      borderColor = "border-green-500";
    } else if (isInNodePath) {
      borderColor = "border-orange-500";
    }

    return (
      <div
        className={`rounded-md border-2 bg-white px-4 py-2 shadow-md ${borderColor}`}
      >
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={isConnectable}
          className="h-3 w-3"
        />
        <div className="text-lg font-bold text-primary-foreground">
          {data.value}
        </div>
        <Handle
          type="source"
          position={Position.Bottom}
          isConnectable={isConnectable}
          className="h-3 w-3"
        />
      </div>
    );
  }
);

TreeNode.displayName = "TreeNode";

export default TreeNode;
