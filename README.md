	PASOS DESARROLLO NODEJS

Ayudas: node --help
1- Instalar nodej si no lo tiene instalado en la máquina

2- Crear el proyecto nodejs: npm init -y  --> (-y) es para todas las opciones.

3- Instalar express, sql, nodemon: npm install express mssql nodemon cors dotenv express-validator morgan

4- Instalar npm i --save-dev @types/express

5- Instalar babel: npm i @babel/cli 

6- Instalar babel: npm i @babel/core 

7- Instalar babel: npm i @babel/node 

8- Instalar babel: npm i @babel/plugin-transform-runtime 

9- Instalar babel: npm i @babel/preset-env 

10- Creamos archivo babel para desarrollo moderno y poder usar los import: .babelrc 

{
  "presets": ["@babel/preset-env"],
  "plugins": ["@babel/plugin-transform-runtime"]
}


11- Creamos archivo: .gitignore

.env
node_modules
request
dist


12-Agregar script en package.json:  "dev": "nodemon --exec npx babel-node src/index.js",

13-Agregar script en package.json:  "build": "babel src -d dist",

14-Agregar script en package.json:  "start": "node dist"

15-Creamos archivo de las variables de entorno .env

PORT = 5000
DB_USER = "diego.acevedo"
DB_PASSWORD = "Medellin1*"
DB_SERVER = "localhost"
DB_DATABASE = "Prueba"

16-Creamos carpeta src. 

17-Creamos archivo config.js en carpeta src: 

import { config } from "dotenv";

config();

export default {
  port: process.env.PORT || 4000,
  dbUser: process.env.DB_USER || "",
  dbPassword: process.env.DB_PASSWORD || "",
  dbServer: process.env.DB_SERVER || "",
  dbDataBase: process.env.DB_DATABASE || "",
};


18-Creamos archivo app.js en carpeta src :

import express from "express";
import config from "./config";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json";
import personaRoutes from "./routes/persona.routes";

const app = express();

//settings
app.set("port", config.port);

//middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//routes
app.use("/api", personaRoutes);

export default app;



19-Creamos archivo index.js en carpeta src:

import app from "./app";

app.listen(app.get("port"));

console.log(`Server corriendo en http://localhost:${app.get("port")}`);

20- Creamos carpeta database en carpeta src.

21- Creamos archivo connection.js en carpeta database:

import sql from "mssql";
import config from "../config";

