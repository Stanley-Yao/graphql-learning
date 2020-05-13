import * as React from "react";
import { listPosts } from "../graphql/queries";
import { API, graphqlOperation, APIClass } from "aws-amplify";
import { Post } from "../Modals";
import { deletePost } from "../graphql/mutations";
import DeletePost from "./DeletePost";
import EditPost from "./EditPost";
import { GetPostQuery } from "../API";
import {
	onCreatePost,
	onDeletePost,
	onUpdatePost,
} from "../graphql/subscriptions";
import { Observable } from "rxjs";

interface IProps {}
const { useEffect, useState } = React;

const DisplayPosts = (props: IProps) => {
	const [posts, setPosts] = useState([] as any);
	useEffect(() => {
		console.log(console.log("DisplayPosts -> posts", posts));
		getPost().then((res: any) => {
			setPosts(res.data.listPosts.items);
		});
		onCreatedPost();
		onDeletePostFunc();
		onEditPostFunc();
	}, []);

	useEffect(() => {});

	useEffect(() => {
		return () => {
			onCreatedPost(false);
			onDeletePostFunc(false);
			onEditPostFunc(false);
		};
	}, []);

	const onCreatedPost = async (subscrible = true) => {
		const createPostListener: any = await API.graphql(
			graphqlOperation(onCreatePost)
		);
		if (subscrible) {
			createPostListener.subscribe({
				next: (postData: any) => {
					getPost().then((res: any) => {
						setPosts(res.data.listPosts.items);
					});
				},
			});
		} else {
			createPostListener.unsubscribe();
		}
	};

	const onDeletePostFunc = async (subscrible = true) => {
		const deletePostListener: any = await API.graphql(
			graphqlOperation(onDeletePost)
		);
		if (subscrible) {
			deletePostListener.subscribe({
				next: (postData: any) => {
					getPost().then((res: any) => {
						setPosts(res.data.listPosts.items);
					});
				},
			});
		} else {
			deletePostListener.unsubscribe();
		}
	};

	const onEditPostFunc = async (subscrible = true) => {
		const editPostListener: any = await API.graphql(
			graphqlOperation(onUpdatePost)
		);
		if (subscrible) {
			editPostListener.subscribe({
				next: (postData: any) => {
					getPost().then((res: any) => {
						setPosts(res.data.listPosts.items);
					});
				},
			});
		} else {
			editPostListener.unsubscribe();
		}
	};

	const getPost = async () => {
		return await API.graphql(graphqlOperation(listPosts));
	};

	return (
		<>
			{posts.map((p: any) => (
				<div key={p.id}>
					<h1>{p.postTitle}</h1>
					<h3>{p.postBody}</h3>
					<span>{`Wrote by ${p.postOwnerUsername}`}</span>
					<div>
						{`Create at ${new Date(p.createdAt).toDateString()}`}
					</div>
					<br />
					<span>
						<DeletePost post={p} />
						<EditPost postData={p} id={p.id} />
					</span>
				</div>
			))}
		</>
	);
};

export default DisplayPosts;
