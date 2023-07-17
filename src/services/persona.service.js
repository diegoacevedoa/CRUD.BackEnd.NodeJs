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
