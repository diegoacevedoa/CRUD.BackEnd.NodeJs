import app from "./app";

app.listen(app.get("port"));

console.log(`Server corriendo en http://localhost:${app.get("port")}`);
