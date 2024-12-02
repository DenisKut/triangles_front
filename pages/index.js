// pages/index.js
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import io from 'socket.io-client';
import ClusterList from '../components/ClusterList';
import ResultList from '../components/ResultList';

const Echarts3D = dynamic(() => import('../components/Echarts3D'), { ssr: false });

const Home = () => {
  const [clusters, setClusters] = useState([]);
  const [selectedClusters, setSelectedClusters] = useState([]);
  const [points, setPoints] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedTriangle, setSelectedTriangle] = useState([]);
  const [localProcessing, setLocalProcessing] = useState(false);

  useEffect(() => {
    const socket = io('http://localhost:3000');

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('scanner', data => {
      setClusters(data);
    });

    socket.on('uploadResult', data => {
      console.log('Received upload result:', data);
      setResults(data.data);
    });

    socket.on('response', data => {
      console.log('Server response:', data);
    });

    socket.emit('setClusters', {
      clusters: selectedClusters,
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedClusters]);

  const handleSelectCluster = (cluster) => {
    setSelectedClusters((prevSelected) => {
      if (prevSelected.some(selected => selected.ip === cluster.ip && selected.port === cluster.port)) {
        return prevSelected.filter(selected => !(selected.ip === cluster.ip && selected.port === cluster.port));
      }
      return [...prevSelected, cluster];
    });
  };

  const handleSelectLocalProcessing = () => {
    setLocalProcessing(!localProcessing);
  };

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const jsonContent = event.target.result;
      setPoints(JSON.parse(jsonContent).points);
      const socket = io('http://localhost:3000');
      socket.emit('uploadJson', { jsonContent });
    };
    reader.readAsText(file);
  };

  const handleSelectTriangle = (vertices) => {
    setSelectedTriangle(vertices);
  };

  return (
    <div style={{ display: 'flex' }}>
      <ClusterList
        clusters={clusters}
        selectedClusters={selectedClusters}
        onSelectCluster={handleSelectCluster}
        onSelectLocalProcessing={handleSelectLocalProcessing}
      />
      <main style={{ flex: 1 }}>
        <h1>Triangle Calculator</h1>
        <input type="file" accept=".json" onChange={(e) => handleFileUpload(e.target.files[0])} />
        <Echarts3D points={points} selectedTriangle={selectedTriangle} />
        <ResultList results={results} onSelectTriangle={handleSelectTriangle} />
      </main>
    </div>
  );
};

export default Home;
