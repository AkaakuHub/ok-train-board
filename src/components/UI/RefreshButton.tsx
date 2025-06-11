import type React from "react";
import { CircleLoader } from "./CircleLoader";

interface RefreshButtonProps {
	onRefresh: () => void;
	isRefreshing: boolean;
	cooldownProgress: number;
}

export const RefreshButton: React.FC<RefreshButtonProps> = ({
	onRefresh,
	isRefreshing,
	cooldownProgress,
}) => {
	return (
		<button
			type="button"
			onClick={onRefresh}
			disabled={isRefreshing || cooldownProgress < 100}
			className={`relative flex items-center justify-center p-1 rounded-full transition-all
        ${
					cooldownProgress < 100
						? "opacity-70 cursor-not-allowed"
						: "hover:bg-cyan-500/20 active:bg-cyan-600/30"
				}`}
			title={
				cooldownProgress < 100 ? "更新まで少々お待ちください" : "今すぐ更新"
			}
		>
			<CircleLoader
				progress={cooldownProgress}
				isActive={cooldownProgress < 100}
				size={32}
				remainingSeconds={10 - (10 * cooldownProgress) / 100}
			/>
		</button>
	);
};
