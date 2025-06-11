import type React from "react";

interface TrainBoardFooterProps {
	updatedAt?: string;
}

export const TrainBoardFooter: React.FC<TrainBoardFooterProps> = ({
	updatedAt,
}) => {
	if (!updatedAt) {
		return null;
	}

	return (
		<div className="bg-slate-800/80 text-right text-xs text-slate-400 px-2 py-2 backdrop-blur-sm border-t border-slate-700/30">
			<div className="flex justify-between items-center">
				<div className="text-xs text-slate-400/70">
					<span className="inline-block w-2 h-2 rounded-full bg-cyan-400 mr-1.5" />
					OK TRAIN
				</div>
				<div>データ最終更新: {updatedAt}</div>
			</div>
		</div>
	);
};
