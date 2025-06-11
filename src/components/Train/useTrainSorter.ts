import { useMemo } from "react";
import type { DisplayTrain } from "@/types/api";

export const useTrainSorter = (trains: DisplayTrain[]) => {
	// 時刻だけでソートすると同じ時間の違う車種がチラチラ入れ替わるので、時刻と車種でソートする
	// また、日付をまたぐ時間帯の列車を適切に表示するため、時間に応じて日付を調整する
	const sortedTrains = useMemo(() => {
		const now = new Date();

		return trains.slice().sort((a, b) => {
			// 列車A、Bの時刻を取得（"HH:MM"形式）
			const timeA = a.time;
			const timeB = b.time;

			// 時刻を時間と分に分解
			const [hoursA, minutesA] = timeA.split(":").map(Number);
			const [hoursB, minutesB] = timeB.split(":").map(Number);

			// 日付の基準を設定（今日）
			const dateA = new Date(now.getFullYear(), now.getMonth(), now.getDate());
			const dateB = new Date(now.getFullYear(), now.getMonth(), now.getDate());

			// 深夜時間帯の特殊処理（日付をまたぐケース）

			// 現在時刻が深夜（0時～3時台）の場合
			if (now.getHours() >= 0 && now.getHours() < 4) {
				// 列車の時刻が夕方以降（18時以降）なら前日とみなす
				if (hoursA >= 18) {
					dateA.setDate(dateA.getDate() - 1);
				}
				if (hoursB >= 18) {
					dateB.setDate(dateB.getDate() - 1);
				}
			}
			// 現在時刻が夕方以降（18時以降）の場合
			else if (now.getHours() >= 18) {
				// 列車の時刻が早朝（4時未満）なら翌日とみなす
				if (hoursA >= 0 && hoursA < 4) {
					dateA.setDate(dateA.getDate() + 1);
				}
				if (hoursB >= 0 && hoursB < 4) {
					dateB.setDate(dateB.getDate() + 1);
				}
			}

			// 時刻をセット
			dateA.setHours(hoursA, minutesA, 0);
			dateB.setHours(hoursB, minutesB, 0);

			// タイムスタンプで比較
			const diffTime = dateA.getTime() - dateB.getTime();
			if (diffTime !== 0) {
				return diffTime;
			}

			// 時刻が同じ場合は車種でソート
			return a.trainType.localeCompare(b.trainType);
		});
	}, [trains]);

	return sortedTrains;
};
