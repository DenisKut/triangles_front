// components/Plotly3DViewer.js

// Импорт компонента Plot из библиотеки react-plotly.js
import Plot from 'react-plotly.js'

// Компонент Plotly3DViewer принимает два пропса: points и selectedTriangle
const Plotly3DViewer = ({ points, selectedTriangle }) => {
	// Формирование данных для точек
	const pointData = {
		x: points.map(point => point.x), // Координаты X для точек
		y: points.map(point => point.y), // Координаты Y для точек
		z: points.map(point => point.z), // Координаты Z для точек
		mode: 'markers', // Режим отображения - маркеры
		type: 'scatter3d', // Трехмерная диаграмма рассеяния
		marker: { size: 3, color: 'blue' }, // Настройки маркеров: размер и цвет
	}

	// Формирование данных для треугольника, если выбранные точки образуют треугольник
	const triangleData =
		selectedTriangle.length === 3
			? [
					{
						x: selectedTriangle
							.map(point => point.x)
							.concat(selectedTriangle[0].x), // Добавляем первую точку для замыкания треугольника
						y: selectedTriangle
							.map(point => point.y)
							.concat(selectedTriangle[0].y), // Добавляем первую точку для замыкания треугольника
						z: selectedTriangle
							.map(point => point.z)
							.concat(selectedTriangle[0].z), // Добавляем первую точку для замыкания треугольника
						mode: 'lines', // Режим отображения - линии
						type: 'scatter3d', // Трехмерная диаграмма рассеяния
						line: { color: 'red', width: 3 }, // Настройки линий: цвет и ширина
					},
			  ]
			: []

	return (
		<Plot
			data={[pointData, ...triangleData]} // Данные для графика: точки и треугольник
			layout={{ width: 700, height: 500, title: '3D Scatter Plot' }} // Настройки компоновки графика
		/>
	)
}

export default Plotly3DViewer
