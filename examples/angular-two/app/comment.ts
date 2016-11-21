interface CommentI {
    message:string;
    authorEmail:string;
}

export class Comment implements CommentI {
    message:string;
    authorEmail:string;

    constructor(attrs?:CommentI) {
        this.message = attrs && attrs.message;
        this.authorEmail = attrs && attrs.authorEmail;
    }
}