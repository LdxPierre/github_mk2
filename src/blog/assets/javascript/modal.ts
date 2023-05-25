interface Modal {
    title?: string, 
    content: string,
    footer: Footer
}

interface Footer {
    cancel?: string,
    confirm?: string,
    method: Function,
    params1?: any
}

const contentElement: HTMLDivElement = document.querySelector(".content")!;

export const showModal = (modal:Modal):void => {
    const modalElement:HTMLDivElement = document.createElement("div");
    modalElement.classList.add("modal");
    contentElement.prepend(modalElement);

    const modalBodyElement:HTMLDivElement = modalBody(modal);
    modalElement.append(modalBodyElement);

    const eventListener = modalEventListener(modal);
};

const modalBody = (modal:Modal) => {
    const modalBodyElement:HTMLDivElement = document.createElement("div");
    modalBodyElement.classList.add("modal-body");

    const modalTitleElement:HTMLDivElement | undefined = modal.title ? modalTitle(modal.title) : undefined;

    const modalContentElement:HTMLDivElement = modalContent(modal.content);
    const modalFooterElement:HTMLDivElement = modalFooter(modal.footer);

    modal.title
        ? modalBodyElement.append(
            modalTitleElement!,
            modalContentElement,
            modalFooterElement
        )
        : modalBodyElement.append(modalContentElement, modalFooterElement);

    return modalBodyElement;
};

const modalTitle = (title:string):HTMLDivElement => {
    const modalTitleElement:HTMLDivElement = document.createElement("div");
    modalTitleElement.classList.add("modal-title");
    modalTitleElement.innerHTML = `
    <span class="modal-title-text">${title}</span>
    <span class="modal-close">
        <i class="fa-solid fa-xmark"></i>
    </span>
    `;

    return modalTitleElement;
};

const modalContent = (content:string):HTMLDivElement => {
    const modalContentElement:HTMLDivElement = document.createElement("div");
    modalContentElement.classList.add("modal-content");
    modalContentElement.innerHTML = `
    <span class="modal-content-text">
    ${content}
    </span>
    `;

    return modalContentElement;
};

const modalFooter = (footer:Footer):HTMLDivElement => {
    footer.cancel ? undefined : (footer.cancel = "cancel");
    footer.confirm ? undefined : (footer.confirm = "confirm");

    const modalFooterElement:HTMLDivElement = document.createElement("div");
    modalFooterElement.classList.add("modal-footer");
    modalFooterElement.innerHTML = `
    <button class="modal-cancel">${footer.cancel}</button>
    <button class="modal-confirm">${footer.confirm}</button>
    `;

    return modalFooterElement;
};

const modalEventListener = (modal:Modal) => {
    const modalElement:HTMLDivElement = document.querySelector(".modal")!;
    //event for close
    // X
    if (modal.title) {
        const modalCloseElement:HTMLDivElement = document.querySelector(".modal-close")!;
        modalCloseElement.addEventListener("click", (event:MouseEvent) => {
            event.stopPropagation();
            modalElement.remove();
        });
    }
    // background
    modalElement.addEventListener("click", (event:MouseEvent) => {
        event.stopPropagation();
        event.target == modalElement ? modalElement.remove() : undefined;
    });
    //cancel btn
    const cancelBtn:HTMLButtonElement = document.querySelector(".modal-cancel")!;
    cancelBtn.addEventListener("click", (event:MouseEvent) => {
        event.stopPropagation();
        modalElement.remove();
    });
    //escap down
    window.addEventListener("keydown", (event:KeyboardEvent) => {
        event.stopPropagation();
        event.key == "Escape" ? modalElement.remove() : undefined;
    });

    //event confirm
    const confirmBtn:HTMLButtonElement = document.querySelector(".modal-confirm")!;
    confirmBtn.addEventListener("click", (event:MouseEvent) => {
        event.stopPropagation();
        modal.footer.method(modal.footer.params1);
        modalElement.remove();
    });
};