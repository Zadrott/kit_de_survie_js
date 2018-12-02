angular.module("todoApp", []).controller("TodoListController", function() {
  var todoList = this;
  todoList.todos = [
    { text: "Exercice 1", done: true },
    { text: "Exercice 2", done: false },
    { text: "Exercice 3", done: true },
    { text: "Exercice 4", done: true },
    { text: "Exercice 5", done: true },
    { text: "Exercice 6", done: false },
    { text: "Exercice 7", done: false },
    { text: "Exercice 8", done: true },
  ];

  todoList.addTodo = function() {
    todoList.todos.push({ text: todoList.todoText, done: false });
    todoList.todoText = "";
  };

  todoList.deleteTodo = function(todo) {
    todoList.todos = todoList.todos.filter(i => i != todo);
  };

  todoList.remaining = function() {
    var count = 0;
    angular.forEach(todoList.todos, function(todo) {
      count += todo.done ? 0 : 1;
    });
    return count;
  };
});
