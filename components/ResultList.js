// components/ResultList.js
import React from 'react';

const ResultList = ({ results, onSelectTriangle }) => {
  return (
    <div>
      <h2>Resulting Triangles</h2>
      <ul>
        {results.map((result, index) => (
          <li key={index} onClick={() => onSelectTriangle(result.vertices)}>
            Vertices: {JSON.stringify(result.vertices)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResultList;
