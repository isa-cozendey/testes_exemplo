jest.mock("../../repositories/taskRepository", () => ({
  save: jest.fn(),
  findAll: jest.fn(),
  delete: jest.fn(),
  findById: jest.fn(),
}));

const repository = require("../../repositories/taskRepository");
const taskService = require("../../services/taskService");

describe("Task Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Requisito: Verificar id, title e se o repository.save é chamado uma vez
  test("deve criar tarefa com id e title válidos", () => {
    const tarefa = taskService.addTask("Estudar");

    expect(tarefa).toHaveProperty("id");
    expect(tarefa.title).toBe("Estudar");
    expect(repository.save).toHaveBeenCalledTimes(1);
    expect(repository.save).toHaveBeenCalledWith(tarefa);
  });

  // Requisito: Id único entre duas chamadas consecutivas
  test("deve gerar ids únicos para chamadas consecutivas", () => {
    const tarefa1 = taskService.addTask("Tarefa Um");
    const tarefa2 = taskService.addTask("Tarefa Dois");

    expect(tarefa1.id).not.toBe(tarefa2.id);
  });

  // Requisito (TDD): Títulos com menos de 3 caracteres
  test("deve lancar erro se o titulo tiver menos de 3 caracteres", () => {
    expect(() => {
      taskService.addTask("Oi");
    }).toThrow("Titulo muito curto");
  });

  // Requisito: Títulos com mais de 100 caracteres
  test("deve lancar erro se o titulo tiver mais de 100 caracteres", () => {
    const tituloLongo = "a".repeat(101);
    expect(() => {
      taskService.addTask(tituloLongo);
    }).toThrow("Titulo muito longo");
  });

  // Requisito: test.each para múltiplos valores inválidos
  // Nota: Ajustado para "Titulo obrigatorio" ou "Titulo deve ser uma string" conforme sua lógica
  test.each([
    ["vazio", "", "Titulo obrigatorio"],
    ["número", 42, "Titulo deve ser uma string"],
    ["null", null, "Titulo obrigatorio"],
    ["undefined", undefined, "Titulo obrigatorio"],
    ["array", [], "Titulo deve ser uma string"],
    ["objeto", {}, "Titulo deve ser uma string"],
  ])("deve lancar erro quando o titulo for %s", (cenario, valorInvalido, mensagemErro) => {
    expect(() => {
      taskService.addTask(valorInvalido);
    }).toThrow(mensagemErro);

    expect(repository.save).not.toHaveBeenCalled();
  });

  // Requisito: getTasks deve retornar o que o repository.findAll retorna
  test("deve listar tarefas mapeadas do repositorio", () => {
    const mockData = [
      { id: 1, title: "Tarefa 1" },
      { id: 2, title: "Tarefa 2" },
    ];
    repository.findAll.mockReturnValue(mockData);

    const tarefas = taskService.getTasks();

    expect(tarefas).toEqual(mockData);
    expect(repository.findAll).toHaveBeenCalledTimes(1);
  });

  // Requisito: Implementar deleteTask(id) - Fluxo de Sucesso
  test("deve deletar a tarefa se o id existir", () => {
    repository.findById.mockReturnValue({ id: 5, title: "Tarefa Existente" });

    taskService.deleteTask(5);

    expect(repository.findById).toHaveBeenCalledWith(5);
    expect(repository.delete).toHaveBeenCalledWith(5);
    expect(repository.delete).toHaveBeenCalledTimes(1);
  });

  // Requisito: Implementar deleteTask(id) - Fluxo de Erro
  test("deve lancar erro ao deletar id inexistente", () => {
    repository.findById.mockReturnValue(null);

    expect(() => {
      taskService.deleteTask(999);
    }).toThrow("Tarefa nao encontrada");

    expect(repository.delete).not.toHaveBeenCalled();
  });
});