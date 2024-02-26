import React from "react";
import { FrameProps, RenderFrameProps, renderFrames } from "../renderCore";

const props: RenderFrameProps = {
	screenWidth: 1920,
	screenHeight: 1080,
	screenshotDirectionName: "frames",
	frameFileNamePredicant: "frame_",
	tempHTMLFileName: "temp.html",
	removeBodyPadding: true,
};

const frames: FrameProps[] = [
	{ name: 1, rootElement: <p>1</p> },
	{ name: 2, rootElement: <p>2</p> },
	{ name: 3, rootElement: <p>3</p> },
];

renderFrames(props, frames).catch(console.error);
