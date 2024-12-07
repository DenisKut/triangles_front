import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'
import ClusterList from '../components/ClusterList'
import ResultList from '../components/ResultList'

// Динамическая загрузка компонента Plotly3DViewer
const Plotly3DViewer = dynamic(() => import('../components/Plotly3DViewer'), {
	ssr: false, // Отключение серверного рендеринга для этого компонента
})

const Home = () => {
	// Состояния для хранения данных
	const [clusters, setClusters] = useState([]) // Кластеры
	const [selectedClusters, setSelectedClusters] = useState([]) // Выбранные кластеры
	const [points, setPoints] = useState([]) // Точки
	const [results, setResults] = useState([]) // Результаты
	const [selectedTriangle, setSelectedTriangle] = useState([]) // Выбранный треугольник
	const [localProcessing, setLocalProcessing] = useState(false) // Флаг для локальной обработки
	const [fileContent, setFileContent] = useState('') // Содержимое файла
	const [socket, setSocket] = useState(null) // Сокет
	const [executionTime, setExecutionTime] = useState(0) // Новое состояние для времени выполнения
	const startTimeRef = useRef(0) // Хук useRef для хранения времени начала

	// useEffect для настройки сокета и прослушивания событий
	useEffect(() => {
		const newSocket = io('http://localhost:3000', {
			reconnectionAttempts: 5,
			reconnectionDelay: 1000,
		})

		newSocket.on('connect', () => {
			console.log('Connected to server')
		})

		newSocket.on('scanner', data => {
			console.log('Received scanner data:', data)
			setClusters(data)
		})

		newSocket.on('uploadResult', data => {
			console.log('Received upload result:', data)
			if (data && data.data) {
				setResults(data.data)
				console.log('Results set:', data.data)
				const endTime = performance.now()
				setExecutionTime(endTime - startTimeRef.current) // Установка времени выполнения
			} else {
				console.log('No results received')
			}
		})

		newSocket.on('response', data => {
			console.log('Server response:', data)
		})

		newSocket.on('error', error => {
			console.error('Socket error:', error)
		})

		newSocket.on('disconnect', reason => {
			console.warn('Socket disconnected:', reason)
		})

		newSocket.emit('setClusters', {
			clusters: selectedClusters,
		})

		setSocket(newSocket)

		return () => {
			newSocket.disconnect()
		}
	}, [selectedClusters])

	// Обработчик выбора кластера
	const handleSelectCluster = cluster => {
		setSelectedClusters(prevSelected => {
			if (
				prevSelected.some(
					selected =>
						selected.ip === cluster.ip && selected.port === cluster.port
				)
			) {
				return prevSelected.filter(
					selected =>
						!(selected.ip === cluster.ip && selected.port === cluster.port)
				)
			}
			return [...prevSelected, cluster]
		})
	}

	// Обработчик выбора локальной обработки
	const handleSelectLocalProcessing = () => {
		setLocalProcessing(!localProcessing)
	}

	// Обработчик изменения файла
	const handleFileChange = file => {
		const reader = new FileReader()
		reader.onload = event => {
			setFileContent(event.target.result)
			console.log('File content set:', event.target.result)
		}
		reader.readAsText(file)
	}

	// Обработчик загрузки файла
	const handleFileUpload = () => {
		if (!fileContent || !socket) return

		setPoints(JSON.parse(fileContent).points)
		console.log('Points set:', JSON.parse(fileContent).points)
		startTimeRef.current = performance.now() // Начало замера времени
		socket.emit('uploadJson', { jsonContent: fileContent })
		console.log('File uploaded with content:', fileContent)
	}

	// Обработчик выбора треугольника
	const handleSelectTriangle = vertices => {
		setSelectedTriangle(vertices)
		console.log('Selected triangle:', vertices)
	}

	return (
		<div style={{ display: 'flex' }}>
			<ClusterList
				clusters={clusters}
				selectedClusters={selectedClusters}
				onSelectCluster={handleSelectCluster}
				onSelectLocalProcessing={handleSelectLocalProcessing}
				localProcessing={localProcessing}
			/>
			<main style={{ flex: 1 }}>
				<h1>Triangle Calculator</h1>
				<input
					type='file'
					accept='.json'
					onChange={e => handleFileChange(e.target.files[0])}
				/>
				<button onClick={handleFileUpload}>Send Data</button>
				<p>Execution Time: {executionTime.toFixed(2)} ms</p>{' '}
				{/* Отображение времени выполнения */}
				<Plotly3DViewer points={points} selectedTriangle={selectedTriangle} />
				<ResultList results={results} onSelectTriangle={handleSelectTriangle} />
			</main>
		</div>
	)
}

export default Home
