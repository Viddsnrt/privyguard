const express = require("express");
const router = express.Router();
const multer = require("multer");
const scannerController = require("./scanner.controller");

// Konfigurasi Multer untuk menyimpan file di RAM sementara (sangat cepat untuk MVP)
const upload = multer({ storage: multer.memoryStorage() });

// Endpoint POST /api/scanner
router.post("/", upload.single("file"), scannerController.scanFile);

// Endpoint GET /api/scanner (Riwayat)
router.get("/", scannerController.getHistory);

module.exports = router;