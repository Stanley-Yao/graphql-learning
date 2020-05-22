import React, { useState, useEffect, useContext, FC } from "react";
import { Comment } from "../Modals";
import { Auth } from "aws-amplify";
import { AuthContext } from "./Context";
import { Comment as CommentUI } from "antd";
import moment from "moment";

interface CommentPostProps {
	comment: string;
	commentOwnerUsername: string;
	createdAt: string;
}

const CommentPost: FC<CommentPostProps> = ({
	comment,
	commentOwnerUsername,
	createdAt,
}) => {
	const timeDiff: string = moment(createdAt).fromNow();

	return (
		<CommentUI
			author={commentOwnerUsername}
			datetime={timeDiff}
			content={comment}
		></CommentUI>
	);
};
export default CommentPost;
