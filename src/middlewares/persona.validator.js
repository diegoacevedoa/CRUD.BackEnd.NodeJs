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
