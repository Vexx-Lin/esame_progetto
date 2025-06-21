import { GetRandomArticle } from "./utils.js";


async function generateArticle() {
    const randomArticle = await GetRandomArticle();
    const articleData = await randomArticle.get();
    const category = await randomArticle.getCategory();

    const separator = document.getElementById('separator');
    if (separator) separator.className += ` tertiary-background-color-${category}`;
    
    const factSection = document.getElementById("fact-section");
    if (factSection) factSection.innerText = articleData.fact;

    const title = document.createElement("h2");
    title.textContent = articleData.title;
    title.className = `title primary-color-${category}`;

    const image = document.createElement("img");
    image.src = articleData.image;
    image.className = "p-2 mb-3";

    const pointsList = document.createElement("div");
    articleData.list.forEach(p => {
        const point = document.createElement("p");
        
        const pointHeading = document.createElement("strong");
        pointHeading.textContent = p.head;
        pointHeading.className = `secondary-color-${category}`;

        const pointText = document.createElement("spac");
        pointText.textContent = p.text;

        point.appendChild(pointHeading);
        point.appendChild(document.createElement("br"));
        point.appendChild(pointText);

        pointsList.appendChild(point);
    });
    pointsList.className = "text-start";
    pointsList.style = "width: 100%;";

    const articleLink = document.createElement("button");
    articleLink.className = `button-approfondisci background-gradient-${category} text-white mt-3`
    articleLink.innerText = "Approfondisci";
    articleLink.onclick = () => window.open(articleData.articleLink, '_blank').focus();

    const cardSection = document.getElementById("card-section");

    cardSection.appendChild(title);
    cardSection.appendChild(image);
    cardSection.appendChild(pointsList);
    cardSection.appendChild(articleLink)
}

generateArticle();