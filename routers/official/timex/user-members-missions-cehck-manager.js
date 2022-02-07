const express = require("express");
const auth = require("../../../middlewares/auth");
const router = express.Router();
const { selectQuery } = require("../../../startup/db");

router.get(
  "/swapables/:missionMemberID/:swapMemberID",
  auth,
  async (req, res) => {
    const { MemberID } = req.user;
    const { missionMemberID, swapMemberID } = req.params;

    let result = await selectQuery(
      `EXEC TimexAPI.GetManagerNewMissionSwapableMembers ${MemberID}, ${missionMemberID}, ${swapMemberID}`
    );

    result = result.recordset[0];

    if (result.Error) return res.status(400).send(result);

    for (const key in result) {
      result[key] = JSON.parse(result[key]);
    }

    res.send(result);
  }
);

router.get("/params", auth, async (req, res) => {
  const { MemberID } = req.user;

  let result = await selectQuery(
    `EXEC TimexAPI.GetManagerNewMissionRequestsParams ${MemberID}`
  );

  result = result.recordset[0];

  if (result.Error) return res.status(400).send(result);

  for (const key in result) {
    result[key] = JSON.parse(result[key]);
  }

  res.send(result);
});

router.post("/search", auth, async (req, res) => {
  const { MemberID } = req.user;

  let result = await selectQuery(
    `EXEC TimexAPI.SearchManagerNewMissionRequests ${MemberID}, N'${JSON.stringify(
      req.body
    )}'`
  );

  res.send(result.recordset);
});

router.post("/response", auth, async (req, res) => {
  const { MemberID } = req.user;

  let result = await selectQuery(
    `EXEC TimexAPI.SaveMissionManagerResponse ${MemberID}, N'${JSON.stringify(
      req.body
    )}'`
  );

  result = result.recordset[0];

  if (result.Error) return res.status(400).send(result);

  res.send(result);
});

module.exports = router;
