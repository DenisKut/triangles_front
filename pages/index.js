// pages/index.js
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import ClusterList from '../components/ClusterList'
import ResultList from '../components/ResultList'

const Plotly3DViewer = dynamic(() => import('../components/Plotly3DViewer'), {
	ssr: false,
})

const Home = () => {
	const [clusters, setClusters] = useState([])
	const [selectedClusters, setSelectedClusters] = useState([])
	const [points, setPoints] = useState([])
	const [results, setResults] = useState([])
	const [selectedTriangle, setSelectedTriangle] = useState([])
	const [localProcessing, setLocalProcessing] = useState(false)
	const [fileContent, setFileContent] = useState('')
	const [socket, setSocket] = useState(null)

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

	const handleSelectLocalProcessing = () => {
		setLocalProcessing(!localProcessing)
	}

	const handleFileChange = file => {
		const reader = new FileReader()
		reader.onload = event => {
			setFileContent(event.target.result)
			console.log('File content set:', event.target.result)
		}
		reader.readAsText(file)
	}

	const handleFileUpload = () => {
		if (!fileContent || !socket) return

		setPoints(JSON.parse(fileContent).points)
		console.log('Points set:', JSON.parse(fileContent).points)
		socket.emit('uploadJson', { jsonContent: fileContent })
		console.log('File uploaded with content:', fileContent)
	}

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
				<Plotly3DViewer points={points} selectedTriangle={selectedTriangle} />
				<ResultList results={results} onSelectTriangle={handleSelectTriangle} />
			</main>
		</div>
	)
}

export default Home