const dbsettings = {
  user: config.dbUser,
  password: config.dbPassword,
  server: config.dbServer,
  database: config.dbDataBase,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

export async function getConnection() {
  try {
    const pool = await sql.connect(dbsettings);
    return pool;
  } catch (error) {
    console.log(error);
  }
}

export { sql };




22- Creamos archivo persona.queries.js en carpeta database:


export const PersonaQueries = {
  findAllPersonas: "SELECT * FROM Persona",
  findOnePersona: `SELECT * FROM Persona WHERE IdPersona = @IdPersona`,
  createPersona:
    "INSERT INTO Persona (NoDocumento, Nombres, Apellidos) VALUES (@NoDocumento, @Nombres, @Apellidos)",
  updatePersona:
    "UPDATE Persona SET NoDocumento = @NoDocumento, Nombres = @Nombres, Apellidos = @Apellidos WHERE IdPersona = @IdPersona",
  deletePersona: "DELETE FROM Persona WHERE IdPersona = @IdPersona",
};


23- Creamos archivo index.js en carpeta database:

export { PersonaQueries } from "./persona.queries";
export { getConnection, sql } from "./connection";



24- Creamos carpeta middlewares en src y archivo persona.validator.js adentro de middlewares:


import { body, validationResult } from "express-validator";

export const validaCreatePersona = [
  body("noDocumento")
    .exists()
    .withMessage("El campo noDocumento no existe.")
    .notEmpty()
    .withMessage("El campo noDocumento es requerido."),
  body("nombres")
    .exists()
    .withMessage("El campo Nombres no existe.")
    .notEmpty()
    .withMessage("El campo Nombres es requerido."),
  body("apellidos")
    .exists()
    .withMessage("El campo Apellidos no existe.")
    .notEmpty()
    .withMessage("El campo Apellidos es requerido."),
];

export const validaUpdatePersona = [
  body("idPersona")
    .exists()
    .withMessage("El campo idPersona no existe.")
    .isInt({ min: 1 })
    .withMessage("El campo idPersona debe ser numérico y mayor que cero.")
    .notEmpty()
    .withMessage("El campo idPersona es requerido."),
  body("noDocumento")
    .exists()
    .withMessage("El campo noDocumento no existe.")
    .notEmpty()
    .withMessage("El campo noDocumento es requerido."),
  body("nombres")
    .exists()
    .withMessage("El campo Nombres no existe.")
    .notEmpty()
    .withMessage("El campo Nombres es requerido."),
  body("apellidos")
    .exists()
    .withMessage("El campo Apellidos no existe.")
    .notEmpty()
    .withMessage("El campo Apellidos es requerido."),
];

export function resultValidacionesPersona(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
}


25- Creamos archivo index.js en carpeta middlewares:

export {
  validaCreatePersona,
  validaUpdatePersona,
  resultValidacionesPersona,
} from "./persona.validator";



26- Creamos carpeta services adentro de src y el archivo persona.service.js en carpeta services:



import { getConnection, sql, PersonaQueries } from "../database";

export const findAllPersonas = async () => {
  const pool = await getConnection();
  const result = await pool.request().query(PersonaQueries.findAllPersonas);

  return result;
};

export const findOnePersona = async (req) => {
  const { id } = req.params;

  const pool = await getConnection();
  const result = await pool
    .request()
    .input("IdPersona", sql.Int, id)
    .query(PersonaQueries.findOnePersona);

  return result;
};

export const createPersona = async (req) => {
  const { noDocumento, nombres, apellidos } = req.body;

  const pool = await getConnection();
  const result = await pool
    .request()
    .input("NoDocumento", sql.VarChar, noDocumento)
    .input("Nombres", sql.VarChar, nombres)
    .input("Apellidos", sql.VarChar, apellidos)
    .query(PersonaQueries.createPersona);

  return result;
};

export const updatePersona = async (req, res) => {
  const { idPersona, noDocumento, nombres, apellidos } = req.body;
  const { id } = req.params;

  const pool = await getConnection();
  const result = await pool
    .request()
    .input("IdPersona", sql.Int, id)
    .input("NoDocumento", sql.VarChar, noDocumento)
    .input("Nombres", sql.VarChar, nombres)
    .input("Apellidos", sql.VarChar, apellidos)
    .query(PersonaQueries.updatePersona);

  return result;
};

export const deletePersona = async (req, res) => {
  const { id } = req.params;

  const pool = await getConnection();
  const result = await pool
    .request()
    .input("IdPersona", sql.Int, id)
    .query(PersonaQueries.deletePersona);

  return result;
};



27- Creamos carpeta controllers adentro de carpeta src y archivo persona.controller.js adentro de la carpeta controllers:


import * as personaService from "../services/persona.service";

export const findAllPersonas = async (req, res) => {
  try {
    const response = await personaService.findAllPersonas();

    res.json({
      data: response.recordset,
      totalCount: response.rowsAffected,
    });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

export const findOnePersona = async (req, res) => {
  try {
    const response = await personaService.findOnePersona(req);

    res.json(response.recordset[0]);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

export const createPersona = async (req, res) => {
  try {
    const response = await personaService.createPersona(req);

    res.status(200);
    res.json(response);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

export const updatePersona = async (req, res) => {
  try {
    const response = await personaService.updatePersona(req);

    res.status(200);
    res.json(response);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

export const deletePersona = async (req, res) => {
  try {
    const response = await personaService.deletePersona(req);

    res.status(200);
    res.json(response);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};




28- Creamos carpeta routers adentro de carpeta src y archivo persona.routes.js adentro de la carpeta routers:



import { Router } from "express";
import {
  resultValidacionesPersona,
  validaCreatePersona,
  validaUpdatePersona,
} from "../middlewares/persona.validator";
import {
  createPersona,
  deletePersona,
  findAllPersonas,
  findOnePersona,
  updatePersona,
} from "../controllers/persona.controller";

const router = Router();

router.get("/persona", findAllPersonas);

router.get("/persona/:id", findOnePersona);

router.post(
  "/persona",
  validaCreatePersona,
  resultValidacionesPersona,
  createPersona
);

router.put(
  "/persona/:id",
  validaUpdatePersona,
  resultValidacionesPersona,
  updatePersona
);

router.delete("/persona/:id", deletePersona);

export default router;




29- Instalamos swagger: npm i swagger-ui-express -S 

30- Creamos archivo swagger.json afuera de src:



{
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "CRUD BackEnd NodeJs",
    "description": "APIs CRUD",
    "license": {
      "name": "MIT",
      "url": "https://opensource.org/licenses/MIT"
    }
  },
  "host": "localhost:5000",
  "basePath": "/",
  "tags": [
    {
      "name": "Personas",
      "description": "API de personas"
    }
  ],
  "schemes": ["http"],
  "consumes": ["application/json"],
  "produces": ["application/json"],
  "paths": {
    "/api/persona": {
      "post": {
        "tags": ["Personas"],
        "summary": "Crea un nuevo registro.",
        "parameters": [
          {
            "name": "persona",
            "in": "body",
            "description": "Registro que se va a crear.",
            "schema": {
              "$ref": "#/definitions/createPersona"
            }
          }
        ],
        "produces": ["application/json"],
        "responses": {
          "200": {
            "description": "Nueva registro creado.",
            "schema": {
              "$ref": "#/definitions/Persona"
            }
          }
        }
      },
      "get": {
        "tags": ["Personas"],
        "summary": "Consulta todos los registros.",
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/Personas"
            }
          }
        }
      }
    },
    "/api/persona/{id}": {
      "parameters": [
        {
          "name": "id",
          "in": "path",
          "required": true,
          "description": "ID del registro que se va a buscar.",
          "type": "integer"
        }
      ],
      "get": {
        "summary": "Consulta un registro por ID.",
        "tags": ["Personas"],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/Persona"
            }
          }
        }
      },
      "delete": {
        "summary": "Elimina un registro por ID.",
        "tags": ["Personas"],
        "responses": {
          "200": {
            "description": "Registro eliminado.",
            "schema": {
              "$ref": "#/definitions/Persona"
            }
          }
        }
      },
      "put": {
        "summary": "Actualiza un registro por ID.",
        "tags": ["Personas"],
        "parameters": [
          {
            "name": "id",
            "in": "body",
            "description": "Registro con nuevos valores",
            "schema": {
              "$ref": "#/definitions/updatePersona"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Registro actualizado.",
            "schema": {
              "$ref": "#/definitions/Persona"
            }
          }
        }
      }
    }
  },
  "definitions": {
    "Persona": {
      "required": ["idPersona", "noDocumento", "nombres", "apellidos"],
      "properties": {
        "idPersona": {
          "type": "number",
          "uniqueItems": true
        },
        "noDocumento": {
          "type": "string",
          "uniqueItems": true
        },
        "nombres": {
          "type": "string"
        },
        "apellidos": {
          "type": "string"
        }
      }
    },
    "createPersona": {
      "required": ["noDocumento", "nombres", "apellidos"],
      "properties": {
        "noDocumento": {
          "type": "string",
          "uniqueItems": true
        },
        "nombres": {
          "type": "string"
        },
        "apellidos": {
          "type": "string"
        }
      }
    },
    "updatePersona": {
      "required": ["idPersona", "noDocumento", "nombres", "apellidos"],
      "properties": {
        "idPersona": {
          "type": "number",
          "uniqueItems": true
        },
        "noDocumento": {
          "type": "string",
          "uniqueItems": true
        },
        "nombres": {
          "type": "string"
        },
        "apellidos": {
          "type": "string"
        }
      }
    },
    "Personas": {
      "type": "array",
      "$ref": "#/definitions/Persona"
    }
  }
}