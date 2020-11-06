import React from "react";

const Form = (props) => {
  return (
    <div className="form__body">
      <div className="form__area">
        <textarea
          name="main__form"
          id="form"
          cols="30"
          rows="5"
          value={props.areaContent}
          onChange={(e) => props.changeHandler(e.target.value)}
        ></textarea>
      </div>
      <div className="form__button">
        <button
          onClick={() => props.sendHandler(props.commentId, props.areaContent)}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Form;
