import app from './app.js';

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`); 
})

// ✅ Esto es válido en ES Module:
import path from "path";

// Servir React desde Express (después de tus rutas API)
app.use(express.static(path.join(__dirname, "..", "client", "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
});
