import * as React from "react";
import { Howl } from "howler";
import useStore from "../zustand";
import shallow from "zustand/shallow";
import useLocalStorage from "./useLocalStorage";
import useSound from "use-sound";

export const useStopWatch = () => {
	const timer = React.useRef<NodeJS.Timer>();
	const shouldPlay = React.useRef<boolean>();
	const timeRef = React.useRef(useStore.getState().time);
	const percentRef = React.useRef(useStore.getState().percent);

	const [volumeOn] = useLocalStorage("volumeOn", true);
	const [play, { sound }] = useSound("/chime.wav", { soundEnabled: volumeOn });
	const { goal, setPercent, setTime, setRunning } = useStore(
		(state) => ({
			goal: state.goal,
			percent: state.percent,
			setTime: state.setTime,
			setPercent: state.setPercent,
			setRunning: state.setRunning,
		}),
		shallow
	);

	React.useEffect(() => {
		useStore.subscribe((state) => (timeRef.current = state.time));
		useStore.subscribe((state) => (percentRef.current = state.percent));
	}, []);

	const reset = () => {
		setRunning(false);
		setTime(0);
		setPercent(0);
		clearInterval(timer.current);
	};

	const start = () => {
		(sound as Howl).mute;

		const timerStart = Date.now() - timeRef.current;
		setRunning(true);
		clearInterval(timer.current);
		timer.current = setInterval(() => {
			let percent = 0;
			const time = Date.now() - timerStart;
			if (time <= goal) {
				if (!shouldPlay.current) {
					shouldPlay.current = true;
				}
				percent = Math.floor((time / goal) * 100);
			}
			if (time > goal) {
				if (shouldPlay.current) {
					play();
					// soundRef.current = undefined;
					shouldPlay.current = false;
				}

				percent = 100;
			}
			setPercent(percent);
			setTime(Date.now() - timerStart);
		}, 10);
	};

	const stop = () => {
		setRunning(false);
		clearInterval(timer.current);
	};

	return { reset, start, stop };
};
