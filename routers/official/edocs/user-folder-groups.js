const express = require("express");
const auth = require("../../../middlewares/auth");
const router = express.Router();
const { selectQuery } = require("../../../startup/db");

router.get("/", auth, async (req, res) => {
  const { MemberID } = req.user;

  let result = await selectQuery(
    `EXEC EDocsAPI.GetAllFolderGroups ${MemberID}`
  );

  result = result.recordset;

  res.send(result);
});

router.post("/search", auth, async (req, res) => {
  const { searchText } = req.body;
  const { MemberID } = req.user;

  let result = await selectQuery(
    `EXEC EDocsAPI.SearchFolderGroups ${MemberID}, N'${searchText}'`
  );

  res.send(result.recordset);
});

router.post("/", auth, async (req, res) => {
  const { MemberID } = req.user;

  let result = await selectQuery(
    `EXEC EDocsAPI.SaveFolderGroup ${MemberID}, N'${JSON.stringify(req.body)}'`
  );

  result = result.recordset[0];

  if (result.Error) return res.status(400).send(result);

  res.send(result);
});

router.delete("/:recordID", auth, async (req, res) => {
  const { MemberID } = req.user;

  let result = await selectQuery(
    `EXEC EDocsAPI.DeleteFolderGroup ${MemberID}, ${req.params.recordID}`
  );

  result = result.recordset[0];

  if (result.Error) return res.status(400).send(result);

  res.send(result);
});

module.exports = router;
