import type React from "react";

interface DisplayControlsProps {
	displayCount: number;
	displayCountOptions: number[];
	onDisplayCountChange: (count: number) => void;
}

export const DisplayControls: React.FC<DisplayControlsProps> = ({
	displayCount,
	displayCountOptions,
	onDisplayCountChange,
}) => {
	return (
		<div className="flex items-center space-x-1 bg-slate-800/50 px-2 py-1 rounded-md">
			<span className="text-xs text-slate-400">表示行数:</span>
			<select
				value={displayCount}
				onChange={(e) => onDisplayCountChange(Number(e.target.value))}
				className="bg-slate-700 text-cyan-300 text-xs py-1 px-2 rounded border-none outline-none focus:ring-1 focus:ring-cyan-500 appearance-none w-12 text-center"
				style={{
					WebkitAppearance: "none",
				}}
			>
				{displayCountOptions.map((count) => (
					<option key={count} value={count}>
						{count}
					</option>
				))}
			</select>
		</div>
	);
};
