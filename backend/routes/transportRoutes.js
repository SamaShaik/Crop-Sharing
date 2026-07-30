const express = require("express");
const router = express.Router();

const transportController = require("../controllers/transportController");

router.post(
    "/calculate",
    transportController.calculateTransport
);

module.exports = router;