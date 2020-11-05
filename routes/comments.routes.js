const { Router } = require("express");
const client = require("../db");
const router = Router();

router.get("/all", async (req, res) => {
  try {

    let query = "SELECT * FROM list";
    const {offset, limit} = req.query

    if (req.query && offset) {
      query += ` OFFSET ${offset}`;
    }

    if (req.query && limit) {
      query += ` LIMIT ${limit}`;
    }

    const results = await client.query(query);
    const amount = results.rows.length;

    if (!results) {
      return res.json({
        message: "There are no comments yet",
      });
    }
    

    const comments = results.rows
      .map((row) => {
        if (!row.parent_id)
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

    results.rows.forEach((row) => {
      if (row.parent_id) {
        const index = comments.findIndex(
          (comment) => comment.id === row.parent_id
        );
        comments[index].childs.push({
          id: row.id,
          date: new Date(row.created_at).toLocaleString(),
          content: row.content,
        });
      }
    });

    comments.sort((a, b) => {
      const dateA = new Date(a.parent.date);
      const dateB = new Date(b.parent.date);

      return dateA - dateB;
    });

    comments.forEach((comment) => {
      comment.childs.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        return dateA - dateB;
      });
    });

    res.json({ comments, amount });
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
    let query = "INSERT INTO list(content) VALUES($1)";
    const values = [content];

    if (id) {
      query = "INSERT INTO list(content, parent_id) VALUES($1, $2)";
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
      "DELETE FROM list WHERE id = ($1)",
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
      "UPDATE list SET content = $1 WHERE id = $2",
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
