import React, { useRef, useEffect } from "react";
import "../scss/Modal.scss";

const Modal = (props) => {
  const areaRef = useRef(null);

  useEffect(() => {
    areaRef.current.focus();
  }, []);

  return (
    <div className={props.modalState.show ? "Modal open" : "Modal close"}>
      <div className="Modal__overlay">
        <div className="Modal__window">
          <div className="Modal__body">
            <div className="body__area">
              <textarea
                name="edit__form"
                id="form"
                cols="30"
                rows="5"
                ref={areaRef}
                value={props.modalState.content}
                onChange={(e) => props.changeHandler(e.target.value)}
              ></textarea>
            </div>
          </div>
          <div className="Modal__footer">
            <div className="footer__buttons">
              <button onClick={props.closeModal}>Close</button>
              <button onClick={props.enterHandler}>Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
