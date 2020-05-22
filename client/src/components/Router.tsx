import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import DisplayPosts from "./DisplayPosts";
import CreatePost from "./CreatePost";

const app = () => (
	<div>
		<CreatePost />
		<DisplayPosts />
	</div>
);

export default function Router() {
	return (
		<BrowserRouter>
			<Route path="/" component={app} />
		</BrowserRouter>
	);
}
