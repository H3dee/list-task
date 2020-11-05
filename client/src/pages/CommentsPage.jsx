import React, { useCallback, useEffect, useState } from "react";
import { useHttp } from "../hooks/http.hook";
import CommentsList from "../components/CommentsList";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import "../scss/Comments.scss";

const CommenstPage = () => {
  const [comments, setComments] = useState([]);
  const [amount, setAmount] = useState(0);
  const [formContent, setFormContent] = useState("");
  const [modal, setModal] = useState({
    currentId: null,
    content: "",
    show: false,
  });
  const { loading, request } = useHttp();

  const getComments = useCallback(async () => {
    try {
      const fetched = await request("/api/comment/all", "GET", null, {}); //?limit=5&offset=5
      setComments(fetched.comments);
      setAmount(fetched.amount);
    } catch (err) {
      console.log(err);
    }
  }, [request]);

  const changeFormHandler = (content) => setFormContent(content);

  const changeModalHandler = (content) => setModal({ ...modal, content });

  const closeModalHandler = useCallback(
    () => setModal({ show: false, currentId: null, content: "" }),
    []
  );

  const enterHandler = useCallback(async () => {
    try {
      if (modal.content) {
        await request("/api/comment/update", "POST", {
          content: modal.content,
          id: modal.currentId,
        });

        closeModalHandler();
        getComments();
      }
    } catch (err) {
      console.log(err);
    }
  }, [request, closeModalHandler, getComments, modal.content, modal.currentId]);

  const editHandler = (id, content) => {
    setModal({ show: true, currentId: id, content });
  };

  const sendHandler = useCallback(
    async (id = null, content) => {
      if (content) {
        try {
          await request("/api/comment/add", "POST", {
            content,
            id,
          });

          setFormContent("");
          getComments();
        } catch (err) {
          console.log(err);
        }
      }
    },
    [request, getComments]
  );

  const removeHandler = useCallback(
    async (commentId) => {
      try {
        await request("/api/comment/remove", "DELETE", {
          id: String(commentId),
        });
        getComments();
      } catch (err) {
        console.log(err);
      }
    },
    [getComments, request]
  );

  useEffect(() => {
    getComments();
  }, [getComments]);

  return (
    <>
      <Loader active={loading} />
      <div className="Content">
        <div className="container">
          <div className="Content__row">
            <div className="Comments__head">
              <div className="head__title">
                Comments:
                <span id="total" className="head__count">
                  {amount}
                </span>
              </div>
            </div>
            <div className="Comments">
              <div className="Comments__content">
                {!loading && (
                  <CommentsList
                    edit={editHandler}
                    send={sendHandler}
                    remove={removeHandler}
                    comments={comments}
                  />
                )}
              </div>
              <div className="Comments__form">
                <div className="form__title">Leave a comment</div>
                <div className="form__body">
                  <div className="form__area">
                    <textarea
                      name="main__form"
                      id="form"
                      cols="30"
                      rows="5"
                      value={formContent}
                      onChange={(e) => changeFormHandler(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="form__button">
                    <button onClick={() => sendHandler(null, formContent)}>
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {modal.show && (
        <Modal
          modalState={modal}
          closeModal={closeModalHandler}
          changeHandler={changeModalHandler}
          enterHandler={enterHandler}
        />
      )}
    </>
  );
};

export default CommenstPage;
