import type { ArrivalsResponse, ArrivalTrain, DisplayTrain } from "@/types/api";

/**
 * APIの到着列車データをDisplayTrain型に変換する
 * @param data APIレスポンス
 * @returns 表示用の整形されたデータ
 */
export const convertToDisplayTrains = (
	data: ArrivalsResponse,
): DisplayTrain[] => {
	if (!data?.arrivingTrains) return [];

	return data.arrivingTrains.map((train: ArrivalTrain, index: number) => ({
		id: `${train.trainNumber}-${index}`,
		time: train.estimatedDeparture,
		trainType: train.type.name,
		iconName: train.type.iconName || train.type.name,
		destination: train.destination.name,
		direction: train.direction,
		delay: train.delay,
		isPass: train.passType === "通過",
		note: train.information,
	}));
};

/**
 * 列車データを上り/下りに分類する
 * @param trains 表示用列車データ
 * @returns 上り/下りに分類された列車データ
 */
export const categorizeTrainsByDirection = (trains: DisplayTrain[]) => {
	if (!trains.length) return { inboundTrains: [], outboundTrains: [] };

	return trains.reduce(
		(acc, train) => {
			if (train.direction === "上り") {
				acc.inboundTrains.push(train);
			} else {
				acc.outboundTrains.push(train);
			}
			return acc;
		},
		{
			inboundTrains: [] as DisplayTrain[],
			outboundTrains: [] as DisplayTrain[],
		},
	);
};
