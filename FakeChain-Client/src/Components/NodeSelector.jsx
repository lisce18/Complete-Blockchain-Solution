import React, { useEffect, useState } from 'react';

const NodeSelector = ({ nodes, setDynamicPort }) => {
  const [selectedNode, setSelectedNode] = useState('');

  const changeNode = (e) => {
    const nodeNumber = e.target.value;
    setSelectedNode(nodeNumber);
    setDynamicPort(nodeNumber);
  };

  return (
    <div className='dropdown-container'>
      <select
        id='nodeSelector'
        value={selectedNode}
        onChange={changeNode}
        className='dropdown'
      >
        <option value=''>Select a node</option>
        {nodes.map((node, index) => {
          return (
            <option
              key={index}
              value={node.address}
            >
              Node {index + 1}: {node.address}
            </option>
          );
        })}
      </select>

      <p className='node'>You are running on Node: {selectedNode}</p>
    </div>
  );
};

export default NodeSelector;
