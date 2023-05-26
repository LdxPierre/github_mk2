import "./index.scss";
import { showPopUp } from "./assets/javascript/popup";
import { showModal } from "./assets/javascript/modal";

const params: URLSearchParams = new URL(document.location.href).searchParams;
const categoriesListElements = document.querySelector(".categoriesList")!;
interface Article {
	_id?: number;
	title: string;
	author: string;
	authorImg: string;
	category: string;
	content: string;
	createdAt?: string;
}
let articles: Article[] = [];
let filter: string = "";
let sort: string = "createdAt:desc";
let categoryShow: boolean = false;
const resetFiltersElement: HTMLSpanElement =
	document.querySelector(".filtersReset")!;
const filtersElements: HTMLDivElement = document.querySelector(".filters")!;

//show all articles
const getArticles = async (): Promise<void> => {
	articles = [];
	try {
		const response: Response = await fetch(
			`https://restapi.fr/api/ormide?sort=${sort}`
		);
		const body: any = await response.json();
		if (body.hasOwnProperty("content")) {
			articles[0] = body;
		} else {
			articles = body;
		}
		showArticles();
		categoriesMenu();
	} catch (e: any) {
		console.error(e);
	}
};

//delete article[id]
const deleteArticle = async (id: number): Promise<void> => {
	try {
		const response: Response = await fetch(
			`https://restapi.fr/api/ormide/${id}`,
			{
				method: "DELETE",
			}
		);
		getArticles();
		showPopUp("success", "Article has been deleted");
	} catch (e) {
		console.error(e);
	}
};

//create categoryMenu
const categoriesMenu = (): void => {
	if (articles.length === 0) {
		categoriesListElements.innerHTML = ``;
	} else if (articles.length != 0) {
		let categoriesArray: any[][];
		const categories: {} = articles.reduce((acc, article) => {
			const cat: string = article.category;
			if (acc.hasOwnProperty(cat)) {
				let nbr: number = Object.getOwnPropertyDescriptor(acc, cat)!.value;
				Object.defineProperty(acc, cat, { value: nbr + 1 });
			} else {
				Object.defineProperty(acc, cat, {
					value: 1,
					writable: true,
					enumerable: true,
				});
			}
			return acc;
		}, {});
		categoriesArray = Object.keys(categories)
			.map((category) => {
				const categoryValue: any = Object.getOwnPropertyDescriptor(
					categories,
					category
				)!.value;
				return [category, categoryValue];
			})
			.sort((c1, c2) => c1[0].localeCompare(c2[0]));

		createLiElements(categoriesArray);
	} else {
		createLiElements([[articles[0].category, 1]]);
	}
};

//create <li> foreah category
const createLiElements = (categoriesArray: any[]): void => {
	categoriesListElements.innerHTML = ``;
	const liElements: HTMLLIElement[] = categoriesArray.map((element) => {
		const li: HTMLLIElement = document.createElement("li");
		li.innerHTML = `${element[0]} ( ${element[1]} )`;
		filter === element[0] ? li.classList.add("filter-select") : undefined;
		li.addEventListener("click", () => {
			if (filter === element[0]) {
				li.classList.remove("filter-select");
				filter = "";
			} else {
				const filtersElements: NodeListOf<HTMLLIElement> =
					document.querySelectorAll(".filter-select");
				filtersElements.forEach((e) => {
					e.classList.remove("filter-select");
				});
				li.classList.add("filter-select");
				filter = element[0];
			}
			if (filter != "" || sort != "createdAt:desc") {
				showResetFilters(true);
			} else {
				showResetFilters(false);
			}
			showArticles();
		});
		return li;
	});
	categoriesListElements.append(...liElements);
};

//show resetFilters
const showResetFilters = (boolean: boolean): void => {
	if (boolean) {
		resetFiltersElement.classList.remove("hidden");
	} else {
		resetFiltersElement.classList.add("hidden");
	}
};

