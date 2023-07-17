export const PersonaQueries = {
  findAllPersonas: "SELECT * FROM Persona",
  findOnePersona: `SELECT * FROM Persona WHERE IdPersona = @IdPersona`,
  createPersona:
    "INSERT INTO Persona (NoDocumento, Nombres, Apellidos) VALUES (@NoDocumento, @Nombres, @Apellidos)",
  updatePersona:
    "UPDATE Persona SET NoDocumento = @NoDocumento, Nombres = @Nombres, Apellidos = @Apellidos WHERE IdPersona = @IdPersona",
  deletePersona: "DELETE FROM Persona WHERE IdPersona = @IdPersona",
};
