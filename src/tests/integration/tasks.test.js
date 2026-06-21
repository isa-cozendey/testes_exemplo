const request = require("supertest");

const app = require("../../app");

describe("API de tarefas", () => {
  test("POST /tasks", async () => {
    const response = await request(app).post("/tasks").send({
      title: "Comprar pao",
    });

    expect(response.statusCode).toBe(201);

    expect(response.body.title).toBe("Comprar pao");
  });
});

describe("API de tarefas - validacao", () => {
  test("POST /tasks - titulo obrigatorio", async () => {
    const response = await request(app).post("/tasks").send({});
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Titulo obrigatorio");
  });

  test("POST /tasks - titulo deve ser string", async () => {
    const response = await request(app).post("/tasks").send({
      title: 123,
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Titulo deve ser uma string");
  });
});