// components/ClusterList.js

// Компонент ClusterList принимает несколько пропсов
// clusters: массив кластеров для отображения
// selectedClusters: массив выбранных кластеров
// onSelectCluster: функция для обработки выбора кластера
// onSelectLocalProcessing: функция для обработки выбора локальной обработки
// localProcessing: булево значение для индикации локальной обработки
const ClusterList = ({
	clusters,
	selectedClusters,
	onSelectCluster,
	onSelectLocalProcessing,
	localProcessing,
}) => {
	return (
		<aside>
			<h2>Clusters</h2>
			<ul>
				{clusters.map((cluster, index) => (
					<li key={index}>
						{/* Чекбокс для выбора кластера */}
						<input
							type='checkbox'
							checked={selectedClusters.some(
								selected =>
									selected.ip === cluster.ip && selected.port === cluster.port
							)}
							onChange={() => onSelectCluster(cluster)}
							disabled={selectedClusters.length > 0 && localProcessing}
						/>
						{/* Отображение IP и порта кластера */}
						{cluster.ip}:{cluster.port}
					</li>
				))}
			</ul>
			<div>
				{/* Чекбокс для выбора локальной обработки */}
				<input
					type='checkbox'
					onChange={onSelectLocalProcessing}
					checked={localProcessing}
					disabled={selectedClusters.length > 0}
				/>
				<label>Local Processing Only</label>
			</div>
		</aside>
	)
}

export default ClusterList
