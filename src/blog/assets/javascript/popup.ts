const contentElement:HTMLDivElement = document.querySelector(".content")!;

let popUpElement:HTMLDivElement | undefined;
let timer:any;

const showPopUp = (style:'success'|'danger', message:string):void => {
    if (popUpElement) {
        popUpElement.remove();
        clearTimeout(timer);
    }
    popUpElement = document.createElement("div");
    popUpElement.classList.add("popUp");

    if (style === "success") {
        popUpElement.innerHTML = `
        <div class="popUp-success">
            <span class="popUp-ico"><i class="fa-solid fa-check"></i></span>
            <span class="popUp-message">${message}</span>
            <span class="popUp-close"><i class="fa-solid fa-xmark"></i></span>
        </div>`;
    } else {
        popUpElement.innerHTML = `
        <div class="popUp-danger">
            <span class="popUp-ico"><i class="fa-solid fa-exclamation"></i></span>
            <span class="popUp-message">${message}</span>
            <span class="popUp-close"><i class="fa-solid fa-xmark"></i></span>
        </div>`;
    }

    contentElement.before(popUpElement);

    popUpElement.addEventListener("contextmenu", (event:MouseEvent) => {
        event.preventDefault();
        popUpElement!.remove();
        clearTimeout(timer);
    });

    popUpElement.querySelector(".popUp-close")!.addEventListener("click", () => {
        popUpElement!.remove();
        clearTimeout(timer);
    });

    timer = setTimeout(() => {
        popUpElement!.remove();
    }, 1000);
};

export { showPopUp };
