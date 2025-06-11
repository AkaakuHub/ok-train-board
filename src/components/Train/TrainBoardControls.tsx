import type React from "react";
import { CircleLoader } from "@/components/UI/CircleLoader";

interface TrainBoardControlsProps {
	onRefresh?: () => void;
	isRefreshing?: boolean;
	cooldownProgress?: number;
	autoRefresh?: boolean;
	onToggleAutoRefresh?: () => void;
}

export const TrainBoardControls: React.FC<TrainBoardControlsProps> = ({
	onRefresh,
	isRefreshing = false,
	cooldownProgress = 100,
	autoRefresh = false,
	onToggleAutoRefresh,
}) => {
	return (
		<div className="flex items-center space-x-2">
			{/* 自動更新トグル */}
			{onToggleAutoRefresh && (
				<div
					onClick={onToggleAutoRefresh}
					className={`flex items-center space-x-1 text-xs px-2 py-1 rounded cursor-pointer transition-colors ${
						autoRefresh
							? "bg-cyan-500/30 text-cyan-200"
							: "bg-slate-700/30 text-slate-400 hover:bg-slate-700/40"
					}`}
				>
					<span>自動</span>
					<div
						className={`relative w-8 h-4 rounded-full transition-colors ${
							autoRefresh ? "bg-cyan-600" : "bg-slate-700"
						}`}
					>
						<div
							className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full transition-transform ${
								autoRefresh
									? "bg-cyan-200 transform translate-x-4"
									: "bg-slate-400"
							}`}
						/>
					</div>
				</div>
			)}

			{/* 更新ボタン */}
			{onRefresh && (
				<div className="flex items-center space-x-1.5">
					<span className="text-xs text-cyan-300/70">更新</span>
					<button
						onClick={onRefresh}
						disabled={isRefreshing || cooldownProgress < 100}
						className={`relative flex items-center justify-center p-1 rounded-full transition-all
              ${
								cooldownProgress < 100
									? "opacity-70 cursor-not-allowed"
									: "hover:bg-cyan-500/20 active:bg-cyan-600/30"
							}`}
						title={
							cooldownProgress < 100
								? "更新まで少々お待ちください"
								: "今すぐ更新"
						}
					>
						<CircleLoader
							progress={cooldownProgress}
							isActive={cooldownProgress < 100}
							size={32}
							remainingSeconds={10 - (10 * cooldownProgress) / 100}
						/>
					</button>
				</div>
			)}
		</div>
	);
};
