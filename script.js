// 从 localStorage 加载待办事项
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

// DOM 元素
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const pendingCount = document.getElementById('pendingCount');
const clearBtn = document.getElementById('clearBtn');
const filterBtns = document.querySelectorAll('.filter-btn');

// 保存到 localStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// 渲染待办列表
function renderTodos() {
    const filtered = todos.filter(todo => {
        if (currentFilter === 'pending') return !todo.completed;
        if (currentFilter === 'completed') return todo.completed;
        return true;
    });

    if (filtered.length === 0) {
        todoList.innerHTML = '<div class="empty-state">🎉 这里空空如也，添加一个新任务吧！</div>';
    } else {
        todoList.innerHTML = filtered.map((todo, index) => {
            const realIndex = todos.indexOf(todo);
            return `
                <li class="${todo.completed ? 'completed' : ''}" data-index="${realIndex}">
                    <div class="todo-checkbox" onclick="toggleTodo(${realIndex})"></div>
                    <span class="todo-text">${escapeHtml(todo.text)}</span>
                    <button class="delete-btn" onclick="deleteTodo(${realIndex})">✕</button>
                </li>
            `;
        }).join('');
    }

    // 更新待完成数量
    const pending = todos.filter(t => !t.completed).length;
    pendingCount.textContent = `${pending} 项待完成`;
}

// 转义 HTML 防 XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 添加待办
function addTodo() {
    const text = todoInput.value.trim();
    if (text === '') {
        todoInput.focus();
        return;
    }
    todos.push({ text, completed: false });
    saveTodos();
    todoInput.value = '';
    todoInput.focus();
    renderTodos();
}

// 切换完成状态
function toggleTodo(index) {
    todos[index].completed = !todos[index].completed;
    saveTodos();
    renderTodos();
}

// 删除待办
function deleteTodo(index) {
    todos.splice(index, 1);
    saveTodos();
    renderTodos();
}

// 清除已完成
function clearCompleted() {
    todos = todos.filter(t => !t.completed);
    saveTodos();
    renderTodos();
}

// 切换筛选
function setFilter(filter) {
    currentFilter = filter;
    filterBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    renderTodos();
}

// 事件绑定
addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTodo();
});
clearBtn.addEventListener('click', clearCompleted);
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => setFilter(btn.dataset.filter));
});

// 初始渲染
renderTodos();
