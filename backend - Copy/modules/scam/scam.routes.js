const express = require("express");
const router = express.Router();
const { checkScamLink } = require("./scam.controller");

// Endpoint: POST http://localhost:5000/api/scam/check-link
router.post("/check-link", checkScamLink);

module.exports = router;