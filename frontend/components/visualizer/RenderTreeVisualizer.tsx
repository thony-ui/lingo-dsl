/**
 * Render Tree Visualizer Component
 * Single Responsibility: Display interactive render tree visualization
 */

"use client";

import { useEffect, useState } from "react";
import type { TreeNodeData } from "@/lib/engine";
import { Network, Hash, Type, List, FileCode } from "lucide-react";
import { Card } from "@/components/ui/card";

interface RenderTreeVisualizerProps {
  treeData: TreeNodeData | null;
  highlightedNodeIds?: Set<string>;
  onNodeClick?: (nodeId: string) => void;
}

export function RenderTreeVisualizer({
  treeData,
  highlightedNodeIds = new Set(),
  onNodeClick,
}: RenderTreeVisualizerProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Auto-expand root nodes
    if (treeData) {
      setExpandedNodes(new Set([treeData.id]));
    }
  }, [treeData]);

  if (!treeData) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-500">
        <div className="text-center">
          <Network className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No render tree available</p>
        </div>
      </div>
    );
  }

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId);
    onNodeClick?.(nodeId);
  };

  const toggleExpand = (nodeId: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  return (
    <Card className="h-full overflow-auto p-4">
      <div className="space-y-1">
        <TreeNode
          node={treeData}
          depth={0}
          selectedNodeId={selectedNode}
          expandedNodes={expandedNodes}
          highlightedNodeIds={highlightedNodeIds}
          onNodeClick={handleNodeClick}
          onToggleExpand={toggleExpand}
        />
      </div>
    </Card>
  );
}

interface TreeNodeProps {
  node: TreeNodeData;
  depth: number;
  selectedNodeId: string | null;
  expandedNodes: Set<string>;
  highlightedNodeIds: Set<string>;
  onNodeClick: (nodeId: string) => void;
  onToggleExpand: (nodeId: string) => void;
}

function TreeNode({
  node,
  depth,
  selectedNodeId,
  expandedNodes,
  highlightedNodeIds,
  onNodeClick,
  onToggleExpand,
}: TreeNodeProps) {
  const isExpanded = expandedNodes.has(node.id);
  const isSelected = selectedNodeId === node.id;
  const isHighlighted = highlightedNodeIds.has(node.id);
  const hasChildren = node.children.length > 0;

  return (
    <div>
      <div
        className={`
          flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer
          transition-colors duration-150
          ${isSelected ? "bg-violet-100 dark:bg-violet-900/30 border border-violet-300 dark:border-violet-700" : ""}
          ${isHighlighted && !isSelected ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700" : ""}
          ${!isSelected && !isHighlighted ? "hover:bg-zinc-100 dark:hover:bg-zinc-800" : ""}
        `}
        style={{ marginLeft: `${depth * 20}px` }}
        onClick={() => onNodeClick(node.id)}
      >
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(node.id);
            }}
            className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            {isExpanded ? "▼" : "▶"}
          </button>
        )}
        
        {!hasChildren && <span className="w-4" />}

        <NodeIcon type={node.type} />
        
        <span className="font-mono text-sm flex-1">{node.name}</span>

        <NodeMetadataBadges metadata={node.metadata} />
      </div>

      {isExpanded && hasChildren && (
        <div>
          {node.children.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedNodeId={selectedNodeId}
              expandedNodes={expandedNodes}
              highlightedNodeIds={highlightedNodeIds}
              onNodeClick={onNodeClick}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function NodeIcon({ type }: { type: string }) {
  const iconClass = "w-4 h-4";
  
  switch (type) {
    case "root":
      return <FileCode className={`${iconClass} text-violet-600 dark:text-violet-400`} />;
    case "heading":
      return <Type className={`${iconClass} text-blue-600 dark:text-blue-400`} />;
    case "text":
      return <Type className={`${iconClass} text-green-600 dark:text-green-400`} />;
    case "button":
      return <div className={`${iconClass} text-orange-600 dark:text-orange-400 font-bold border rounded`}>B</div>;
    case "input":
      return <Hash className={`${iconClass} text-purple-600 dark:text-purple-400`} />;
    case "conditional":
      return <div className={`${iconClass} text-yellow-600 dark:text-yellow-400 font-bold`}>?</div>;
    case "loop":
      return <List className={`${iconClass} text-pink-600 dark:text-pink-400`} />;
    default:
      return <div className={`${iconClass} bg-zinc-300 rounded`} />;
  }
}

function NodeMetadataBadges({ metadata }: { metadata: TreeNodeData["metadata"] }) {
  return (
    <div className="flex items-center gap-1">
      {metadata.renderCount > 1 && (
        <span className="text-xs px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
          ×{metadata.renderCount}
        </span>
      )}
      
      {metadata.isConditional && (
        <span className="text-xs px-1.5 py-0.5 rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">
          cond
        </span>
      )}
      
      {metadata.stateBindings.length > 0 && (
        <span className="text-xs px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
          {metadata.stateBindings.length} state
        </span>
      )}
    </div>
  );
}
