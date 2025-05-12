import { useMemo } from "react";
import type { DisplayTrain } from "@/types/api";
import { CircleLoader } from "../UI/CircleLoader";
import { TrainRow } from "./TrainRow";

interface TrainBoardProps {
  trains: DisplayTrain[];
  maxDisplayCount?: number;
  title?: string;
  updatedAt?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  cooldownProgress?: number;
  showControls?: boolean; // 制御要素を表示するか
  showFooter?: boolean; // フッター情報を表示するか
}

export const TrainBoard: React.FC<
  TrainBoardProps & {
    autoRefresh?: boolean;
    onToggleAutoRefresh?: () => void;
  }
> = ({
  trains,
  maxDisplayCount = 5,
  title = "到着予定",
  updatedAt,
  onRefresh,
  isRefreshing = false,
  cooldownProgress = 100,
  autoRefresh = false,
  onToggleAutoRefresh,
  showControls = true, // デフォルトは表示する
  showFooter = true, // デフォルトは表示する
}) => {
  // 時刻だけでソートすると同じ時間の違う車種がチラチラ入れ替わるので、時刻と車種でソートする
  // また、日付をまたぐ時間帯の列車を適切に表示するため、時間に応じて日付を調整する
  const sorted = useMemo(() => {
    const now = new Date();

    return trains.slice().sort((a, b) => {
      // 列車A、Bの時刻を取得（"HH:MM"形式）
      const timeA = a.time;
      const timeB = b.time;

      // 時刻を時間と分に分解
      const [hoursA, minutesA] = timeA.split(":").map(Number);
      const [hoursB, minutesB] = timeB.split(":").map(Number);

      // 日付の基準を設定（今日）
      let dateA = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      let dateB = new Date(now.getFullYear(), now.getMonth(), now.getDate());

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

  const toDisplay = sorted.slice(0, maxDisplayCount);

  return (
    <div className="bg-slate-900/90 backdrop-blur-md text-white rounded-xl overflow-hidden ring-1 ring-cyan-500/30 shadow-lg shadow-cyan-900/20 w-full">
      {/* ヘッダー（モダンなネオン発光ヘッダー） */}
      <div className="relative bg-gradient-to-r from-slate-800 to-slate-900 px-2 py-3 border-b border-cyan-500/30">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-6 bg-cyan-400 rounded-full"></div>
            <h3 className="text-sm font-bold tracking-wider uppercase text-white/90">
              {title}
            </h3>
          </div>

          {/* 更新コントロール - showControlsがtrueの場合のみ表示 */}
          {showControls && (
            <div className="flex items-center space-x-2">
              {/* 自動更新トグル */}
              {onToggleAutoRefresh && (
                <div
                  onClick={onToggleAutoRefresh}
                  className={`flex items-center space-x-1 text-xs px-2 py-1 rounded cursor-pointer transition-colors ${
                    autoRefresh
                      ? "bg-cyan-500/30 text-cyan-200"
                      : "bg-slate-700/30 text-slate-400 hover:bg-slate-700/40"
                  }`}
                >
                  <span>自動</span>
                  <div
                    className={`relative w-8 h-4 rounded-full transition-colors ${
                      autoRefresh ? "bg-cyan-600" : "bg-slate-700"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full transition-transform ${
                        autoRefresh
                          ? "bg-cyan-200 transform translate-x-4"
                          : "bg-slate-400"
                      }`}
                    ></div>
                  </div>
                </div>
              )}

              {/* 更新ボタン */}
              {onRefresh && (
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs text-cyan-300/70">更新</span>
                  <button
                    onClick={onRefresh}
                    disabled={isRefreshing || cooldownProgress < 100}
                    className={`relative flex items-center justify-center p-1 rounded-full transition-all
                      ${
                        cooldownProgress < 100
                          ? "opacity-70 cursor-not-allowed"
                          : "hover:bg-cyan-500/20 active:bg-cyan-600/30"
                      }`}
                    title={
                      cooldownProgress < 100
                        ? "更新まで少々お待ちください"
                        : "今すぐ更新"
                    }
                  >
                    <CircleLoader
                      progress={cooldownProgress}
                      isActive={cooldownProgress < 100}
                      size={32}
                      remainingSeconds={10 - (10 * cooldownProgress) / 100}
                    />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-[4rem_6rem_1fr_3rem_auto] gap-1 mt-2 text-xs font-medium text-cyan-300/70">
          <div className="text-center">時刻</div>
          <div className="text-center">種別</div>
          <div className="text-center">行先</div>
          <div className="text-center">備考</div>
        </div>
      </div>

      <div className="backdrop-blur-md bg-gradient-to-b from-slate-900/90 to-slate-800/90 relative">
        {/* 行データ */}
        <div className="relative">
          {toDisplay.length === 0 ? (
            <div className="text-center text-slate-400 py-8">
              列車はありません
            </div>
          ) : (
            toDisplay.map((train) => <TrainRow key={train.id} train={train} />)
          )}
        </div>
      </div>

      {/* フッター - showFooterがtrueの場合のみ表示 */}
      {showFooter && updatedAt && (
        <div className="bg-slate-800/80 text-right text-xs text-slate-400 px-2 py-2 backdrop-blur-sm border-t border-slate-700/30">
          <div className="flex justify-between items-center">
            <div className="text-xs text-slate-400/70">
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 mr-1.5"></span>
              OK TRAIN
            </div>
            <div>データ最終更新: {updatedAt}</div>
          </div>
        </div>
      )}
    </div>
  );
};
