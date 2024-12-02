// components/ClusterList.js

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
						<input
							type='checkbox'
							checked={selectedClusters.some(
								selected =>
									selected.ip === cluster.ip && selected.port === cluster.port
							)}
							onChange={() => onSelectCluster(cluster)}
							disabled={selectedClusters.length > 0 && localProcessing}
						/>
						{cluster.ip}:{cluster.port}
					</li>
				))}
			</ul>
			<div>
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
