// components/Echarts3D.js

// Импорт необходимых компонентов и модулей из echarts и React
import { Line3DChart, Scatter3DChart } from 'echarts-gl/charts'
import {
	Grid3DComponent,
	TooltipComponent,
	VisualMapComponent,
} from 'echarts-gl/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { useEffect, useRef } from 'react'

// Использование компонентов echarts
echarts.use([
	Scatter3DChart,
	Line3DChart,
	Grid3DComponent,
	VisualMapComponent,
	TooltipComponent,
	CanvasRenderer,
])

// Компонент Echarts3D принимает два пропса: points и selectedTriangle
const Echarts3D = ({ points, selectedTriangle }) => {
	const chartRef = useRef(null) // Создаем реф для хранения ссылки на DOM-элемент

	useEffect(() => {
		let chart
		if (chartRef.current) {
			// Разрушаем предыдущий экземпляр графика, если он существует
			if (echarts.getInstanceByDom(chartRef.current)) {
				echarts.dispose(chartRef.current)
			}

			// Инициализируем новый экземпляр графика
			chart = echarts.init(chartRef.current)
			const option = {
				tooltip: {}, // Настройка тултипов
				visualMap: {
					show: false,
					min: 0,
					max: 1,
					inRange: {
						color: ['#0000ff', '#ff0000'], // Цветовая схема
					},
				},
				xAxis3D: {
					type: 'value', // Ось X
				},
				yAxis3D: {
					type: 'value', // Ось Y
				},
				zAxis3D: {
					type: 'value', // Ось Z
				},
				grid3D: {
					viewControl: {
						projection: 'perspective', // Визуализация в перспективе
					},
				},
				series: [
					{
						type: 'scatter3D', // Трехмерная диаграмма рассеяния
						symbolSize: 8, // Размер символов
						data: points, // Данные для графика
						itemStyle: {
							opacity: 0.8, // Прозрачность элементов
						},
						emphasis: {
							label: {
								show: false, // Отключение меток при наведении
							},
						},
					},
				],
			}

			console.log('Selected triangle:', selectedTriangle) // Лог для отладки

			// Добавляем линии для выбранного треугольника
			if (selectedTriangle.length === 3) {
				const triangleData = [...selectedTriangle, selectedTriangle[0]] // Замыкаем треугольник
				console.log('Triangle data for rendering:', triangleData) // Лог для отладки

				// Добавление линии для треугольника
				option.series.push({
					type: 'line3D',
					data: triangleData,
					lineStyle: {
						width: 4,
						color: '#ff0000', // Цвет линии треугольника
					},
				})

				// Добавление точек для треугольника
				option.series.push({
					type: 'scatter3D',
					symbolSize: 12,
					data: selectedTriangle,
					itemStyle: {
						color: '#ff0000', // Цвет точек треугольника
					},
				})
			}

			// Установка опций для графика
			chart.setOption(option)
		}
		return () => {
			// Разрушаем экземпляр графика при размонтировании компонента
			if (chart) {
				echarts.dispose(chart)
			}
		}
	}, [points, selectedTriangle]) // Эффект зависит от points и selectedTriangle

	return <div ref={chartRef} style={{ width: '100%', height: '400px' }} /> // Создаем контейнер для графика
}

export default Echarts3D
