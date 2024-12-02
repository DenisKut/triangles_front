// components/ClusterList.js
import React from 'react';

const ClusterList = ({ clusters, selectedClusters, onSelectCluster, onSelectLocalProcessing }) => {
  return (
    <aside>
      <h2>Clusters</h2>
      <ul>
        {clusters.map((cluster, index) => (
          <li key={index}>
            <input
              type="checkbox"
              checked={selectedClusters.some(selected => selected.ip === cluster.ip && selected.port === cluster.port)}
              onChange={() => onSelectCluster(cluster)}
            />
            {cluster.ip}:{cluster.port}
          </li>
        ))}
      </ul>
      <div>
        <input
          type="checkbox"
          onChange={onSelectLocalProcessing}
        />
        <label>Local Processing Only</label>
      </div>
    </aside>
  );
};

export default ClusterList;
