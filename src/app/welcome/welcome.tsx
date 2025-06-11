"use client";

import type React from "react";
import { useEffect, useState, useMemo } from "react";
import { TrainBoard } from "@/components/Train/TrainBoard";
import { ErrorDisplay } from "@/components/UI/ErrorDisplay";
import { LoadingDisplay } from "@/components/UI/LoadingDisplay";
import { PageHeader } from "@/components/Layout/PageHeader";
import { useTrainDataAPI } from "@/hooks/useTrainDataAPI";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";
import {
	convertToDisplayTrains,
	categorizeTrainsByDirection,
} from "@/utils/trainDataUtils";

const TrainBoardContainer: React.FC = () => {
	const [displayCount, setDisplayCount] = useState(7);

	// 表示行数の選択肢
	const displayCountOptions = [1, 3, 5, 7, 10, 15, 20, 50];

	// API呼び出しフック
	const { data, error, loading, isRefreshing, fetchData } = useTrainDataAPI();

	// 自動更新フック
	const {
		autoRefresh,
		cooldownProgress,
		toggleAutoRefresh,
		handleRefresh,
		startCooldown,
		autoRefreshTimerRef,
	} = useAutoRefresh(fetchData);

	// 表示用のデータに変換
	const displayTrains = useMemo(() => {
		return data ? convertToDisplayTrains(data) : [];
	}, [data]);

	// 上り/下りに分類
	const { inboundTrains, outboundTrains } = useMemo(() => {
		return categorizeTrainsByDirection(displayTrains);
	}, [displayTrains]);

	// 初回データ取得
	useEffect(() => {
		fetchData();
	}, [fetchData]);

	// 自動更新のEffect
	useEffect(() => {
		if (!autoRefresh || cooldownProgress < 100) return;

		const timer = setTimeout(() => {
			fetchData(true);
			startCooldown();
		}, 30000); // 30秒間隔

		autoRefreshTimerRef.current = timer;

		return () => {
			if (timer) {
				clearTimeout(timer);
			}
		};
	}, [
		autoRefresh,
		cooldownProgress,
		fetchData,
		startCooldown,
		autoRefreshTimerRef,
	]);

	// ローディング表示
	if (loading) {
		return <LoadingDisplay />;
	}

	// エラー表示
	if (error) {
		return <ErrorDisplay error={error} onRetry={() => fetchData()} />;
	}

	// データなし表示
	if (!data) {
		return <div className="text-gray-400 p-4">データがありません</div>;
	}

	return (
		<div className="flex flex-col space-y-6">
			<PageHeader
				displayCount={displayCount}
				displayCountOptions={displayCountOptions}
				onDisplayCountChange={setDisplayCount}
				autoRefresh={autoRefresh}
				onToggleAutoRefresh={toggleAutoRefresh}
				onRefresh={handleRefresh}
				isRefreshing={isRefreshing}
				cooldownProgress={cooldownProgress}
			/>

			{/* 下り電光掲示板 */}
			<TrainBoard
				trains={outboundTrains}
				maxDisplayCount={displayCount}
				title="下り"
				updatedAt={data.updatedAt}
				showControls={false}
				showFooter={false}
			/>

			{/* 上り電光掲示板 */}
			<TrainBoard
				trains={inboundTrains}
				maxDisplayCount={displayCount}
				title="上り"
				updatedAt={data.updatedAt}
				showControls={false}
				showFooter={true}
			/>
		</div>
	);
};

export default function Welcome() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-4">
			<div className="container mx-auto max-w-6xl">
				<TrainBoardContainer />
			</div>
		</div>
	);
}
