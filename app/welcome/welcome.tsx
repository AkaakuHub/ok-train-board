import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { FaRegClock } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import { TrainBoard } from "~/components/Train/TrainBoard";
import { CircleLoader } from "~/components/UI/CircleLoader";
import type { ArrivalsResponse, ArrivalTrain, DisplayTrain } from "~/types/api";

/**
 * APIの到着列車データをDisplayTrain型に変換する
 * @param data APIレスポンス
 * @returns 表示用の整形されたデータ
 */
const convertToDisplayTrains = (data: ArrivalsResponse): DisplayTrain[] => {
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

export const TrainBoardContainer: React.FC = () => {
  const [data, setData] = useState<ArrivalsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [displayCount, setDisplayCount] = useState(7);

  // 表示行数の選択肢
  const displayCountOptions = [1, 3, 5, 7, 10, 15, 20, 50];

  // リフレッシュ関連の状態
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const cooldownTotal = 10;
  const cooldownProgress = useMemo(
    () =>
      cooldown <= 0 ? 100 : Math.floor((1 - cooldown / cooldownTotal) * 100),
    [cooldown]
  );
  const cooldownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoRefreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  // 表示用のデータに変換
  const displayTrains = useMemo(() => {
    return data ? convertToDisplayTrains(data) : [];
  }, [data]);

  // 上り/下りに分類
  const { inboundTrains, outboundTrains } = useMemo(() => {
    if (!displayTrains.length) return { inboundTrains: [], outboundTrains: [] };

    return displayTrains.reduce(
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
      }
    );
  }, [displayTrains]);

  // API呼び出し関数（変更なし）
  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) {
      setError("APIのURLが設定されていません");
      setLoading(false);
      setIsRefreshing(false);
      return;
    }

    try {
      // 指定URLでAPIから到着列車データを取得
      const response = await fetch(`${API_URL}/trains/arrivals/調布`);

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

      // リフレッシュの場合はクールダウン開始
      if (isRefresh) {
        startCooldown();
      }
    }
  }, []);

  // クールダウンタイマー制御
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
  }, [cooldownTotal, autoRefresh, fetchData]);

  // 自動更新のトグル
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
        // ただし、クールダウン自体は停止しない（進行中の更新は完了させる）
        if (autoRefreshTimerRef.current) {
          clearTimeout(autoRefreshTimerRef.current);
          autoRefreshTimerRef.current = null;
        }
      }

      return newValue;
    });
  }, [fetchData, cooldown]);

  // 自動更新の制御
  useEffect(() => {
    // 自動更新タイマーのクリーンアップ
    if (autoRefreshTimerRef.current) {
      clearTimeout(autoRefreshTimerRef.current);
      autoRefreshTimerRef.current = null;
    }

    // 注: 自動更新の実際の実行ロジックはstartCooldown内に移動
    // ここでは最初の一回だけ強制的に実行（ただしクールダウン中は無視）
    if (autoRefresh && cooldown <= 0 && !isRefreshing) {
      // 初回のみ少し遅延させて実行（状態が安定するまで）
      autoRefreshTimerRef.current = setTimeout(() => {
        fetchData(true);
      }, 10);
    }

    return () => {
      if (autoRefreshTimerRef.current) {
        clearTimeout(autoRefreshTimerRef.current);
        autoRefreshTimerRef.current = null;
      }
    };
  }, [autoRefresh, cooldown, isRefreshing, fetchData]);

  // 手動リフレッシュハンドラー
  const handleRefresh = useCallback(() => {
    if (cooldown > 0) return;
    fetchData(true);
  }, [fetchData, cooldown]);

  // コンポーネントアンマウント時のクリーンアップ
  useEffect(() => {
    fetchData();
    return () => {
      // すべてのタイマーを確実に停止
      if (cooldownTimerRef.current) {
        clearInterval(cooldownTimerRef.current);
        cooldownTimerRef.current = null;
      }

      if (autoRefreshTimerRef.current) {
        clearInterval(autoRefreshTimerRef.current);
        autoRefreshTimerRef.current = null;
      }
    };
  }, [fetchData]);

  if (loading) {
    return (
      <div className="bg-slate-900/80 backdrop-blur-sm text-cyan-300 p-6 rounded-xl flex flex-col items-center justify-center shadow-lg ring-1 ring-cyan-500/30">
        <div className="w-12 h-12 mb-4 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-700 shadow-lg shadow-cyan-900/20" />
        <div className="text-lg">データ読み込み中...</div>
      </div>
    );
  }

  // // 今直せないからこれで止めて
  // return (
  //   <div className="bg-slate-900/80 backdrop-blur-sm text-red-300 p-6 rounded-xl flex flex-col items-center shadow-lg ring-1 ring-red-500/30">
  //     <MdErrorOutline size={48} />
  //     <button
  //       onClick={() => fetchData()}
  //       className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-md transition-colors"
  //     >
  //       現在メンテナンス中です。近日復活します。
  //     </button>
  //   </div>
  // );

  if (error) {
    return (
      <div className="bg-slate-900/80 backdrop-blur-sm text-red-300 p-6 rounded-xl flex flex-col items-center shadow-lg ring-1 ring-red-500/30">
        <MdErrorOutline size={48} />
        <div className="text-lg font-medium">{error}</div>
        <button
          onClick={() => fetchData()}
          className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-md transition-colors"
        >
          再試行
        </button>
      </div>
    );
  }

  if (!data) {
    return <div className="text-gray-400 p-4">データがありません</div>;
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 共通コントロールパネル */}
      <div className="bg-slate-900/80 backdrop-blur-sm p-2 rounded-lg ring-1 ring-cyan-500/20 shadow-md">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 px-2">
          <div className="text-sm text-cyan-400 font-medium flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>リアルタイム列車情報</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* 表示行数コントロール - ドロップダウン形式に変更 */}
            <div className="flex items-center space-x-1 bg-slate-800/50 px-2 py-1 rounded-md">
              <span className="text-xs text-slate-400">表示行数:</span>
              <select
                value={displayCount}
                onChange={(e) => setDisplayCount(Number(e.target.value))}
                className="bg-slate-700 text-cyan-300 text-xs py-1 px-2 rounded border-none outline-none focus:ring-1 focus:ring-cyan-500 appearance-none w-12 text-center"
                style={{
                  WebkitAppearance: "none",
                  backgroundImage:
                    'url(\'data:image/svg+xml;utf8,<svg fill="%238096a7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>\')',
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 2px center",
                  backgroundSize: "16px",
                }}
              >
                {displayCountOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* 自動更新トグル */}
            <div
              onClick={toggleAutoRefresh}
              className={`flex items-center space-x-1 text-xs px-2 py-1 rounded cursor-pointer transition-colors ${
                autoRefresh
                  ? "bg-cyan-500/30 text-cyan-200"
                  : "bg-slate-700/30 text-slate-400 hover:bg-slate-700/40"
              }`}
            >
              <span>自動更新</span>
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

            {/* 更新ボタン */}
            <button
              onClick={handleRefresh}
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
        </div>

        {data.updatedAt && (
          <div className="text-right text-xs text-cyan-300/50 mt-1 px-2">
            データ最終更新: {data.updatedAt}
          </div>
        )}
      </div>

      {/* 上り電光掲示板 */}
      <div className="w-full">
        <TrainBoard
          trains={inboundTrains}
          maxDisplayCount={displayCount}
          title="上り（新宿・都営新宿線方面）"
          updatedAt={data.updatedAt}
          showControls={false}
          showFooter={false}
        />
      </div>

      {/* 下り電光掲示板 */}
      <div className="w-full">
        <TrainBoard
          trains={outboundTrains}
          maxDisplayCount={displayCount}
          title="下り（橋本・高尾・京王八王子方面）"
          updatedAt={data.updatedAt}
          showControls={false}
          showFooter={false}
        />
      </div>
    </div>
  );
};

/**
 * Welcome コンポーネントも修正して、レイアウトを調整
 */
export function Welcome() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // 1秒ごとに更新

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="flex flex-col items-center pt-6 pb-4 min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      {/* デジタルフレームヘッダー */}
      <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl px-2 mb-4">
        <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white group flex items-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-cyan-500">
              調布駅 電光掲示板（β版）
            </span>
          </h2>

          <div className="flex items-center space-x-1 text-cyan-500/70">
            {/* 現在時刻 */}
            <div className="text-sm flex items-center bg-cyan-950/30 px-2 py-1 gap-2 rounded-md border border-cyan-800/20">
              <FaRegClock size={12} />
              <span className="w-12">
                {currentTime?.toLocaleTimeString("ja-JP")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 電光掲示板コンテナ */}
      <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl px-2">
        <TrainBoardContainer />
      </div>

      {/* フッター情報 */}
      <div className="mt-6 text-xs text-cyan-600/50 text-center">
        ※この電光掲示板は非公式です。
      </div>
    </main>
  );
}
