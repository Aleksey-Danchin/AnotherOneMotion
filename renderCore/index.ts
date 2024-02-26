import puppeteer from "puppeteer";
import ReactDOMServer from "react-dom/server";
import fs from "fs";

export type RenderFrameProps = {
	screenWidth: number;
	screenHeight: number;
	screenshotDirectionName: string;
	frameFileNamePredicant: string;
	tempHTMLFileName: string;
	removeBodyPadding: boolean;
};

export type FrameProps = {
	name: any;
	rootElement: React.JSX.Element;
};

export const renderFrames = async (
	props: RenderFrameProps,
	frames: FrameProps[]
) => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	await page.setViewport({
		width: props.screenWidth,
		height: props.screenHeight,
	});

	fs.writeFileSync(props.tempHTMLFileName, "", "utf8");
	await page.goto(`file://${process.cwd()}/temp.html`);

	// for (let i = 0; i < frames.length; i++) {
	for (const { name, rootElement } of frames) {
		const path = `${props.screenshotDirectionName}/${
			props.frameFileNamePredicant
		}${String(name)}.png`;

		console.time(path);

		const str = ReactDOMServer.renderToString(rootElement);
		fs.writeFileSync(props.tempHTMLFileName, str, "utf8");

		await page.reload();

		if (props.removeBodyPadding) {
			await page.evaluate(() => (document.body.style.padding = "0px"));
		}

		await page.screenshot({
			path: `${props.screenshotDirectionName}/${
				props.frameFileNamePredicant
			}${String(name)}.png`,
		});

		console.timeEnd(path);
	}

	await browser.close();
	fs.unlinkSync(props.tempHTMLFileName);
};
