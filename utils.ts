import { tween } from "./core";

export const map = (min: number, max: number, value: number) =>
	min + value * (max - min);

export const delay = (time: number) => tween(time, () => {});

export const mutate = (
	obj: any,
	key: string,
	endValue: number,
	time: number
) => {
	const startValue = obj[key];

	return tween(
		time,
		(value) => (obj[key] = map(startValue, endValue, value))
	);
};
