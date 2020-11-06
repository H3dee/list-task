import React from "react";
import Parent from "./Parent";

const CommentsList = (props) => {

  const parents = props.comments.map((comment) => {
    return (
      <Parent
        key={String(comment.id)}
        id={comment.id}
        date={comment.parent.date}
        content={comment.parent.content}
        childs={comment.childs}
        sendData={props.send}
        removeComment={props.remove}
        editComment={props.edit}
      />
    );
  });

  return <>{parents}</>;
};

export default CommentsList;
