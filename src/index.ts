import "./assets/styles/styles.scss";

const menuMobileBtn: HTMLButtonElement = document.querySelector("#toggleNavigation");
const menuMobileCloseBtn: HTMLButtonElement = document.querySelector("#closeNavigation");
const menuMobileNode: HTMLDivElement = document.querySelector(".menu-mobile");
const linksNodes: NodeList = document.querySelectorAll(".menu-mobile-body > ul > li > a");

/** Show menu for medium or smaller device */
function showMenu(): void {
  menuMobileNode.classList.contains("show") ? null : menuMobileNode.classList.add("show");
  menuMobileNode.classList.add("active");
  setTimeout(() => {
    menuMobileNode.classList.remove("active");
  }, 300);
}

/** Close menu */
function closeMenu(): void {
  menuMobileNode.classList.contains("show") ? menuMobileNode.classList.remove("show") : null;
}

// Show menu
menuMobileBtn.addEventListener("click", (e): void => {
  e.stopPropagation();
  showMenu();
});

// Close menu
menuMobileCloseBtn.addEventListener("click", (e): void => {
  e.stopPropagation();
  closeMenu();
});

// Close menu with a click outside
document.addEventListener("click", (e): void => {
  e.stopPropagation();
  if (e.target != menuMobileNode && !menuMobileNode.contains(e.target as Node)) {
    closeMenu();
  }
});

// Close menu
linksNodes.forEach((e) => {
  e.addEventListener("click", () => {
    closeMenu();
  });
});
