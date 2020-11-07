const { Router } = require("express");
const client = require("../db");
const router = Router();

router.get("/all", async (req, res) => {
  try {
    let query = "SELECT * FROM big WHERE parent_id IS NULL";
    const { offset, limit } = req.query;

    if (req.query && offset) {
      query += ` OFFSET ${offset}`;
    }

    if (req.query && limit) {
      query += ` LIMIT ${limit}`;
    }

    const results = await client.query(query);
    let amountAll = await client.query('SELECT COUNT(*) FROM big;');
    let amountParents = await client.query('SELECT COUNT(*) FROM big WHERE parent_id IS NULL;')
    amountAll = amountAll.rows[0].count
    amountParents = amountParents.rows[0].count

    if (!results) {
      return res.json({
        message: "There are no comments yet",
      });
    }

    const comments = results.rows
      .map((row) => {
        return {
          id: row.id,
          parent: {
            date: new Date(row.created_at).toLocaleString(),
            content: row.content,
          },
          childs: [],
        };
      })
      .filter((row) => row);

    comments.forEach(async (comment) => {
      try {
        const childs = await client.query(
          "SELECT * FROM big WHERE parent_id = $1",
          [comment.id]
        );
        if (childs.rows.length !== 0) comment.childs = [...childs.rows];
      } catch (err) {
        console.log(err);
      }
    });

    for (const comment of comments) {
      const childs = await client.query(
        "SELECT * FROM big WHERE parent_id = $1",
        [comment.id]
      );
      if (childs.rows.length !== 0) {
        comment.childs = [...childs.rows];
        comment.childs.forEach((child) => {
          child.created_at = new Date(child.created_at).toLocaleString();
        });
      }
    }

    comments.sort((a, b) => {
      const dateA = new Date(a.parent.date);
      const dateB = new Date(b.parent.date);

      return dateA - dateB;
    });

    comments.forEach((comment) => {
      comment.childs.sort((a, b) => {

        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);

        return dateA - dateB;
      });
    });


    res.json({ comments, amountAll, amountParents });
  } catch (err) {
    console.log("Get request error:", err);
    res.status(400).json({
      message: "Failed to get",
    });
  }
});

router.post("/add", async (req, res) => {
  try {
    const { content, id } = req.body;
    let query = "INSERT INTO big(content) VALUES($1)";
    const values = [content];

    if (id) {
      query = "INSERT INTO big(content, parent_id) VALUES($1, $2)";
      values.push(id);
    }

    const addComment = await client.query(query, values);

    res.json({
      message: "Successfully added",
    });
  } catch (err) {
    console.log("Add request error:", err);
    res.status(400).json({
      message: "Failed to add",
    });
  }
});

router.delete("/remove", async (req, res) => {
  try {
    const { id } = req.body;

    const deleteComment = await client.query(
      "DELETE FROM big WHERE id = ($1)",
      [id]
    );

    res.json({
      message: "Successfully removed",
    });
  } catch (err) {
    console.log("Delete request error:", err);
    res.status(400).json({
      message: "Failed to delete",
    });
  }
});

router.post("/update", async (req, res) => {
  try {
    const { id, content } = req.body;

    const updateComment = await client.query(
      "UPDATE big SET content = $1 WHERE id = $2",
      [content, id]
    );

    res.json({
      message: "Successfully updated",
    });
  } catch (err) {
    console.log("Update error:", err);
    res.status(400).json({
      message: "Failed to update",
    });
  }
});

module.exports = router;
