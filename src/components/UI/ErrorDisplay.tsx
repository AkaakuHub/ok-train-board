import type React from "react";
import { MdErrorOutline } from "react-icons/md";

interface ErrorDisplayProps {
	error: string;
	onRetry: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
	error,
	onRetry,
}) => {
	return (
		<div className="text-center text-red-400 py-16 space-y-4">
			<MdErrorOutline size={48} />
			<div className="text-lg font-medium">{error}</div>
			<button
				type="button"
				onClick={onRetry}
				className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-md transition-colors"
			>
				再試行
			</button>
		</div>
	);
};
