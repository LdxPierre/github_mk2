import "./form.scss";

interface Article {
	title: string;
	category: string;
	content: string;
	author: string;
	authorImg: string;
}

let errors: any[] = [];
const form: HTMLFormElement = document.querySelector("form")!;
const params: URLSearchParams = new URL(document.location.href).searchParams;
const editID: string | undefined = params.get("id") || undefined;

const getArticle = async (id: string): Promise<void> => {
	try {
		const response: Response = await fetch(
			`https://restapi.fr/api/ormide/${id}`
		);
		const body: Article = await response.json();
		articleToForm(body);
	} catch (e) {
		console.log(e);
	}
};

const articleToForm = (article: Article): void => {
	const imgInput: HTMLInputElement = form.querySelector("#authorImg")!;
	article.authorImg ===
	"https://cdn-icons-png.flaticon.com/512/1246/1246351.png"
		? (imgInput.value = "")
		: (imgInput.value = article.authorImg);
	(<HTMLInputElement>form.querySelector("#title")).value = article.title;
	(<HTMLInputElement>form.querySelector("#category")).value = article.category;
	(<HTMLInputElement>form.querySelector("#author")).value = article.author;
	(<HTMLInputElement>form.querySelector("#body")).value = article.content;
};

const formIsValid = (formArticle: Article) => {
	errors = [];
	formArticle;
	if (
		!formArticle.title ||
		!formArticle.content ||
		!formArticle.category ||
		!formArticle.author
	) {
		console.log("form is not valid");
		return false;
	} else {
		if (!formArticle.authorImg) {
			formArticle.authorImg =
				"https://cdn-icons-png.flaticon.com/512/1246/1246351.png";
		}
		return true;
	}
};

const newArticle = async (formArticle: Article, method: "POST" | "PATCH") => {
	try {
		let url: string = "https://restapi.fr/api/ormide/";
		const article: string = JSON.stringify(formArticle);
		editID ? (url = url + editID) : undefined;
		const response: Response = await fetch(url, {
			method: method,
			body: article,
			headers: {
				"content-type": "application/json",
			},
		});
		const body: Response = await response.json();
		window.location.href = `./index.html`;
	} catch (e) {
		console.log(e);
	}
};

//show array of errors
const showErrors = (): void => {
	const errorsElement: HTMLDivElement = document.querySelector(".errors")!;
	errorsElement.innerHTML = ``;
	errors.forEach((e) => {
		const li: HTMLLIElement = document.createElement("li");
		li.innerHTML = `${e}`;
		errorsElement.append(li);
	});
};

//autocomplete form
if (editID) {
	getArticle(editID);
}

//submit patch if edit else post
form.addEventListener("submit", (event: SubmitEvent) => {
	event.preventDefault();
	const formArticle: Article = {
		title: (<HTMLInputElement>form.querySelector("#title")).value,
		category: (<HTMLInputElement>form.querySelector("#category")).value,
		content: (<HTMLInputElement>form.querySelector("#body")).value,
		author: (<HTMLInputElement>form.querySelector("#author")).value,
		authorImg: (<HTMLInputElement>form.querySelector("#authorImg")).value,
	};
	if (formIsValid(formArticle)) {
		editID ? newArticle(formArticle, "PATCH") : newArticle(formArticle, "POST");
	} else {
		errors.push("All inputs are not completed");
		showErrors();
	}
});
