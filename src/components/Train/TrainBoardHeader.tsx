import React from "react";
import { TrainBoardControls } from "@/components/Train/TrainBoardControls";

interface TrainBoardHeaderProps {
	title: string;
	showControls?: boolean;
	onRefresh?: () => void;
	isRefreshing?: boolean;
	cooldownProgress?: number;
	autoRefresh?: boolean;
	onToggleAutoRefresh?: () => void;
}

export const TrainBoardHeader: React.FC<TrainBoardHeaderProps> = ({
	title,
	showControls = true,
	onRefresh,
	isRefreshing = false,
	cooldownProgress = 100,
	autoRefresh = false,
	onToggleAutoRefresh,
}) => {
	return (
		<div className="relative bg-gradient-to-r from-slate-800 to-slate-900 px-2 py-3 border-b border-cyan-500/30">
			<div className="flex justify-between items-center">
				<div className="flex items-center space-x-2">
					<div className="w-2 h-6 bg-cyan-400 rounded-full"></div>
					<h3 className="text-sm font-bold tracking-wider uppercase text-white/90">
						{title}
					</h3>
				</div>

				{showControls && (
					<TrainBoardControls
						onRefresh={onRefresh}
						isRefreshing={isRefreshing}
						cooldownProgress={cooldownProgress}
						autoRefresh={autoRefresh}
						onToggleAutoRefresh={onToggleAutoRefresh}
					/>
				)}
			</div>
		</div>
	);
};
