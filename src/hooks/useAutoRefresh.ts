import { useState, useRef, useCallback, useMemo } from "react";

export const useAutoRefresh = (fetchData: (isRefresh?: boolean) => void) => {
	const [autoRefresh, setAutoRefresh] = useState(false);
	const [cooldown, setCooldown] = useState(0);
	const cooldownTotal = 10;

	const cooldownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const autoRefreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
		null,
	);

	const cooldownProgress = useMemo(
		() =>
			cooldown <= 0 ? 100 : Math.floor((1 - cooldown / cooldownTotal) * 100),
		[cooldown],
	);

	const startCooldown = useCallback(() => {
		setCooldown(cooldownTotal);

		// 既存のタイマーをクリア
		if (cooldownTimerRef.current) {
			clearInterval(cooldownTimerRef.current);
			cooldownTimerRef.current = null;
		}

		// 新しいタイマーを設定（100msごとに更新）
		cooldownTimerRef.current = setInterval(() => {
			setCooldown((prev) => {
				const next = prev - 0.1;
				if (next <= 0) {
					if (cooldownTimerRef.current) {
						clearInterval(cooldownTimerRef.current);
						cooldownTimerRef.current = null;
					}
					return 0;
				}
				return next;
			});
		}, 100);
	}, []);

	const toggleAutoRefresh = useCallback(() => {
		setAutoRefresh((prev) => {
			const newValue = !prev;

			if (newValue) {
				// クールダウン中かどうかをチェック
				if (cooldown <= 0) {
					// クールダウン中でなければ即時更新
					fetchData(true);
				}
			} else {
				// 自動更新をOFFにする場合、自動更新用のタイマークリア
				if (autoRefreshTimerRef.current) {
					clearTimeout(autoRefreshTimerRef.current);
					autoRefreshTimerRef.current = null;
				}
			}

			return newValue;
		});
	}, [fetchData, cooldown]);

	const handleRefresh = useCallback(() => {
		if (cooldown > 0) return;
		fetchData(true);
		startCooldown();
	}, [fetchData, cooldown, startCooldown]);

	return {
		autoRefresh,
		cooldownProgress,
		toggleAutoRefresh,
		handleRefresh,
		startCooldown,
		autoRefreshTimerRef,
		cooldownTimerRef,
	};
};
