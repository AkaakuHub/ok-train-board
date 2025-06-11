// TODO: openapi-typescriptでやり直す

/**
 * 京王電鉄リアルタイム運行情報API型定義
 * swagger.jsonから生成された型情報
 */

// 共通型定義
export interface TrainType {
	code: string;
	name: string;
	iconName: string;
}

export interface Destination {
	code: string;
	name: string;
}

export interface Position {
	ID: string;
	name: string;
	kind: string;
	max_disp?: string;
}

// API: /api/trains/arrivals/{stationIdOrName}
export interface ArrivalTrain {
	trainNumber: string;
	type: TrainType;
	direction: string;
	destination: Destination;
	delay: number;
	estimatedDeparture: string;
	isInStation: boolean;
	passType: string;
	information: string | null;
}

export interface ArrivalsResponse {
	stationId: string;
	stationName: string;
	updatedAt: string;
	arrivingTrains: ArrivalTrain[];
}

// API: /api/trains/station/{idOrName}
export interface StationTrain {
	trainNumber: string;
	type: TrainType;
	direction: string;
	destination: Destination;
	delay: number;
	carCount: string;
	information: string | null;
	isInStation: boolean;
	positionCode: string;
}

export interface StationTrainsResponse {
	stationId: string;
	stationName: string;
	stationType: string;
	updatedAt: string;
	trains: StationTrain[];
}

// 電光掲示板用の変換型
export interface DisplayTrain {
	id: string;
	time: string; // 時刻（到着/発車）
	trainType: string; // 列車種別
	iconName: string; // 種別アイコン
	destination: string; // 行先
	direction: string; // 行先方向
	delay: number; // 遅延分数
	isPass: boolean; // 通過列車か
	note: string | null; // 備考情報
}
