import { useState, useCallback } from "react";
import type { ArrivalsResponse } from "@/types/api";

export const useTrainDataAPI = () => {
	const [data, setData] = useState<ArrivalsResponse | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [isRefreshing, setIsRefreshing] = useState(false);

	const fetchData = useCallback(async (isRefresh = false) => {
		if (isRefresh) {
			setIsRefreshing(true);
		} else {
			setLoading(true);
		}
		setError(null);

		const API_URL = process.env.NEXT_PUBLIC_API_URL;
		if (!API_URL) {
			setError("APIのURLが設定されていません");
			setLoading(false);
			setIsRefreshing(false);
			return;
		}

		try {
			// 指定URLでAPIから到着列車データを取得
			const response = await fetch(`${API_URL}/trains/arrivals/調布`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
				mode: "cors",
			});

			if (!response.ok) {
				throw new Error(`APIエラー: ${response.status}`);
			}

			const jsonData: ArrivalsResponse = await response.json();
			setData(jsonData);
		} catch (e) {
			console.error("データ取得エラー:", e);
			setError("列車データの取得に失敗しました");
		} finally {
			setLoading(false);
			setIsRefreshing(false);
		}
	}, []);

	return {
		data,
		error,
		loading,
		isRefreshing,
		fetchData,
	};
};
