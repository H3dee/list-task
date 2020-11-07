import React, { useCallback, useEffect, useState } from "react";
import { useHttp } from "../hooks/http.hook";
import CommentsList from "../components/CommentsList";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import "../scss/Comments.scss";

const CommenstPage = () => {
  const [comments, setComments] = useState([]);
  const [amountAll, setAmountAll] = useState(0);
  const [amountParents, setAmountParents] = useState(0);
  const [formContent, setFormContent] = useState("");
  const [modal, setModal] = useState({
    currentId: null,
    content: "",
    show: false,
  });
  const [page, setPage] = useState(1);
  const [currentPages, setCurrentPages] = useState(10);
  const { loading, request } = useHttp();

  const changeFormHandler = (content) => setFormContent(content);

  const changeModalHandler = (content) => setModal({ ...modal, content });

  const closeModalHandler = useCallback(
    () => setModal({ show: false, currentId: null, content: "" }),
    []
  );

  const getComments = useCallback(async () => {
    try {
      const limit = 10;
      const fetched = await request(
        `/api/comment/all?limit=${limit}&offset=${(page - 1) * 10}`,
        "GET"
      );
      setComments(fetched.comments);
      setAmountAll(fetched.amountAll);
      setAmountParents(fetched.amountParents);
    } catch (err) {
      console.log(err);
    }
  }, [request, page]);

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
  }, [getComments, page]);

  const paginationItems = Array.from(
    {
      length:
        Math.round(amountParents / 10) + 1 < currentPages
          ? amountParents % 10 < 3
            ? (amountParents % 10) + 3
            : amountParents % 10
          : 10,
    },
    (_, i) => (
      <div
        className={
          page === currentPages - 10 + (i + 1)
            ? "pagination__item active"
            : "pagination__item"
        }
        key={i}
        onClick={() => setPage(currentPages - 10 + (i + 1))}
      >
        {currentPages - 10 + (i + 1)}
      </div>
    )
  );

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
                  {amountAll}
                </span>
              </div>
            </div>
            <div className="Comments">
              <div className="Comments__content">
                {!loading && comments.length !== 0 && (
                  <CommentsList
                    edit={editHandler}
                    send={sendHandler}
                    remove={removeHandler}
                    comments={comments}
                  />
                )}
                {comments.length === 0 && (
                  <div className="content__alert">
                    There are no comments yet...
                  </div>
                )}
              </div>
              <div className="Comments__pagination-section">
                <div className="pagination-back ">
                  <button
                    onClick={() =>
                      currentPages !== 10 && setCurrentPages(currentPages - 10)
                    }
                    disabled={currentPages === 10}
                  >
                    Back
                  </button>
                </div>
                <div className="pagination__row">
                  {currentPages > 20 && (
                    <div
                      className="pagination__item"
                      onClick={() => {
                        setCurrentPages(10);
                      }}
                    >
                      1 ...
                    </div>
                  )}
                  {paginationItems}
                </div>
                <div className="pagination-next ">
                  <button
                    disabled={Math.round(amountParents / 10) + 1 < currentPages}
                    onClick={() => setCurrentPages(currentPages + 10)}
                  >
                    Next
                  </button>
                </div>
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
