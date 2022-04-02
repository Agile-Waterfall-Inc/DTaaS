import { DotsVerticalIcon, PlusIcon, XIcon } from '@heroicons/react/outline'
import { FC } from 'react'
import { Handle, Position, Node as ReactFlowNode } from 'react-flow-renderer/nocss'

type NodeData = {
  title: string,
  outgoingHandles: any[],
  incomingHandles: any[],
  filter?: any,
  input?: any,
  output?: any,
  canAddTargetHandle?: boolean;
  onAddedTargetHandle( e: any ): void
};

export type FlooqNode = ReactFlowNode<NodeData>;

export const Node: FC<FlooqNode> = ( { data, children } ) => {
  return (
    <div className="flex w-64 bg-gray-100 dark:bg-gray-900">
      {data.incomingHandles &&
        <div className="w-0 flex flex-col justify-evenly gap-1 relative">
          {data.incomingHandles.map( ( input: any ) => (
            <Handle
              key={input.id}
              id={input.id}
              type="target"
              position={Position.Left}
              className="bg-yellow-400 react-flow__handle--input"
            >
              {input.name}
            </Handle>
          ) )}
          {data.canAddTargetHandle &&
            <div
              onClick={data.onAddedTargetHandle}
              className=" bg-yellow-400 cursor-pointer pointer-events-auto flex justify-center items-center react-flow__add__handle"
            >
              <PlusIcon className="w-3 h-3" />
            </div>
          }
        </div>
      }
      <div className="flex flex-col flex-1 text-gray-900 dark:text-gray-100">
        <div className="p-2 flex justify-between items-center border-b border-gray-200 dark:border-gray-100">
          <span className="custom-drag-handle">
            <DotsVerticalIcon className="w-4 h-4" />
          </span>
          <span className="custom-drag-handle">
            {data.title}
          </span>
          <span className="custom-delete-handle w-4">
            <XIcon className="w-4 h-4" />
          </span>
        </div>
        <div>
          {children}
        </div>
      </div>
      {data.outgoingHandles &&
        <div className="w-2 flex flex-col justify-between gap-1">
          {data.outgoingHandles.map( ( output: any ) => (
            <Handle
              key={output.id}
              id={output.id}
              type="source"
              position={Position.Right}
              className="flex-1 grow bg-yellow-400 w-2 rounded-sm"
            />
          ) )}
        </div>
      }
    </div>
  )
}
