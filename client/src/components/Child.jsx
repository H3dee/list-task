import React from "react";

const Child = (props) => {
  
  return (
    <div className="child">   
      <div className="Comment__body">
        <div className="body__head">
          <div className="head__date">
            {props.childDate || new Date().toLocaleString()}
          </div>
          <div className="head__actions">
            <div className="head__edit-comment">
              <button onClick={() => props.editChild(props.childId, props.childContent)}>Edit</button>
            </div>
            <div className="head__delete-comment">
              <img
                onClick={() => props.removeChild(props.childId)}
                src="https://www.flaticon.com/svg/static/icons/svg/61/61155.svg"
                alt=" "
              />
            </div>
          </div>
        </div>
        <div className="body__message">{props.childContent}</div>
      </div>
    </div>
  );
};

export default Child