//event listener of categories & sort
const filterEventListener = (): void => {
	//sort date
	const sortDateNode: HTMLSpanElement = document.querySelector(".sortDate")!;
	sortDateNode.addEventListener("click", () => {
		sort == "createdAt:asc"
			? (sort = "createdAt:desc")
			: (sort = "createdAt:asc");
		sort == "createdAt:asc"
			? sortDateNode.setAttribute("class", "sortDate on")
			: sortDateNode.setAttribute("class", "sortDate off");
		if (filter != "" || sort != "createdAt:desc") {
			showResetFilters(true);
		} else {
			showResetFilters(false);
		}
		getArticles();
	});

	//categories
	const filterCategoriesMenuElement: HTMLSpanElement =
		document.querySelector(".filterCategories")!;
	const filterCategoriesListElements: HTMLUListElement =
		document.querySelector(".categoriesList")!;
	filterCategoriesMenuElement.addEventListener("click", () => {
		if (!categoryShow) {
			filterCategoriesMenuElement.setAttribute("class", "filterCategories on");
			filterCategoriesListElements.classList.add("show");
			categoryShow = !categoryShow;
			showCurrentFilter(false);
		} else {
			filterCategoriesMenuElement.setAttribute("class", "filterCategories off");
			filterCategoriesListElements.classList.remove("show");
			categoryShow = !categoryShow;
			showCurrentFilter(true);
		}
	});
};

//show filtered category when list is hidden
const showCurrentFilter = (bool: boolean): void => {
	if (bool && filter != "") {
		const currentFilter: HTMLSpanElement = document.createElement("span");
		currentFilter.classList.add("currentFilter");
		currentFilter.innerHTML = `${filter}`;
		resetFiltersElement.before(currentFilter);
		currentFilter.addEventListener("click", () => {
			filter = "";
			showArticles();
			filtersElements.removeChild(currentFilter);
			if (sort === "createdAt:desc") {
				showResetFilters(false);
			}
		});
	} else {
		const currentFilter: HTMLSpanElement | null =
			document.querySelector(".currentFilter");
		currentFilter ? filtersElements.removeChild(currentFilter!) : undefined;
	}
};

//show every articles after filter
const showArticles = (): void => {
	const articlesElement: HTMLDivElement = document.querySelector(".articles")!;
	articlesElement.innerHTML = ``;
	const articlesFilter: Article[] = articles.filter((article) => {
		if (filter) {
			return article.category === filter;
		} else {
			return true;
		}
	});

	if (articlesFilter.length) {
		articlesFilter.map((a) => {
			const articleElement: HTMLDivElement = createArticle(a);
			articlesElement.append(articleElement);
		});
	} else {
		const noArticleElement: HTMLParagraphElement = document.createElement("p");
		noArticleElement.setAttribute("class", "noDataText");
		noArticleElement.innerText = "No Data To Show";
		const createFakeDataButtonElement: HTMLButtonElement =
			document.createElement("button");
		createFakeDataButtonElement.setAttribute(
			"class",
			"noDataBtn btn btn-primary"
		);
		createFakeDataButtonElement.innerText = `Create 10 fake articles`;
		createFakeDataButtonElement.addEventListener("click", fakeData);
		articlesElement.append(noArticleElement, createFakeDataButtonElement);
	}
};

