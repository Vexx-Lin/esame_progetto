import { GlobalDictDB } from "./utils.js";


async function generateArticle() {
    const db = GlobalDictDB.get();

    const archiveIndex = document.getElementById("archive-index");

    for (const [category, articles] of Object.entries(db)) {
        const categoryDiv = document.createElement('div');
        
        const title = document.createElement('h2');
        title.className = `primary-color-${category}`;
        title.innerText = String(category).charAt(0).toUpperCase() + String(category).slice(1);

        const line = document.createElement('hr');
        line.className = `m-0 tertiary-background-color-${category}`;

        const articleList = document.createElement('ul');
        for (const article of Object.values(articles.articles)) {
            const listEl = document.createElement('li');
            listEl.className = `secondary-mark-color-${category}`;

            const listElLink = document.createElement('a');
            listElLink.className = `secondary-hover-color-${category}`
            listElLink.innerText = article.fact;
            listElLink.href = 'article.html'

            listEl.appendChild(listElLink)
            articleList.appendChild(listEl);
        };

        categoryDiv.appendChild(title);
        categoryDiv.appendChild(line);
        categoryDiv.appendChild(articleList);

        archiveIndex.appendChild(categoryDiv);
    }
}

generateArticle();