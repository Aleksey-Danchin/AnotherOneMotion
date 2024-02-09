import { getCurrentFrame, drawScene, tween, waitForAll } from "./core";
import { delay, mutate, map } from "./utils";

drawScene(async () => {
	console.log("start");

	const point = {
		x: -100,
		y: -100,
	};

	let startX = point.x;
	let startY = point.y;

	await tween(1, (value) => {
		Object.assign(point, {
			x: map(startX, 100, value),
			y: map(startY, 100, value),
		});

		console.log({
			frame: getCurrentFrame(),
			value,
			point,
		});
	}).then(async () => {
		await delay(1);

		startX = point.x;
		startY = point.y;

		return tween(1, (value) => {
			Object.assign(point, {
				x: map(startX, -100, value),
				y: map(startY, -100, value),
			});

			console.log({
				frame: getCurrentFrame(),
				value,
				point,
			});
		});
	});

	console.log({ frame: getCurrentFrame(), point });
	await Promise.all([mutate(point, "x", 0, 1), mutate(point, "y", 0, 2)]);
	console.log({ frame: getCurrentFrame(), point });

	mutate(point, "x", 0, 1);
	mutate(point, "y", 0, 2);
	tween(1, (value) => console.log({ frame: getCurrentFrame(), value }));
	await waitForAll();

	console.log({ frame: getCurrentFrame(), point });

	console.log("finish");
});
