import "./style/style.css";

interface Todo {
    text: string,
    done: boolean,
    edit: boolean,
};

const todos: Todo[] = [
    { text: "Todo 1", done: false, edit: false },
    { text: "Todo 2", done: true, edit: false },
    { text: "Todo 3", done: false, edit: false },
];

const formElement:HTMLFormElement = document.querySelector("form")!;
const formInputElement:HTMLInputElement = formElement.querySelector("input")!;
const ulElement:HTMLUListElement = document.querySelector("ul")!;

//ajout d'une todo via le formulaire apres avoir ajouter une majuscule au premier character
formElement.addEventListener("submit", (event: SubmitEvent):void => {
    event.preventDefault();
    closeEdit();
    const value: string = formInputElement.value;
    const value2: string = value.charAt(0).toUpperCase() + value.slice(1);
    formInputElement.value = "";
    addTodo(value2);
});

//affiche chaque todo présente dans le tableau todos[] en fonction du mode édition
const displayTodo = ():void => {
    const todosNode: HTMLLIElement[] = todos.map((todo: Todo, index: number) => {
        if (todo.edit) {
            return createElementEditTodo(todo, index);
        } else {
            return createElementTodo(todo, index);
        }
    });
    ulElement.innerHTML = "";
    ulElement.append(...todosNode);
};

//créer une <li> pour une todo
const createElementTodo = (todo: Todo, index: number): HTMLLIElement => {
    const liElement: HTMLLIElement = document.createElement("li");
    const editTodoBtn: HTMLButtonElement = document.createElement("button");
    editTodoBtn.setAttribute("class", "editTodo");
    editTodoBtn.addEventListener("click", (event: MouseEvent):void => {
        event.stopPropagation();
        closeEdit();
        editTodo(index);
    });
    const deleteTodoBtn: HTMLButtonElement = document.createElement("button");
    deleteTodoBtn.setAttribute("class", "deleteTodo");
    deleteTodoBtn.addEventListener("click", (event:MouseEvent):void => {
        event.stopPropagation();
        closeEdit();
        deleteTodo(index);
    });
    liElement.innerHTML = `
        <span class="complete ${todo.done ? "validate" : ""}"></span>
        <p class="${todo.done ? "validate" : ""}">${todo.text}</p>`;

    //setTimeout pour différencier un click d'un dblclick
    let timer:any;
    liElement.addEventListener('click', (event:MouseEvent)=>{
        if (event.detail === 1) {
            timer = setTimeout(()=>{
                doneTodo(index);
            },200)
        } else if (event.detail === 2) {
            clearTimeout(timer);
        closeEdit();
            editTodo(index)
        }
    })

    liElement.append(editTodoBtn, deleteTodoBtn);

    return liElement;
};

//créer une <li> pour une todo en mode édition
const createElementEditTodo = (todo: Todo, index: number): HTMLLIElement => {
    const liElement:HTMLLIElement = document.createElement("li");
    const editInputElement: HTMLInputElement = document.createElement("input");
    editInputElement.type = "text";
    editInputElement.value = todo.text;
    editInputElement.className = "editInput";
    inputFocus(editInputElement);
    const saveTodoBtn: HTMLButtonElement = document.createElement("button");
    saveTodoBtn.innerHTML = "Save";
    saveTodoBtn.addEventListener("click", () => {
        saveEdit(index, editInputElement.value);
    });
    const cancelTodoBtn:HTMLButtonElement = document.createElement("button");
    cancelTodoBtn.innerHTML = "Cancel";
    cancelTodoBtn.addEventListener("click", () => {
        editTodo(index);
    });
    //save la todo si touche "Enter" ou quitte si touche 'Escape'
    editInputElement.addEventListener("keydown", (event:KeyboardEvent) => {
        switch(event.key) {
            case 'Escape': {
                editTodo(index);
                break;
            }
            case 'Enter': {
                saveEdit(index, editInputElement.value);
                break;
            }
        }
    });
    const deleteTodoBtn:HTMLButtonElement = document.createElement("button");
    deleteTodoBtn.setAttribute("class", "deleteTodo");
    deleteTodoBtn.addEventListener("click", (event:MouseEvent) => {
        event.stopPropagation();
        deleteTodo(index);
    });

    liElement.append(editInputElement, saveTodoBtn, cancelTodoBtn, deleteTodoBtn);
    return liElement;
};

//ajout une todo dans le todos[] via le submit du formulaire et actualise la liste
const addTodo = (text:string) => {
    if (text) {
        const todo:Todo = { text, done: false, edit: false };
        todos.push(todo);
        displayTodo();
    }
};

//valide une todo et affiche un animation temporaire 'active' ou dé-valide une todo si déja valide
const doneTodo = (index:number) => {
    const liElement: HTMLLIElement= ulElement.querySelectorAll('li')[index];
    const spanComplete: HTMLSpanElement = liElement.querySelector('span')!;
    const pElement: HTMLParagraphElement = liElement.querySelector('p')!;

    if (spanComplete.classList.contains('validate')) {
        spanComplete.classList.remove('validate');
        pElement.classList.remove('validate');
    } else {
        spanComplete.classList.add('validate', 'active')
        pElement.classList.add('validate');
        let timout = setTimeout(()=>{
            spanComplete.classList.remove('active');
        },1000);
    }
    todos[index].done = !todos[index].done;
};

//réactualise la liste en passant la todos[index] en mode édition
const editTodo = (index:number) => {
    todos[index].edit = !todos[index].edit;
    displayTodo();
};

//ferme tous les modes édition
const closeEdit = ():void =>{
    todos.forEach(t => t.edit= false)
}

//supprime une todo et réactualise la liste
const deleteTodo = (index:number) => {
    todos.splice(index, 1);
    displayTodo();
};

//sauvegarde l'édition de la todo et réactualise la liste
const saveEdit = (index:number, value:string) => {
    todos[index].text = value;
    todos[index].edit = !todos[index].edit;
    displayTodo();
};

//place l'utilisateur directement dans le formulaire d'ajout
const inputFocus = (input:HTMLInputElement) => {
    setTimeout(() => {
        input.focus();
    }, 0);
};

displayTodo();
inputFocus(formInputElement);
