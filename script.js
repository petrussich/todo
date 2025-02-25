const inputBox = document.getElementById('input_box');
const listContainer = document.getElementById('list-container');

function addTask() {
    if (inputBox.value === '') {
        alert("Please write the task");
    } else {
        let li = document.createElement("li");
        li.innerHTML = inputBox.value;

        // Создание значка удаления
        let span = document.createElement("span");
        span.innerHTML = "X";
        li.appendChild(span);

        // Создание значка редактирования
        let editImg = document.createElement("img");
        editImg.src = "images/write.png";
        li.appendChild(editImg);

        li.classList.add("animate__animated", "animate__pulse");

        listContainer.appendChild(li);
    }
    inputBox.value = '';
    saveData();
}

listContainer.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
    } else if (e.target.tagName === "SPAN") {
        const taskItem = e.target.parentElement;
        taskItem.classList.add('animate__animated', 'animate__backOutRight'); // Добавляем классы анимации

        // Удаляем элемент после завершения анимации
        taskItem.addEventListener('animationend', function() {
            taskItem.remove();
            saveData();
        });
    } else if (e.target.tagName === "IMG") {
        const taskItem = e.target.parentElement;
        const editImg = e.target;

        // Убедимся, что редактирование возможноб,если у задачи нет поля ввода
        if (!taskItem.querySelector("input")) {
            editTask(taskItem);
            editImg.style.pointerEvents = "none"; // Блокируем кнопку редактирования
        }
    }
}, false);

function editTask(taskItem) {
    const taskText = taskItem.firstChild.nodeValue; // Получаем текст задачи

    // Создаем поле ввода для редактирования
    const inputEdit = document.createElement("input");
    inputEdit.type = "text";
    inputEdit.value = taskText; // Вставляем текущий текст задачи
    taskItem.insertBefore(inputEdit, taskItem.firstChild); // Вставляем перед текстом задачи

    inputEdit.classList.add('animate__animated', 'animate__fadeIn'); // Добавляем классы для анимации

    // Скрываем текст задачи и иконки
    const taskTextNode = taskItem.firstChild.nextSibling; // Получаем узел, который содержит текст задачи
    taskTextNode.nodeValue = ''; // Проверяем и очищаем текст

    const span = taskItem.querySelector("span");
    const img = taskItem.querySelector("img");
    span.style.display = 'none'; // Скрываем значок удаления
    img.style.display = 'none'; // Скрываем значок редактирования

    // Обработчик нажатия клавиши
    inputEdit.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const newText = inputEdit.value;
            taskItem.removeChild(inputEdit);
            taskTextNode.nodeValue = newText;

            // Снимаем блокировку с кнопки редактирования
            if (img) {
                img.style.pointerEvents = "auto"; 
                img.style.display = 'inline';
            }
            span.style.display = 'inline';

            // Обновляем значение в localStorage
            saveData();
        }
    });

    // Устанавливаем фокус на поле ввода
    inputEdit.focus();
}


function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
}

function showTask() {
    listContainer.innerHTML = localStorage.getItem("data");
}
showTask();
