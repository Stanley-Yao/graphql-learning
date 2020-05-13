import React from "react";
import { API, graphqlOperation } from "aws-amplify";
import { deletePost } from "../graphql/mutations";
import { Button } from "antd";

interface IProps {
	post: any;
}

export default function DeletePost({ post }: IProps) {
	const handelDeletePost = async (postId: string) => {
		const input = {
			id: postId,
		};
		await API.graphql(graphqlOperation(deletePost, { input }));
	};

	return (
		<div>
			<Button onClick={() => handelDeletePost(post.id)} type="default">
				Delete
			</Button>
		</div>
	);
}
