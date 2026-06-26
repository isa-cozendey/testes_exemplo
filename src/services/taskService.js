const repository = require("../repositories/taskRepository");

// Mantém um ID incremental simples para garantir unicidade estrita nos testes consecutivos
let currentId = 1;

function addTask(title) {
    // Validação de nulos/vazios primeiro para evitar quebrar no .length depois
    if (!title) {
        throw new Error("Titulo obrigatorio"); // Removido o acento para bater com o teste original
    }

    if (typeof title !== 'string') {
        throw new Error("Titulo deve ser uma string");
    }

    // Regra: Menos de 3 caracteres
    if (title.length < 3) {
        throw new Error("Titulo muito curto");
    }

    // Regra: Mais de 100 caracteres
    if (title.length > 100) {
        throw new Error("Titulo muito longo");
    }

    const task = {
        id: currentId++,
        title
    };

    repository.save(task);

    return task;
}

function getTasks() {
    return repository.findAll();
}

function deleteTask(id) {
    const taskExists = repository.findById(id);
    
    if (!taskExists) {
        throw new Error("Tarefa nao encontrada");
    }

    repository.delete(id);
}

module.exports = {
    addTask,
    getTasks,
    deleteTask
};