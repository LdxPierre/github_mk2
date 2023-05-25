const canvas:HTMLDivElement = document.querySelector(".canvas")!;
const canvasShow:HTMLSpanElement = document.querySelector(".toggleCanvas")!;
canvasShow.addEventListener("click", (event:MouseEvent) => {
    event.stopPropagation();
    canvas.setAttribute("class", "canvas show");
});
const canvasClose:HTMLSpanElement = document.querySelector(".canvasClose")!;
canvasClose.addEventListener("click", (event:MouseEvent) => {
    event.stopPropagation();
    canvas.setAttribute("class", "canvas");
});
