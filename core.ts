type TweenCallback = (value: number) => any;

type Sandglass = {
	firstFrame: number;
	lastFrame: number;
	callback: TweenCallback;
	resolve: (value?: unknown) => void;
	reject: (reason?: any) => void;
};

const sandglasses: Sandglass[] = [];

const fps = 5;
let currentFrame = 0;

export const getCurrentFrame = () => currentFrame;

export const tween = (time: number, callback: TweenCallback) =>
	new Promise((resolve, reject) =>
		sandglasses.push({
			firstFrame: currentFrame + 1,
			lastFrame: Math.floor(currentFrame + time * fps),
			callback,
			resolve,
			reject,
		})
	);

export const drawScene = async (main: () => Promise<any>) => {
	let mainFlag = true;

	main().then(
		() => (mainFlag = false),
		() => (mainFlag = false)
	);

	while (mainFlag) {
		if (!sandglasses.length) {
			await Promise.resolve();
			continue;
		}

		currentFrame++;

		const sandglassesOut: Array<{
			sandglass: Sandglass;
			rejected: boolean;
			error: any;
		}> = [];

		for (const sandglass of sandglasses) {
			const { firstFrame, lastFrame, callback } = sandglass;
			let outed = false;

			if (firstFrame <= currentFrame && currentFrame <= lastFrame) {
				const value =
					(currentFrame - firstFrame) / (lastFrame - firstFrame);

				try {
					callback(value);
				} catch (error) {
					outed = true;

					sandglassesOut.push({
						sandglass,
						rejected: true,
						error,
					});
				}
			}

			if (currentFrame >= lastFrame && !outed) {
				sandglassesOut.push({
					sandglass,
					rejected: false,
					error: null,
				});
			}
		}

		for (const { sandglass, rejected, error } of sandglassesOut) {
			const index = sandglasses.indexOf(sandglass);

			if (index !== -1) {
				const sandglassOut = sandglasses.splice(index, 1)[0];

				if (rejected) {
					sandglass.reject(error);
				} else {
					sandglassOut.resolve();
				}
			}
		}

		await Promise.resolve();
	}
};
