import * as React from "react";
import { listPosts } from "../graphql/queries";
import { API, graphqlOperation } from "aws-amplify";
import { Post } from "../Modals";
import { deletePost } from "../graphql/mutations";
import DeletePost from "./DeletePost";
import EditPost from "./EditPost";
import { GetPostQuery } from "../API";

interface IProps {}
const { useEffect, useState } = React;

const DisplayPosts = (props: IProps) => {
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		getPost().then((res: any) => {
			setPosts(res.data.listPosts.items);
		});
	}, []);

	const getPost = async () => {
		return await API.graphql(graphqlOperation(listPosts));
	};

	return (
		<>
			{posts.map((p) => (
				<div key={p.id}>
					<h1>{p.postTitle}</h1>
					<h3>{p.postBody}</h3>
					<span>{`Wrote by ${p.postOwnerUsername}`}</span>
					<div>
						{`Create at ${new Date(p.createdAt).toDateString()}`}
					</div>
					<br />
					<span>
						<DeletePost />
						<EditPost />
					</span>
				</div>
			))}
		</>
	);
};

export default DisplayPosts;
