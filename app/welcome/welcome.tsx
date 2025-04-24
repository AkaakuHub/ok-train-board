import { clsx } from "clsx";
import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { FaRegClock } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import { TfiReload } from "react-icons/tfi";
import type { ArrivalsResponse, ArrivalTrain, DisplayTrain } from "~/types/api";

// トレンディなニューモーフィズムカラーパレット
const UI_COLORS = {
  primary: "rgb(0, 230, 230)", // サイバーティール
  dark: "rgb(20, 30, 40)", // ダークブルーベース
  darkAccent: "rgb(30, 40, 55)", // アクセントダーク
  highlight: "rgb(230, 255, 255)", // ハイライトカラー
  glass: "rgba(30, 50, 70, 0.7)", // グラスモーフィズム
  shadow: "rgba(0, 0, 0, 0.5)", // シャドウ
  success: "rgb(0, 255, 170)", // ネオングリーン
  error: "rgb(255, 70, 90)", // ネオンレッド
  warning: "rgb(255, 180, 60)", // ネオンオレンジ
};

// 列車種別ごとのカラーマッピング
const trainTypeClasses: Record<string, string> = {
  特急: "bg-gradient-to-br from-red-600 to-red-700 text-white shadow-md",
  急行: "bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-md",
  区間急行:
    "bg-gradient-to-br from-yellow-400 to-yellow-500 text-black shadow-md",
  快速: "bg-gradient-to-br from-blue-800 to-blue-900 text-white shadow-md",
  各駅停車: "bg-gradient-to-br from-gray-600 to-gray-700 text-white shadow-md",
  京王ライナー:
    "bg-gradient-to-br from-pink-700 to-pink-800 text-white shadow-md",
};

/**
 * APIの到着列車データをDisplayTrain型に変換する
 * @param data APIレスポンス
 * @returns 表示用の整形されたデータ
 */
const convertToDisplayTrains = (data: ArrivalsResponse): DisplayTrain[] => {
  if (!data?.arrivingTrains) return [];

  return data.arrivingTrains.map((train: ArrivalTrain, index: number) => ({
    id: `${train.trainNumber}-${index}`,
    time: train.estimatedArrival,
    trainType: train.type.name,
    iconName: train.type.iconName || train.type.name,
    destination: train.destination.name,
    direction: train.direction,
    delay: train.delay,
    isPass: train.passType === "通過",
    note: train.information,
  }));
};

interface TrainRowProps {
  train: DisplayTrain;
}

