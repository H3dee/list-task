import React, { useState } from "react";
import Child from "./Child";
import Form from "./Form";

const Parent = (props) => {
  const [showForm, setShowForm] = useState(false);
  const [showMore, setShowMore] = useState({
    limit: 2,
    btnVisibility: false,
  });
  const [areaContent, setAreaContent] = useState("");

  const changeAreaHandler = (content) => setAreaContent(content);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const showBtnClickHandler = () => {
    if (showMore.limit <= props.childs.length)
      setShowMore((prev) => ({ ...showMore, limit: prev.limit + 3 }));
    else  setShowMore({ ...showMore, btnVisibility: true });
  };

  const childs = props.childs
    .slice(0, showMore.btnVisibility ? props.childs.length : showMore.limit)
    .map((child) => {
      return (
        <Child
          key={String(child.id)}
          childId={child.id}
          childDate={child.created_at}
          childContent={child.content}
          editChild={props.editComment}
          removeChild={props.removeComment}
        />
      );
    });

  return (
    <div className="Comment">
      <div className="Comment__body">
        <div className="body__head">
          <div className="head__date">
            {props.date || new Date().toLocaleString()}
          </div>
          <div className="head__actions">
            <div className="head__edit-comment">
              <button
                onClick={() => props.editComment(props.id, props.content)}
              >
                Edit
              </button>
            </div>
            <div className="head__delete-comment">
              <img
                onClick={() => props.removeComment(props.id)}
                src="https://www.flaticon.com/svg/static/icons/svg/61/61155.svg"
                alt=" "
              />
            </div>
          </div>
        </div>
        <div className="body__message">{props.content}</div>
        <div className="body__reply">
          <button className="reply__btn" onClick={toggleForm}>
            Reply
          </button>
        </div>
      </div>
      <div className="Comment__reply-form">
        {showForm && (
          <Form
            commentId={props.id}
            areaContent={areaContent}
            changeHandler={changeAreaHandler}
            sendHandler={props.sendData}
          />
        )}
      </div>
      <div className="Comment__childs">
        {childs}
        <div className="childs__toggle">
          {props?.childs?.length > 2 &&
            !showMore.btnVisibility &&
            (showMore.limit <= props.childs.length) &&
              (
              <button onClick={showBtnClickHandler}>Show more...</button>
            )}
        </div>
      </div>
    </div>
  );
};

export default Parent;
