import { memo } from 'react';
import { Handle, Position, NodeToolbar } from 'reactflow';
 
function CustomNode ({ data }){
  return (
    <>
      <NodeToolbar isVisible={data.toolbarVisible} position={data.toolbarPosition}>
        <button>delete</button>
        <button>copy</button>
        <button>expand</button>
      </NodeToolbar>
 
      <div style={{ padding: '10px 20px' }}>
        {data.label}
      </div>
 
      <Handle type="target" position={Position.Down} />
      <Handle type="source" position={Position.Up} />
    </>
  );
}
 
export default memo(CustomNode);