//create 10 fake articles
const fakeData = async (): Promise<void> => {
	let y: number = 0;
	const fakeCategory: string[] = [
		"Voyage",
		"Travail",
		"Cuisine",
		"Peinture",
		"Jeux Vidéos",
	];
	const articles: Article[] = [];
	for (let i = 0; i < 10; i++) {
		y = Math.floor(i / 2);
		const fakeArticle: Article = {
			title: `Article n°${i + 1}`,
			category: fakeCategory[y],
			author: "Moi",
			authorImg: "https://randomuser.me/api/portraits/men/64.jpg",
			content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nisl nisi scelerisque eu ultrices. Lacus sed turpis tincidunt id aliquet risus feugiat. Risus quis varius quam quisque id diam vel quam elementum. Tincidunt id aliquet risus feugiat in ante metus dictum. Suspendisse faucibus interdum posuere lorem ipsum dolor sit amet. Eget magna fermentum iaculis eu non. Eget nunc scelerisque viverra mauris in aliquam sem. Diam sit amet nisl suscipit adipiscing. Varius vel pharetra vel turpis nunc eget lorem dolor sed. Imperdiet proin fermentum leo vel orci. Laoreet suspendisse interdum consectetur libero id faucibus nisl tincidunt.`,
		};
		articles.push(fakeArticle);
	}
	spinning(true);
	await postFakeData(articles);
	getArticles();
};

//postFakeData
const postFakeData = async (articles: Article[]): Promise<void> => {
	try {
		const articlesJson: string = JSON.stringify(articles);
		const response: Response = await fetch("https://restapi.fr/api/ormide/", {
			method: "POST",
			body: articlesJson,
			headers: {
				"content-type": "application/json",
			},
		});
	} catch (e) {
		console.error(e);
	}
};

//create article's elements
const createArticle = (a: Article): HTMLDivElement => {
	const date: Date = new Date(a.createdAt!);
	const dateIso: string = date.toLocaleString();
	//title, cat, content
	const articleElement: HTMLDivElement = document.createElement("div");
	articleElement.classList.add("article");
	articleElement.innerHTML = `<h2 class="articleTitle">${a.title}</h2>
        <h4 class="articleCategory">${a.category}</h4>
        <p class="articleContent">${a.content}</p>`;
	//author, date, btn
	const articleInfosElement: HTMLDivElement = document.createElement("div");
	articleInfosElement.classList.add("articleInfos");
	articleInfosElement.innerHTML = `
            <img class="articleAuthorImg" src="${a.authorImg}" alt="${a.author}"/>
            <h5 class="articleDate">${dateIso}</h5>
            <h4 class="articleAuthor">${a.author}</h4>
            `;
	articleElement.append(articleInfosElement);
	//btnDelete
	const btnDelete: HTMLButtonElement = document.createElement("button");
	btnDelete.setAttribute("class", "btn btn-danger btn-delete");
	btnDelete.innerHTML = `Delete`;
	btnDelete.addEventListener("click", () => {
		showModal({
			content: `Confirm delete of ${a.title} ? `,
			footer: {
				method: deleteArticle,
				params1: a._id,
			},
		});
	});
	//editBtn
	const btnEdit: HTMLAnchorElement = document.createElement("a");
	btnEdit.setAttribute("class", "btn btn-blue btn-edit");
	btnEdit.setAttribute("href", `./form.html?id=${a._id}`);
	btnEdit.innerHTML = "Edit";

	articleInfosElement.append(btnEdit, btnDelete);

	return articleElement;
};

/** Show a spinner */
const spinning = (bool: boolean): void => {
	const articlesNode: HTMLDivElement = document.querySelector(".articles")!;

	bool
		? (articlesNode.innerHTML = `<i class="fa-solid fa-spinner spin"></i>`)
		: null;
};

//reset all fiters and sort if active
resetFiltersElement.addEventListener("click", () => {
	document.querySelector(".sortDate")!.classList.remove("on");
	document.querySelector(".filterCategories")!.classList.replace("on", "off");
	document.querySelector(".categoriesList")!.classList.remove("show");
	categoryShow = false;
	filter = "";
	sort = "createdAt:desc";
	resetFiltersElement.classList.add("hidden");
	const currentFilter: HTMLSpanElement | null =
		document.querySelector(".currentFilter");
	currentFilter ? filtersElements.removeChild(currentFilter) : undefined;
	const filterSelect = document.querySelectorAll(".filter-select");
	filterSelect.forEach((e) => {
		e.classList.remove("filter-select");
	});
	getArticles();
});

getArticles();
filterEventListener();

//Show popUp (must be improved)
if (params.get("p") == "create") {
	showPopUp("success", "Article has been added");
} else if (params.get("p") == "edit") {
	showPopUp("success", "Article has been updated");
}
