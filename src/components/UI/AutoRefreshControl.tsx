import type React from "react";

interface AutoRefreshControlProps {
	autoRefresh: boolean;
	onToggle: () => void;
}

export const AutoRefreshControl: React.FC<AutoRefreshControlProps> = ({
	autoRefresh,
	onToggle,
}) => {
	return (
		<button
			type="button"
			onClick={onToggle}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					onToggle();
				}
			}}
			className={`flex items-center space-x-1 text-xs px-2 py-1 rounded cursor-pointer transition-colors ${
				autoRefresh
					? "bg-cyan-500/30 text-cyan-200"
					: "bg-slate-700/30 text-slate-400 hover:bg-slate-700/40"
			}`}
		>
			<span>自動更新</span>
			<div
				className={`relative w-8 h-4 rounded-full transition-colors ${
					autoRefresh ? "bg-cyan-600" : "bg-slate-700"
				}`}
			>
				<div
					className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full transition-transform ${
						autoRefresh ? "bg-cyan-200 transform translate-x-4" : "bg-slate-400"
					}`}
				/>
			</div>
		</button>
	);
};
