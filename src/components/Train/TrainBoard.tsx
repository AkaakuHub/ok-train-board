import type React from "react";
import type { DisplayTrain } from "@/types/api";
import { TrainBoardHeader } from "@/components/Train/TrainBoardHeader";
import { TrainBoardGridHeader } from "@/components/Train/TrainBoardGridHeader";
import { TrainList } from "@/components/Train/TrainList";
import { TrainBoardFooter } from "@/components/Train/TrainBoardFooter";
import { useTrainSorter } from "@/components/Train/useTrainSorter";

interface TrainBoardProps {
	trains: DisplayTrain[];
	maxDisplayCount?: number;
	title?: string;
	updatedAt?: string;
	onRefresh?: () => void;
	isRefreshing?: boolean;
	cooldownProgress?: number;
	showControls?: boolean; // 制御要素を表示するか
	showFooter?: boolean; // フッター情報を表示するか
}

export const TrainBoard: React.FC<
	TrainBoardProps & {
		autoRefresh?: boolean;
		onToggleAutoRefresh?: () => void;
	}
> = ({
	trains,
	maxDisplayCount = 5,
	title = "到着予定",
	updatedAt,
	onRefresh,
	isRefreshing = false,
	cooldownProgress = 100,
	autoRefresh = false,
	onToggleAutoRefresh,
	showControls = true,
	showFooter = true,
}) => {
	const sortedTrains = useTrainSorter(trains);
	const trainsToDisplay = sortedTrains.slice(0, maxDisplayCount);

	return (
		<div className="bg-slate-900/90 backdrop-blur-md text-white rounded-xl overflow-hidden ring-1 ring-cyan-500/30 shadow-lg shadow-cyan-900/20 w-full">
			<TrainBoardHeader
				title={title}
				showControls={showControls}
				onRefresh={onRefresh}
				isRefreshing={isRefreshing}
				cooldownProgress={cooldownProgress}
				autoRefresh={autoRefresh}
				onToggleAutoRefresh={onToggleAutoRefresh}
			/>

			<TrainBoardGridHeader />

			<div className="backdrop-blur-md bg-gradient-to-b from-slate-900/90 to-slate-800/90 relative">
				<TrainList trains={trainsToDisplay} />
			</div>

			{showFooter && <TrainBoardFooter updatedAt={updatedAt} />}
		</div>
	);
};
