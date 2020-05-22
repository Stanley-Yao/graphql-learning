import * as React from "react";
import { listPosts, listComments } from "../graphql/queries";
import { API, graphqlOperation, APIClass } from "aws-amplify";
import { Post, Comment } from "../Modals";
import { deletePost, createLike } from "../graphql/mutations";
import DeletePost from "./DeletePost";
import EditPost from "./EditPost";
import { GetPostQuery } from "../API";
import {
	onCreatePost,
	onDeletePost,
	onUpdatePost,
	onCreateComment,
	onCreateLike,
} from "../graphql/subscriptions";
import CreateCommentPost from "./CreateCommentPost";
import CommentPost from "./CommentPost";
import { FaThumbsUp } from "react-icons/fa";
import { message, Tooltip, Popover, Typography } from "antd";
import classnames from "classnames";

interface IProps {}
const { useEffect, useState } = React;

const DisplayPosts = (props: IProps) => {
	const [posts, setPosts] = useState([] as Post[]);
	const [postLikedBy, setPostLikedBy] = useState([] as any);
	const [error, setError] = useState("");
	const [hovering, setHovering] = useState(false);

	const ownerId = sessionStorage.getItem("userId");
	const username = sessionStorage.getItem("username");

	useEffect(() => {
		getPost().then((res: any) => {
			setPosts(res.data.listPosts.items);
		});
		onCreatedPost();
		onDeletePostFunc();
		onEditPostFunc();
		createPostComment();
		createPostLike();
	}, []);

	useEffect(() => {});

	useEffect(() => {
		return () => {
			onCreatedPost(false);
			onDeletePostFunc(false);
			onEditPostFunc(false);
			createPostComment(false);
			createPostLike(false);
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

	const createPostLike = async (subscrible = true) => {
		const createPostLikeListener: any = await API.graphql(
			graphqlOperation(onCreateLike)
		);
		if (subscrible) {
			createPostLikeListener.subscribe({
				next: (postData: any) => {
					getPost().then((res: any) => {
						setPosts(res.data.listPosts.items);
					});
				},
			});
		} else {
			if (typeof createPostLikeListener === "function")
				createPostLikeListener.unsubscribe();
		}
	};

	const getPost = async () => {
		return await API.graphql(graphqlOperation(listPosts));
	};

	const getComments = async () => {
		return await API.graphql(graphqlOperation(listComments));
	};

	const likedPost = (postId: string) => {
		for (let post of posts) {
			if (post.id === postId) {
				if (post.postOwnerId === ownerId) return true;

				for (let like of post.likes.items) {
					if (like.likeOwnerId === ownerId) {
						return true;
					}
				}
			}
		}

		return false;
	};

	const handleLike = async (postId: string) => {
		if (likedPost(postId)) {
			return setError("You cannot like post twice");
		}
		const input = {
			numberLikes: 1,
			likeOwnerId: ownerId,
			likeOwnerUsername: username,
			likePostId: postId,
		};

		try {
			const result = await API.graphql(
				graphqlOperation(createLike, { input })
			);
			console.log("Liked:", result);
		} catch (e) {
			console.log(e.toString());
			message.error(e.toString());
		}
	};

	const handelMouseHover = async (postId: string) => {
		setHovering(!hovering);
		let innerLikes = postLikedBy;

		for (let p of posts) {
			if (p.id === postId) {
				for (let like of p.likes.items) {
					innerLikes.push(like.likeOwnerUsername);
				}
			}
			setPostLikedBy(innerLikes);
		}
		console.log("post liked by: ", postLikedBy);
	};

	const onMouseLeave = () => {
		setHovering(!hovering);
		setPostLikedBy([]);
	};

	const { Title, Paragraph, Text } = Typography;

	return (
		<>
			{posts.map((p: any) => (
				<div key={p.id}>
					<Typography>
						<Title>{p.postTitle}</Title>
						<Paragraph>{p.postBody}</Paragraph>
					</Typography>

					<span>{`Wrote by ${p.postOwnerUsername}`}</span>
					<div>
						{`Create at ${new Date(p.createdAt).toDateString()}`}
					</div>
					<br />
					<p
						onMouseEnter={() => handelMouseHover(p.id)}
						onMouseLeave={onMouseLeave}
					>
						<Tooltip title={postLikedBy.join(",")}>
							<FaThumbsUp
								onClick={(e) => handleLike(p.id)}
								className={classnames(
									likedPost(p.id) ? `blue` : `grey`,
									"pointer"
								)}
							/>
						</Tooltip>

						{p.likes.items.length}
					</p>
					{error.length > 0 && <p className="error">{error}</p>}

					<span>
						{p.postOwnerId === ownerId && <DeletePost post={p} />}
						{p.postOwnerId === ownerId && (
							<EditPost postData={p} id={p.id} />
						)}
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
