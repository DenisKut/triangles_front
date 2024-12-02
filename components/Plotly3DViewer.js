// components/Plotly3DViewer.js
import Plot from 'react-plotly.js'

const Plotly3DViewer = ({ points, selectedTriangle }) => {
	const pointData = {
		x: points.map(point => point.x),
		y: points.map(point => point.y),
		z: points.map(point => point.z),
		mode: 'markers',
		type: 'scatter3d',
		marker: { size: 3, color: 'blue' },
	}

	const triangleData =
		selectedTriangle.length === 3
			? [
					{
						x: selectedTriangle
							.map(point => point.x)
							.concat(selectedTriangle[0].x),
						y: selectedTriangle
							.map(point => point.y)
							.concat(selectedTriangle[0].y),
						z: selectedTriangle
							.map(point => point.z)
							.concat(selectedTriangle[0].z),
						mode: 'lines',
						type: 'scatter3d',
						line: { color: 'red', width: 3 },
					},
			  ]
			: []

	return (
		<Plot
			data={[pointData, ...triangleData]}
			layout={{ width: 700, height: 500, title: '3D Scatter Plot' }}
		/>
	)
}

export default Plotly3DViewer
