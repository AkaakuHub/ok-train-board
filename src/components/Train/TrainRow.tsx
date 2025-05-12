import clsx from "clsx";
import type { DisplayTrain } from "@/types/api";

// 列車種別ごとのカラーマッピング
const trainTypeClasses: Record<string, string> = {
  特急: "bg-gradient-to-br from-red-600 to-red-700 text-white shadow-md",
  急行: "bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-md",
  区間急行:
    "bg-gradient-to-br from-yellow-500 to-yellow-600 text-white shadow-md",
  快速: "bg-gradient-to-br from-blue-800 to-blue-900 text-white shadow-md",
  各駅停車: "bg-gradient-to-br from-gray-500 to-gray-600 text-white shadow-md",
  京王ライナー:
    "bg-gradient-to-br from-pink-700 to-pink-800 text-white shadow-md",
  "Mt.TAKAO":
    "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md",
  臨時: "bg-gradient-to-br from-gray-700 to-gray-800 text-white shadow-md",
};

interface TrainRowProps {
  train: DisplayTrain;
}

export const TrainRow: React.FC<TrainRowProps> = ({ train }) => {
  const typeClass =
    trainTypeClasses[train.trainType] ||
    "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md";
  return (
    <div className="grid grid-cols-[4rem_6rem_1fr_3rem_auto] gap-1 items-center py-2 px-2 border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
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
        {train.trainType}
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
