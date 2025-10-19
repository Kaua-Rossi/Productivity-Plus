// Documentation from MDN, checks if localStorage is available
function storageAvailable(type = "localStorage") {
    try {
        var storage = window[type],
            x = "__storage_test__";
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return (
            e instanceof DOMException &&
            // everything except Firefox
            (e.code === 22 ||
                // Firefox
                e.code === 1014 ||
                // test name field too, because code might not be present
                // everything except Firefox
                e.name === "QuotaExceededError" ||
                // Firefox
                e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0
        );
    }
}

export class ChecklistManager {
    constructor(formSelector, inputSelector, containerSelector, storageKey) {
        this.form = document.querySelector(formSelector);
        this.input = document.querySelector(inputSelector);
        this.container = document.querySelector(containerSelector);
        this.storageKey = storageKey;
        this.tasks = [];
    }

    init() {
        this.loadTasks();
        this.form.addEventListener("submit", (e) => {
            e.preventDefault();
            this.addTask();
        });
    }

    loadTasks() {
        if (storageAvailable() && localStorage.getItem(this.storageKey)) {
            this.tasks = JSON.parse(localStorage.getItem(this.storageKey));
        }
        this.renderTasks();
    }

    saveTasks() {
        if (storageAvailable()) {
            localStorage.setItem(this.storageKey, JSON.stringify(this.tasks));
        }
    }

    addTask() {
        const taskText = this.input.value.trim();
        if (taskText === "") return;

        const newTask = { text: taskText, completed: false };
        this.tasks.push(newTask);
        this.saveTasks();
        this.createTaskElement(newTask);
        this.input.value = "";
    }

    createTaskElement(task) {
        const checklistItem = document.createElement("div");
        checklistItem.classList.add("flex", "items-center", "mb-2", "bg-gray-800", "rounded", "p-2");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("mr-2", "ml-2", "w-4", "h-4", "accent-fuchsia-400");
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            this.saveTasks();
        });

        const span = document.createElement("span");
        span.classList.add("text-gray-50");
        span.textContent = task.text;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "X";
        deleteButton.classList.add("ml-auto", "text-red-400", "hover:text-red-500", "font-bold", "text-lg", "focus:outline-none", "transition");
        deleteButton.addEventListener("click", () => {
            checklistItem.remove();
            this.tasks = this.tasks.filter((t) => t !== task);
            this.saveTasks();
        });

        checklistItem.appendChild(checkbox);
        checklistItem.appendChild(span);
        checklistItem.appendChild(deleteButton);

        this.container.appendChild(checklistItem);
    }

    renderTasks() {
        this.container.innerHTML = "";
        for (const task of this.tasks) {
            this.createTaskElement(task);
        }
    }
}
