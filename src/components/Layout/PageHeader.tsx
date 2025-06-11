import type React from "react";
import { DisplayControls } from "../UI/DisplayControls";
import { AutoRefreshControl } from "../UI/AutoRefreshControl";
import { RefreshButton } from "../UI/RefreshButton";

interface PageHeaderProps {
	displayCount: number;
	displayCountOptions: number[];
	onDisplayCountChange: (count: number) => void;
	autoRefresh: boolean;
	onToggleAutoRefresh: () => void;
	onRefresh: () => void;
	isRefreshing: boolean;
	cooldownProgress: number;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
	displayCount,
	displayCountOptions,
	onDisplayCountChange,
	autoRefresh,
	onToggleAutoRefresh,
	onRefresh,
	isRefreshing,
	cooldownProgress,
}) => {
	return (
		<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 px-2">
			<div className="text-sm text-cyan-400 font-medium flex items-center gap-2">
				<span className="inline-block w-2 h-2 rounded-full bg-cyan-400" />
				<span>リアルタイム列車情報</span>
			</div>

			<div className="flex flex-wrap items-center gap-2">
				{/* 表示行数コントロール */}
				<DisplayControls
					displayCount={displayCount}
					displayCountOptions={displayCountOptions}
					onDisplayCountChange={onDisplayCountChange}
				/>

				{/* 自動更新トグル */}
				<AutoRefreshControl
					autoRefresh={autoRefresh}
					onToggle={onToggleAutoRefresh}
				/>

				{/* 更新ボタン */}
				<RefreshButton
					onRefresh={onRefresh}
					isRefreshing={isRefreshing}
					cooldownProgress={cooldownProgress}
				/>
			</div>
		</div>
	);
};
