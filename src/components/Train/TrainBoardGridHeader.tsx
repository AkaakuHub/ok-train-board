import type React from "react";

export const TrainBoardGridHeader: React.FC = () => {
	return (
		<div className="grid grid-cols-[4rem_6rem_1fr_3rem_auto] gap-1 mt-2 text-xs font-medium text-cyan-300/70">
			<div className="text-center">時刻</div>
			<div className="text-center">種別</div>
			<div className="text-center">行先</div>
			<div className="text-center">備考</div>
		</div>
	);
};
