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
