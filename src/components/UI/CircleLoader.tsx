import { TfiReload } from "react-icons/tfi";

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

export const CircleLoader: React.FC<CircleLoaderProps> = ({
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
			<div className="text-white absolute inset-0 flex items-center justify-center">
				{isActive && remainingSeconds > 0 ? (
					// クールダウン中は残り秒数
					<span className="font-mono text-xs font-bold">
						{Math.ceil(remainingSeconds)}
					</span>
				) : (
					<TfiReload size={18} />
				)}
			</div>
		</div>
	);
};
