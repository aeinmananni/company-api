const express = require("express");
const auth = require("../../middlewares/auth");
const router = express.Router();
const { selectQuery } = require("../../startup/db");

router.get("/", auth, async (req, res) => {
  const { MemberID } = req.user;

  let result = await selectQuery(`EXEC OrgAPI.GetAllCompanies ${MemberID}`);

  result = result.recordset;

  res.send(result);
});

router.get("/params", auth, async (req, res) => {
  const { MemberID } = req.user;

  let result = await selectQuery(`EXEC OrgAPI.GetCompaniesParams ${MemberID}`);

  result = result.recordset[0];

  for (const key in result) {
    result[key] = JSON.parse(result[key]);
  }

  res.send(result);
});

router.post("/search", auth, async (req, res) => {
  const { searchText } = req.body;
  const { MemberID } = req.user;

  let result = await selectQuery(
    `EXEC OrgAPI.SearchCompanies ${MemberID}, N'${searchText}'`
  );

  res.send(result.recordset);
});

router.post("/", auth, async (req, res) => {
  const { MemberID } = req.user;

  let result = await selectQuery(
    `EXEC OrgAPI.SaveCompany ${MemberID}, N'${JSON.stringify(req.body)}'`
  );

  result = result.recordset[0];

  if (result.Error) return res.status(400).send(result);

  res.send(result);
});

router.delete("/:recordID", auth, async (req, res) => {
  const { MemberID } = req.user;

  let result = await selectQuery(
    `EXEC OrgAPI.DeleteCompany ${MemberID}, ${req.params.recordID}`
  );

  result = result.recordset[0];

  if (result.Error) return res.status(400).send(result);

  res.send(result);
});

module.exports = router;
