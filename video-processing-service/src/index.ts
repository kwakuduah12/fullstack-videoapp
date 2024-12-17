import express from 'express';
import ffmpeg from "fluent-ffmpeg";

const app = express();
const port = process.env.PORT || 3000;

app.post('/process-video', (req, res) => {
  // Get path of input video from request body
  const inFilePath = req.body.inFilePath;
  const outfilePath = req.body.outFilePath;

  if (!inFilePath || !outfilePath){
    res.status(400).send(`Bad Request: Missing ${!req.body.inFilePath ? "inFilePath" : "outFilePath"}`);
  }

  ffmpeg(inFilePath)
    .outputOptions("-vf", "scale=-1:360")
    .on("end", () => {
      console.log("Video processing finished");
      res.status(200).send(`Video processing finished`);
    })
    .on("error", (err) => {
      console.log(`Error processing video: ${err.message}`);
      res.status(500).send(`Internal server error: ${err.message}`);
    })
    .save(outfilePath);
});

app.listen(port, () => {
  console.log(`Video processing service listening at http://localhost:${port}`);
});

