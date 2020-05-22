import * as React from "react";
import logo from "./logo.svg";
import "./App.css";
import DisplayPosts from "./components/DisplayPosts";
import CreatePost from "./components/CreatePost";
import { withAuthenticator } from "aws-amplify-react";
import Router from "./components/Router";
import { ThemeProvider } from "styled-components";

function App() {
	return (
		<div className="App">
			<Router />
		</div>
	);
}

export default withAuthenticator(App, true);
