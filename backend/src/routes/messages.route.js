import express from "express";

const router = express.Router();

router.get("/send", (req, res) => {
  res.send("Message sent endpoints");
});
export default router;
