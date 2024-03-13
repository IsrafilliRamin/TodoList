const form = document.querySelector<HTMLFormElement>('form');
const ul = document.querySelector<HTMLUListElement>('.list-group');
const ulNav = document.querySelector<HTMLUListElement>('.nav');
const input = document.querySelector<HTMLInputElement>('.form-control');
let id: number = Math.floor(Math.random() * 100000);


type todoType = {
    id: number,
    title: string | undefined, 
    completed: boolean,
    createDate: Date,
};

let allTodos: todoType[] = loadTodo();
allTodos.forEach(todo => addListItem(todo));

form?.addEventListener("submit", (e) => {
    id++;
    e.preventDefault();
    if (input?.value === "" || input?.value === null) {
        input.style.border = "2px solid red";

        setTimeout(() => {
            input.style.border = "";
        }, 1000)
        return
    }


    const todoInfo = {
        id: id,
        title: input?.value,
        completed: false,
        createDate: new Date()
    }

    addListItem(todoInfo);
    allTodos.push(todoInfo);
    saveTodo();
    if (input !== null) input.value = "";

});


function addListItem(todo: todoType) {
    const li = document.createElement('li') as HTMLLIElement;
    const checkboxInput = document.createElement('input') as HTMLInputElement;
    const text = document.createElement('span') as HTMLSpanElement;
    const deleteTodo = document.createElement('i') as HTMLElement;
    const editTodo = document.createElement('i') as HTMLElement;
    editTodo.className = "fa-solid fa-pen";
    deleteTodo.className = "fa-solid fa-xmark";
    checkboxInput.className = "form-check-input me-2";
    li.className = "list-group-item d-flex align-items-center border-0 mb-2 rounded";
    checkboxInput.type = "checkbox";
    checkboxInput.checked = todo.completed;
    text.innerText = todo.title ? todo.title : "";

    checkboxInput.addEventListener("change", () => {
        todo.completed = checkboxInput.checked;
        saveTodo();
    });

    deleteTodo.addEventListener("click", () => {
        const deletTodos: todoType[] = allTodos.filter(evenTodo => evenTodo.id !== todo.id);
        if (ul !== null) [...ul.children].forEach(item => item.remove());
        allTodos = deletTodos;
        allTodos.forEach(todo => addListItem(todo));
        saveTodo();
    });

    editTodo.addEventListener("click", () => {
        const editInput = document.createElement("input") as HTMLInputElement;
        editInput.className = "editInp";

        if (li !== null)
            if ([...li?.children].length < 5) {
                li.append(checkboxInput, text, editTodo, editInput, deleteTodo);
                setTimeout(() => {
                    editInput.style.cssText = "width:30%;opacity:1;transition:1s"
                }, 100)
                editInput.placeholder = "Edit todo";
                editInput.addEventListener("change", () => {
                    todo.title = editInput.value;
                    text.innerText = todo.title
                    editInput.style.cssText = "width:0%;opacity:0;transition:1s";
                    setTimeout(() => {
                        li.children[3].remove();
                        saveTodo();
                    }, 900)

                })
                saveTodo();
            } else {
                [...li.children][3].setAttribute("style", "width:0%;opacity:0");
                setTimeout(() => {
                    li.children[3].remove();
                    saveTodo();
                }, 1400)

            };
    });

    li.append(checkboxInput, text, editTodo, deleteTodo);
    ul?.append(li);

};

function saveTodo() {
    localStorage.setItem("typeTodo", JSON.stringify(allTodos));
};

function loadTodo() {
    const localTodo = localStorage.getItem("typeTodo");
    if (localTodo === null) return [];
    return JSON.parse(localTodo);
};


ulNav?.addEventListener("click", (e: EventTarget | any) => {
    console.log(e.target.textContent);
    if (e.target.textContent === "All") {
        e.target.parentNode.parentNode.children[0].children[0].className = "nav-link";
        e.target.parentNode.parentNode.children[1].children[0].className = "nav-link";
        e.target.className = "nav-link active";
        if (ul !== null) [...ul.children].forEach(item => item.remove());
        allTodos.forEach(todo => addListItem(todo));
        saveTodo();
    } else {
        e.target.parentNode.parentNode.children[0].children[0].className = "nav-link";
        e.target.parentNode.parentNode.children[1].children[0].className = "nav-link";
        e.target.className = "nav-link active";
        let filterFalse = allTodos.filter(todo => todo.completed === true);
        if (ul !== null) [...ul.children].forEach(item => item.remove());
        filterFalse.forEach(todo => addListItem(todo));
    };

})
