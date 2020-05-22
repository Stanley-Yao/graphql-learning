import * as React from "react";
import { listPosts, listComments } from "../graphql/queries";
import { API, graphqlOperation, APIClass } from "aws-amplify";
import { Post, Comment } from "../Modals";
import { deletePost } from "../graphql/mutations";
import DeletePost from "./DeletePost";
import EditPost from "./EditPost";
import { GetPostQuery } from "../API";
import {
	onCreatePost,
	onDeletePost,
	onUpdatePost,
	onCreateComment,
} from "../graphql/subscriptions";
import { Observable } from "rxjs";
import CreateCommentPost from "./CreateCommentPost";
import CommentPost from "./CommentPost";
import { List } from "antd/lib/form/Form";

interface IProps {}
const { useEffect, useState } = React;

const DisplayPosts = (props: IProps) => {
	const [posts, setPosts] = useState([] as Post[]);
	useEffect(() => {
		getPost().then((res: any) => {
			setPosts(res.data.listPosts.items);
		});
		onCreatedPost();
		onDeletePostFunc();
		onEditPostFunc();
		createPostComment();
	}, []);

	useEffect(() => {});

	useEffect(() => {
		return () => {
			onCreatedPost(false);
			onDeletePostFunc(false);
			onEditPostFunc(false);
			createPostComment(false);
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
			if (typeof createPostListener === "function")
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
			if (typeof deletePostListener === "function")
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
			if (typeof editPostListener === "function")
				editPostListener.unsubscribe();
		}
	};

	const createPostComment = async (subscrible = true) => {
		const createCommentListener: any = await API.graphql(
			graphqlOperation(onCreateComment)
		);
		if (subscrible) {
			createCommentListener.subscribe({
				next: (postData: any) => {
					getComments().then((res: any) => {
						getPost().then((res: any) => {
							setPosts(res.data.listPosts.items);
						});
					});
				},
			});
		} else {
			if (typeof createCommentListener === "function")
				createCommentListener.unsubscribe();
		}
	};

	const getPost = async () => {
		return await API.graphql(graphqlOperation(listPosts));
	};

	const getComments = async () => {
		return await API.graphql(graphqlOperation(listComments));
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

					{p.comments.items.length > 0 && (
						<span>
							Comments:
							{p.comments.items.map((c: any, i: number) => {
								return (
									<CommentPost
										key={i}
										comment={c.content}
										createdAt={c.createdAt}
										commentOwnerUsername={
											c.commentOwnerUsername
										}
									/>
								);
							})}
						</span>
					)}
					<span>
						<CreateCommentPost postId={p.id} />
					</span>
				</div>
			))}
		</>
	);
};

export default DisplayPosts;
