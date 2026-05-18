import formidable from "formidable";
import { createReadStream } from "fs";
import FormData from "form-data";
import fetch from "node-fetch";

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const form = formidable({ maxFileSize: 25 * 1024 * 1024 });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(400).json({ errore: "Errore nel file audio" });

    const file = Array.isArray(files.audio) ? files.audio[0] : files.audio;
    if (!file) return res.status(400).json({ errore: "Nessun file audio ricevuto" });

    try {
      const fd = new FormData();
      fd.append("file", createReadStream(file.filepath), {
        filename: file.originalFilename || "audio.webm",
        contentType: file.mimetype || "audio/webm",
      });
      fd.append("model", "whisper-1");
      fd.append("language", "it");

      const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          ...fd.getHeaders(),
        },
        body: fd,
      });

      if (!response.ok) {
        const txt = await response.text();
        console.error("Whisper error:", txt);
        return res.status(500).json({ errore: "Errore trascrizione" });
      }

      const data = await response.json();
      res.json({ testo: data.text || "" });
    } catch (e) {
      console.error("speech-to-text:", e.message);
      res.status(500).json({ errore: "Errore server" });
    }
  });
}
