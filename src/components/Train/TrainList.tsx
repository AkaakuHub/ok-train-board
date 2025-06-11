import React from "react";
import type { DisplayTrain } from "@/types/api";
import { TrainRow } from "@/components/Train/TrainRow";

interface TrainListProps {
	trains: DisplayTrain[];
}

export const TrainList: React.FC<TrainListProps> = ({ trains }) => {
	if (trains.length === 0) {
		return (
			<div className="text-center text-slate-400 py-8">列車はありません</div>
		);
	}

	return (
		<div className="relative">
			{trains.map((train) => (
				<TrainRow key={train.id} train={train} />
			))}
		</div>
	);
};
