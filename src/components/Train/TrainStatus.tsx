import React from "react";

interface TrainStatusProps {
	isPass: boolean;
	delay: number;
}

export const TrainStatus: React.FC<TrainStatusProps> = ({ isPass, delay }) => {
	return (
		<div className="text-center flex justify-center gap-1 flex-wrap">
			{isPass && (
				<span className="bg-blue-500/20 text-blue-300 px-1.5 rounded-sm font-medium text-xs">
					通過
				</span>
			)}
			{!isPass && delay > 0 && (
				<span className="bg-red-500/20 text-red-300 px-1.5 rounded-sm font-medium text-xs">
					+{delay}分
				</span>
			)}
		</div>
	);
};
