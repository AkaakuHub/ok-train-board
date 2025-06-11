import type React from "react";
import { FaRegClock } from "react-icons/fa";

export const LoadingDisplay: React.FC = () => {
	return (
		<div className="text-center py-16 space-y-4">
			<FaRegClock size={48} className="animate-spin mx-auto text-cyan-400" />
			<div className="text-lg font-medium text-cyan-300">
				列車データを読み込み中...
			</div>
		</div>
	);
};
