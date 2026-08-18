require("dotenv").config();
const express = require("express");
const cors = require("cors")
const app = express();
const PORT = process.env.PORT || 5000;



/*
 *MIDDLEWARE
*/
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



/*
 * IMPORT ROUTES
*/
const authRoutes = require("./modules/auth/auth.routes");
const scannerRoutes = require("./modules/scanner/scanner.routes");
const scamRoutes = require("./modules/scam/scam.routes");



/*
 * REGISTER ROUTES
*/
app.use("/api/auth", authRoutes); 
app.use("/api/scanner", scannerRoutes);
app.use("/api/scam", scamRoutes);


/*
 * HEALTH CHECK ( BAWAAN )
*/
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "PrivyGuard backend is running.",
    timestamp: new Date().toISOString(),
  });
});



/* 
 *404 HANDLER
*/
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found.",
    path: req.originalUrl,
  });
});



/*
 *ERROR HANDLER
*/
app.use((error, req, res, next) => {
  console.error("Backend Error:", error);
  res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
});



/*
 *START SERVER
*/
app.listen(PORT, () => {
  console.log("======================================");
  console.log("       PRIVYGUARD BACKEND");
  console.log("======================================");
  console.log(`Server running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
  console.log("======================================");
});