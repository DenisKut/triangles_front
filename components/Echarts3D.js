// components/Echarts3D.js
import React, { useEffect, useRef } from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts-gl';

const Echarts3D = ({ points, selectedTriangle }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);
      const option = {
        tooltip: {},
        visualMap: {
          show: false,
          min: 0,
          max: 1,
          inRange: {
            color: ['#0000ff', '#ff0000']
          }
        },
        xAxis3D: {
          type: 'value'
        },
        yAxis3D: {
          type: 'value'
        },
        zAxis3D: {
          type: 'value'
        },
        grid3D: {
          viewControl: {
            projection: 'perspective'
          }
        },
        series: [{
          type: 'scatter3D',
          symbolSize: 8,
          data: points,
          itemStyle: {
            opacity: 0.8
          },
          emphasis: {
            label: {
              show: false
            }
          }
        }, {
          type: 'line3D',
          data: selectedTriangle,
          lineStyle: {
            width: 4
          }
        }]
      };
      chart.setOption(option);
    }
  }, [points, selectedTriangle]);

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
};

export default Echarts3D;
