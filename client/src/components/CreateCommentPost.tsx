import React, { useState, useEffect, useContext, FC } from "react";
import { Comment } from "../Modals";
import { Auth, API, graphqlOperation } from "aws-amplify";
import { AuthContext } from "./Context";
import { Form, Input, Button } from "antd";
import { createComment } from "../graphql/mutations";
import { Store } from "antd/lib/form/interface";

interface CreateCommentPostProps {
	postId: string;
}

interface CommentContentType {
	content: string;
}

const CreateCommentPost: FC<CreateCommentPostProps> = ({ postId }) => {
	const [comment, setComment] = useState<Comment>({
		postId: "",
	});

	const auth = useContext(AuthContext);


	const layout = {
		labelCol: { span: 8 },
		wrapperCol: { span: 16 },
	};

	const tailLayout = {
		wrapperCol: { offset: 8, span: 16 },
	};

	const handelAddComment = async (values: Store) => {
		const createCommentAPI = new Promise((resolve, reject) => {
			const input = {
				commentPostId: postId,
				commentOwnerId: sessionStorage.getItem("userId"),
				commentOwnerUsername: sessionStorage.getItem("username"),
				content: values.content,
				createdAt: new Date().toISOString(),
			};

			try {
				resolve(
					API.graphql(graphqlOperation(createComment, { input }))
				);
			} catch (e) {
				reject(e.toString());
			}
		});

		createCommentAPI
			.then((res) => (values.content = "successful"))
			.catch((e) => console.log(e));
	};

	return (
		<>
			<Form onFinish={handelAddComment}>
				<Form.Item
					label="Comment Content"
					name="content"
					{...layout}
					rules={[
						{
							required: true,
							message: "Comment cannot be empty",
						},
					]}
				>
					<Input />
				</Form.Item>

				<Form.Item {...tailLayout}>
					<Button htmlType="submit">Create Comment</Button>
				</Form.Item>
			</Form>
		</>
	);
};
export default CreateCommentPost;
