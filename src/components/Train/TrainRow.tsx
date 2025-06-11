import React from "react";
import clsx from "clsx";
import type { DisplayTrain } from "@/types/api";
import { TrainTypeBadge } from "@/components/Train/TrainTypeBadge";
import { TrainStatus } from "@/components/Train/TrainStatus";

interface TrainRowProps {
	train: DisplayTrain;
}

export const TrainRow: React.FC<TrainRowProps> = ({ train }) => {
	return (
		<div className="grid grid-cols-[4rem_6rem_1fr_3rem_auto] gap-1 items-center py-2 px-2 border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
			<div
				className={clsx(
					"text-center text-lg font-mono tabular-nums font-semibold",
					train.delay > 0 ? "text-red-400" : "text-white/90",
				)}
			>
				{train.time}
			</div>

			<TrainTypeBadge trainType={train.trainType} />

			<div className="text-base font-semibold tracking-wide text-white/90 text-center mx-auto truncate">
				{train.destination}
			</div>

			<TrainStatus isPass={train.isPass} delay={train.delay} />

			{train.note && (
				<div className="col-span-full text-xs text-emerald-400/90 mt-1 text-center font-medium">
					{train.note}
				</div>
			)}
		</div>
	);
};
