export type Post = {
	id?: String;
	postOwnerId?: String;
	postOwnerUsername?: String;
	postTitle: String;
	postBody: String;
	createdAt?: String;
	comments?: any[];
	likes?: any;
};

export type Comment = {
	id?: String;
	commentOwnerId?: String;
	commentOwnerUsername?: String;
	postId?: string;
	content?: String;
	createdAt?: String;
};

export type Like = {
	id?: String;
	numberLikes?: Number;
	likeOwnerId?: String;
	likeOwnerUsername?: String;
	post?: Post;
};
