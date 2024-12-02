// components/Echarts3D.js
import { Line3DChart, Scatter3DChart } from 'echarts-gl/charts'
import {
	Grid3DComponent,
	TooltipComponent,
	VisualMapComponent,
} from 'echarts-gl/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { useEffect, useRef } from 'react'

echarts.use([
	Scatter3DChart,
	Line3DChart,
	Grid3DComponent,
	VisualMapComponent,
	TooltipComponent,
	CanvasRenderer,
])

const Echarts3D = ({ points, selectedTriangle }) => {
	const chartRef = useRef(null)

	useEffect(() => {
		let chart
		if (chartRef.current) {
			// Разрушаем предыдущий экземпляр графика, если он существует
			if (echarts.getInstanceByDom(chartRef.current)) {
				echarts.dispose(chartRef.current)
			}

			chart = echarts.init(chartRef.current)
			const option = {
				tooltip: {},
				visualMap: {
					show: false,
					min: 0,
					max: 1,
					inRange: {
						color: ['#0000ff', '#ff0000'],
					},
				},
				xAxis3D: {
					type: 'value',
				},
				yAxis3D: {
					type: 'value',
				},
				zAxis3D: {
					type: 'value',
				},
				grid3D: {
					viewControl: {
						projection: 'perspective',
					},
				},
				series: [
					{
						type: 'scatter3D',
						symbolSize: 8,
						data: points,
						itemStyle: {
							opacity: 0.8,
						},
						emphasis: {
							label: {
								show: false,
							},
						},
					},
				],
			}

			console.log('Selected triangle:', selectedTriangle)

			// Добавляем линии для выбранного треугольника
			if (selectedTriangle.length === 3) {
				const triangleData = [...selectedTriangle, selectedTriangle[0]] // Замыкаем треугольник
				console.log('Triangle data for rendering:', triangleData)

				option.series.push({
					type: 'line3D',
					data: triangleData,
					lineStyle: {
						width: 4,
						color: '#ff0000',
					},
				})

				option.series.push({
					type: 'scatter3D',
					symbolSize: 12,
					data: selectedTriangle,
					itemStyle: {
						color: '#ff0000',
					},
				})
			}

			chart.setOption(option)
		}
		return () => {
			// Разрушаем экземпляр графика при размонтировании компонента
			if (chart) {
				echarts.dispose(chart)
			}
		}
	}, [points, selectedTriangle])

	return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
}

export default Echarts3D
