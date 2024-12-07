// components/ResultList.js

// Компонент ResultList принимает два пропса:
// results: массив результатов, содержащий треугольники с их свойствами
// onSelectTriangle: функция для обработки выбора треугольника
const ResultList = ({ results, onSelectTriangle }) => {
	return (
		<div>
			<h2>Resulting Triangles</h2>
			<ul>
				{results.map((result, index) => (
					// Элемент списка для каждого результата
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
