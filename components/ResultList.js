// components/ResultList.js

const ResultList = ({ results, onSelectTriangle }) => {
	return (
		<div>
			<h2>Resulting Triangles</h2>
			<ul>
				{results.map((result, index) => (
					<li key={index} onClick={() => onSelectTriangle(result.vertices)}>
						========================================= <br />
						Vertices: {JSON.stringify(result.vertices)} <br />
						Angles: {JSON.stringify(result.angles)} <br />
						Area: {JSON.stringify(result.area)} <br />
						========================================= <br />
					</li>
				))}
			</ul>
		</div>
	)
}

export default ResultList
