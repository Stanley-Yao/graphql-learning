import * as React from "react";
import { Auth, API, graphqlOperation } from "aws-amplify";
import { Modal, Button, Input } from "antd";
import { updatePost } from "../graphql/mutations";

interface IProps {
	postData: any;
	id: string;
}
const { useState, useEffect } = React;

export default function EditPost({ postData, id }: IProps) {
	const [show, setShow] = useState(false);
	const [post, setPost] = useState({} as any);
	useEffect(() => {
		setPost(postData);
	}, []);

	const getCurrentUserInfo = async () => {
		await Auth.currentUserInfo().then((user) => {
			setPost({
				...post,
				postOwnerId: user.attributes.sub,
				postOwnerUsername: user.username,
			});
		});
	};

	const handelModal = () => {
		setShow(!show);
	};

	const handelChange = (e: any) =>
		setPost({
			...post,
			[e.target.name]: e.target.value,
		});

	const handelSubmitEdit = async () => {
		const { postOwnerId, postOwnerUsername, postTitle, postBody } = post;
		const input = {
			id,
			postOwnerId,
			postOwnerUsername,
			postTitle,
			postBody,
		};
		await API.graphql(graphqlOperation(updatePost, { input }));
		setShow(!show);
	};

	return (
		<>
			<Modal
				visible={show}
				onCancel={handelModal}
				onOk={handelSubmitEdit}
			>
				<form>
					<Input
						placeholder="Title"
						value={post.postTitle}
						name="postTitle"
						onChange={handelChange}
					/>
					<Input
						placeholder="Body"
						value={post.postBody}
						name="postBody"
						onChange={handelChange}
					/>
				</form>
			</Modal>
			<Button onClick={handelModal}>Edit</Button>
		</>
	);
}
