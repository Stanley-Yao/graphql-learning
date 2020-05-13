import * as React from "react";
import { Post } from "../Modals";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { createPost } from "../graphql/mutations";
import { Button, Form, Input } from "antd";
import TextArea from "antd/lib/input/TextArea";

interface IProps {
	callback?: Function;
}

const { useEffect, useState } = React;

const initPost = {
	postOwnerId: "",
	postOwnerUsername: "",
	postTitle: "",
	postBody: "",
} as any;

const layout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 16 },
};
const tailLayout = {
	wrapperCol: { offset: 8, span: 16 },
};

export default function CreatePost({ callback }: IProps) {
	const [post, setPost] = useState(initPost);

	useEffect(() => {
		auth();
	}, []);

	//auth
	const auth = async () => {
		await Auth.currentUserInfo().then((user) => {
			setPost({
				...post,
				postOwnerId: user.attributes.sub,
				postOwnerUsername: user.username,
			});
		});
	};

	const handlePost = async (values: any) => {
		const { postOwnerId, postOwnerUsername } = post;
		const { postTitle, postBody } = values;
		const input = {
			postOwnerId,
			postOwnerUsername,
			postTitle,
			postBody,
			createdAt: new Date().toISOString(),
		} as Post;

		await API.graphql(graphqlOperation(createPost, { input }));
		setPost(initPost);
		if (callback) {
			callback();
		}
	};

	const handelChange = (e: any) => {
		setPost({ ...post, [e.target.name]: e.target.value });
	};

	return (
		<Form onFinish={handlePost}>
			<Form.Item
				label="Title"
				name="postTitle"
				{...layout}
				rules={[
					{ required: true, message: "Post title cannot be empty" },
				]}
			>
				<Input />
			</Form.Item>
			<Form.Item
				label="New post content"
				name="postBody"
				{...layout}
				rules={[
					{
						required: true,
						message: "New post content cannot be empty",
					},
				]}
			>
				<TextArea />
			</Form.Item>
			<Form.Item {...tailLayout}>
				<Button htmlType="submit" type="primary">
					CreatePost
				</Button>
			</Form.Item>
		</Form>
	);
}