const TrainRow: React.FC<TrainRowProps> = ({ train }) => {
  const typeClass =
    trainTypeClasses[train.trainType] ||
    "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md";
  return (
    <div className="grid grid-cols-[4rem_3.5rem_1fr_3rem_auto] gap-1 items-center py-2 px-2 border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
      <div
        className={clsx(
          "text-center text-lg font-mono tabular-nums font-semibold",
          train.delay > 0 ? "text-red-400" : "text-white/90"
        )}
      >
        {train.time}
      </div>
      <div
        className={`${typeClass} rounded-md px-1 py-1 text-center text-sm font-bold tracking-wider backdrop-blur-sm ring-1 ring-white/10`}
      >
        {train.iconName}
      </div>
      <div className="text-base font-semibold tracking-wide text-white/90 text-center mx-auto truncate">
        {train.destination}
      </div>
      <div className="text-center flex justify-center gap-1 flex-wrap">
        {train.isPass && (
          <span className="bg-blue-500/20 text-blue-300 px-1.5 rounded-sm font-medium text-xs">
            通過
          </span>
        )}
        {!train.isPass && train.delay > 0 && (
          <span className="bg-red-500/20 text-red-300 px-1.5 rounded-sm font-medium text-xs">
            +{train.delay}分
          </span>
        )}
      </div>
      {train.note && (
        <div className="col-span-full text-xs text-emerald-400/90 mt-1 text-center font-medium">
          {train.note}
        </div>
      )}
    </div>
  );
};

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
  // 時刻でソート
  const sorted = useMemo(() => {
    return [...trains].sort((a, b) => {
      return a.time.localeCompare(b.time);
    });
  }, [trains]);

  const toDisplay = sorted.slice(0, maxDisplayCount);

  return (
    <div className="bg-slate-900/90 backdrop-blur-md text-white rounded-xl overflow-hidden ring-1 ring-cyan-500/30 shadow-lg shadow-cyan-900/20 w-full">
      {/* ヘッダー（モダンなネオン発光ヘッダー） */}
      <div className="relative bg-gradient-to-r from-slate-800 to-slate-900 px-2 py-3 border-b border-cyan-500/30">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-6 bg-cyan-400 rounded-full animate-pulse"></div>
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

        <div className="grid grid-cols-[4rem_3.5rem_1fr_3rem_auto] gap-1 mt-2 text-xs font-medium text-cyan-300/70">
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
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping mr-1.5"></span>
              OK TRAIN
            </div>
            <div>データ最終更新: {updatedAt}</div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * サークルローダーコンポーネント
 * プログレスアニメーション付き＋残り秒数表示
 */
interface CircleLoaderProps {
  progress: number; // 0-100
  size?: number;
  thickness?: number;
  isActive?: boolean;
  remainingSeconds?: number; // 残り秒数（表示用）
}

const CircleLoader: React.FC<CircleLoaderProps> = ({
  progress,
  size = 40,
  thickness = 3,
  isActive = true,
  remainingSeconds = 0,
}) => {
  const viewBoxSize = 36;
  const radius = (viewBoxSize - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        className="absolute inset-0 transform -rotate-90"
      >
        {/* ベースサークル（グレー） */}
        <circle
          cx={viewBoxSize / 2}
          cy={viewBoxSize / 2}
          r={radius}
          fill="none"
          stroke={
            isActive ? "rgba(100, 100, 100, 0.2)" : "rgba(80, 80, 80, 0.1)"
          }
          strokeWidth={thickness}
        />
        {/* プログレスサークル */}
        <circle
          cx={viewBoxSize / 2}
          cy={viewBoxSize / 2}
          r={radius}
          fill="none"
          stroke={isActive ? UI_COLORS.primary : "rgba(100, 100, 100, 0.3)"}
          strokeWidth={thickness}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-200 ease-out"
        />
      </svg>
      {/* 中央表示（クールダウン中は残り秒数、それ以外はアイコン） */}
      <div className="absolute inset-0 flex items-center justify-center">
        {isActive && remainingSeconds > 0 ? (
          // クールダウン中は残り秒数
          <span className="text-white font-mono text-xs font-bold">
            {Math.ceil(remainingSeconds)}
          </span>
        ) : (
          <TfiReload size={18} />
        )}
      </div>
    </div>
  );
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
  const autoRefreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // API呼び出し関数
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
      const response = await fetch(
        `${API_URL}/trains/arrivals/%E8%AA%BF%E5%B8%83`
      );

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

  // 自動更新のトグル
  const toggleAutoRefresh = useCallback(() => {
    setAutoRefresh((prev) => !prev);
  }, []);

  // 自動更新の制御
  useEffect(() => {
    if (autoRefresh) {
      // 自動更新がONの場合、10秒ごとに更新
      autoRefreshTimerRef.current = setInterval(() => {
        fetchData(true);
      }, 10000);
    } else {
      // 自動更新がOFFの場合、タイマーをクリア
      if (autoRefreshTimerRef.current) {
        clearInterval(autoRefreshTimerRef.current);
        autoRefreshTimerRef.current = null;
      }
    }

    return () => {
      if (autoRefreshTimerRef.current) {
        clearInterval(autoRefreshTimerRef.current);
        autoRefreshTimerRef.current = null;
      }
    };
  }, [autoRefresh, fetchData]);

  // 手動リフレッシュハンドラー
  const handleRefresh = useCallback(() => {
    if (cooldown > 0) return; // クールダウン中は何もしない
    fetchData(true);
  }, [fetchData, cooldown]);

  // クールダウンタイマー制御
  const startCooldown = useCallback(() => {
    setCooldown(cooldownTotal);

    // 既存のタイマーをクリア
    if (cooldownTimerRef.current) {
      clearInterval(cooldownTimerRef.current);
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
  }, [cooldownTotal]);

  // 初回ロード
  useEffect(() => {
    let ignore = false;

    fetchData();

    // クリーンアップ関数
    return () => {
      ignore = true;
      if (cooldownTimerRef.current) {
        clearInterval(cooldownTimerRef.current);
      }
    };
  }, [fetchData]);

  if (loading) {
    return (
      <div className="bg-slate-900/80 backdrop-blur-sm text-cyan-300 p-6 rounded-xl flex flex-col items-center justify-center shadow-lg ring-1 ring-cyan-500/30">
        <div className="w-12 h-12 mb-4 animate-pulse rounded-full bg-gradient-to-r from-cyan-500 to-cyan-700 shadow-lg shadow-cyan-900/20" />
        <div className="text-lg">データ読み込み中...</div>
      </div>
    );
  }

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
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
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
              className={`relative flex items-center justify-center gap-2 px-3 py-1 rounded-md transition-all text-cyan-300 text-sm
                ${
                  cooldownProgress < 100
                    ? "bg-slate-800/50 opacity-70 cursor-not-allowed"
                    : "bg-slate-800/50 hover:bg-slate-700/60 active:bg-slate-600/60"
                }`}
              title={
                cooldownProgress < 100
                  ? "更新まで少々お待ちください"
                  : "今すぐ更新"
              }
            >
              <TfiReload size={14} />
              <span>更新</span>
              {cooldownProgress < 100 && (
                <span className="text-xs text-cyan-400/70">
                  {Math.ceil(10 - (10 * cooldownProgress) / 100)}秒
                </span>
              )}
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
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // 1秒ごとに更新

    return () => clearInterval(interval);
  }, []); // 依存配列の修正

  return (
    <main className="flex flex-col items-center pt-6 pb-4 min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      {/* デジタルフレームヘッダー */}
      <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl px-2 mb-4">
        <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white group flex items-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-cyan-500">
              調布駅 電光掲示板
            </span>
          </h2>

          <div className="flex items-center space-x-1 text-cyan-500/70">
            {/* 現在時刻 */}
            <div className="text-xs flex items-center bg-cyan-950/30 px-2 py-1 gap-2 rounded-md border border-cyan-800/20">
              <FaRegClock size={12} />
              <span className="w-12">
                {currentTime.toLocaleTimeString("ja-JP")}
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
