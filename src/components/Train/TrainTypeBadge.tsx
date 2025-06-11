import React from "react";

// 列車種別ごとのカラーマッピング
const trainTypeClasses: Record<string, string> = {
	特急: "bg-gradient-to-br from-red-600 to-red-700 text-white shadow-md",
	急行: "bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-md",
	区間急行:
		"bg-gradient-to-br from-yellow-500 to-yellow-600 text-white shadow-md",
	快速: "bg-gradient-to-br from-blue-800 to-blue-900 text-white shadow-md",
	各駅停車: "bg-gradient-to-br from-gray-500 to-gray-600 text-white shadow-md",
	京王ライナー:
		"bg-gradient-to-br from-pink-700 to-pink-800 text-white shadow-md",
	"Mt.TAKAO":
		"bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md",
	臨時: "bg-gradient-to-br from-gray-700 to-gray-800 text-white shadow-md",
};

interface TrainTypeBadgeProps {
	trainType: string;
}

export const TrainTypeBadge: React.FC<TrainTypeBadgeProps> = ({
	trainType,
}) => {
	const typeClass =
		trainTypeClasses[trainType] ||
		"bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md";

	return (
		<div
			className={`${typeClass} rounded-md px-1 py-1 text-center text-sm font-bold tracking-wider backdrop-blur-sm ring-1 ring-white/10`}
		>
			{trainType}
		</div>
	);
};
