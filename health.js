
import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/health", (req, res) => {
  res.json({
    service: "VYRO AI",
    version: "6.2",
    status: "healthy"
  });
});

app.listen(PORT, () => {
  console.log(`Health check running on port ${PORT}`);
});
