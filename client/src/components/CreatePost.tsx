import React from "react";

interface IProps {}

export default function CreatePost() {
	return (
		<form>
			<input type="text" placeholder="Title" name="postTitle" required />
			<textarea
				typeof="text"
				name="postBody"
				rows={3}
				cols={40}
				required
				placeholder="new blog post"
			/>
			<input type="submit" className="btn" />
		</form>
	);
}
