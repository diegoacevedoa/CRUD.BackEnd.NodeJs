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
