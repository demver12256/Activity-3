document.addEventListener('DOMContentLoaded', () => {
    /* Get variables elements */
    const taskInput = document.getElementById('task-input');
    const addTaskButton = document.getElementById('add-task-button');
    const prioritySelect = document.getElementById('priority-select');
    const columns = document.querySelectorAll('.column');
    const clearBtn = document.getElementById("clear-button");
    const search = document.getElementById("search-input");
  
    /* Enable dragging on a task */
    function enableDrag(task) {
      task.setAttribute('draggable', 'true');
      task.addEventListener('dragstart', () => task.classList.add('dragging'));
      task.addEventListener('dragend', () => task.classList.remove('dragging'));
    }
  
    /* Edit tasks in-place */
    function enableEdit(task) {
      task.addEventListener("dblclick", () => {
        task.contentEditable = true;
        task.focus();
      });
  
      task.addEventListener("blur", () => {
          task.contentEditable = false;
      });
  
      /* Use keyboard shortcuts */
      task.addEventListener("keydown", e => {
        if (e.key === "Enter") {
          e.preventDefault();
          task.contentEditable = false;
        }
      });
    }
  
    /* Create task item */
    function createTaskItem(text, priority) {
      const task = document.createElement('div');
      task.textContent = text;
      task.classList.add('task', priority);
  
      enableDrag(task);
      enableEdit(task);
  
      return task;
    }
    
    function addTask() {
      const taskText = taskInput.value.trim();
      const priority = prioritySelect.value;
      if (taskText) {
        const taskItem = createTaskItem(taskText, priority);
        document.getElementById('todo').appendChild(taskItem);
        taskInput.value = '';
      }
    }
  
    /* Add task button */
    addTaskButton.addEventListener('click', addTask);
  
    /* Keyboard shortcut: Enter to add */
    taskInput.addEventListener("keydown", e => {
      if (e.key === "Enter") {
          addTask();
      }
    });
  
    /* Drag & Drop for columns */
    columns.forEach(column => {
      column.addEventListener('dragover', e => {
        e.preventDefault();
        const afterElement = getDragAfterElement(column, e.clientY);
        const draggingTask = document.querySelector('.dragging');
        if (afterElement == null) {
          column.appendChild(draggingTask);
        } else {
          column.insertBefore(draggingTask, afterElement);
        }
      });
    });
  
    function getDragAfterElement(column, y) {
      const draggableElements = [...column.querySelectorAll('.task:not(.dragging)')];
  
      return draggableElements.reduce((closest, child) => {
          const box = child.getBoundingClientRect();
          const offset = y - box.top - box.height / 2;
          if (offset < 0 && offset > closest.offset) {
              return { offset: offset, element: child };
          } else {
              return closest;
          }
      }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
  
    /* Search filter */
    search.addEventListener("input", () => {
      const query = search.value.toLowerCase();
      document.querySelectorAll(".task").forEach(task => {
        const isVisible = task.textContent.toLowerCase().includes(query);
        task.style.display = isVisible ? "" : "none";
      });
    });
  
    /* Clear search */
    clearBtn.addEventListener("click", () => {
      search.value = "";
      document.querySelectorAll(".task").forEach(task => task.style.display = "");
    });
  });