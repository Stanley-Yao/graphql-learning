export type Post = {
	id?: String;
	postOwnerId?: String;
	postOwnerUsername?: String;
	postTitle: String;
	postBody: String;
	createdAt?: String;
	comments?: Comment[];
	likes?: Like;
};

export type Comment = {
	id?: String;
	commentOwnerId?: String;
	commentOwnerUsername?: String;
	post?: Post;
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
