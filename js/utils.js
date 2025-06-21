// Base Path Closure
const GlobalBasePath = (() => {
    let _basePath = 'db';

    const Store = {
        get: () => `${_basePath}`
    }

    return Object.freeze(Store);
})();

/**
 * A simple util function that a the fetched and loaded json file
 *
 * @returns Wathever was in the json file as a js structure.
 */
async function getJsonData(path) {
    const _data = await fetch(path)
    return await _data.json();
}

async function loadCategoriesList() {
    return getJsonData(`${GlobalBasePath.get()}/index.json`);
}

async function loadCategory(category) {
    const style = await getJsonData(`${GlobalBasePath.get()}/${category}/style.json`);
    const articles = await getJsonData(`${GlobalBasePath.get()}/${category}/index.json`);

    let loadedArticles = {}
    await Promise.all(articles.map(async article => {
        loadedArticles[article] = await getJsonData(`${GlobalBasePath.get()}/${category}/${article}`);
    }))

    return {
        style: structuredClone(style),
        articles: structuredClone(loadedArticles)
    }
}

/**
 * Loads the json files in the db folder in a disct structure.
 * {
 *      CategoryName1: [
 *          article1.json,
 *          article2.json
 *      ],
 *      CategoryName2: [
 *          article3.json,
 *          article4.json
 *      ]
 * }
 *
 * @returns dict[str, list[str]].
 */
async function loadDB() {
    const categories = await loadCategoriesList();
    const entries = await Promise.all(categories.map(async category => {
        return [category, await loadCategory(category)]
    }));

    const db = Object.fromEntries(entries);
    return structuredClone(db);
}

// Global DB Dict Closure
export const GlobalDictDB = await (async () => {
    let _db = await loadDB();

    const Store = {
        get: () => structuredClone(_db),
        update: async () => {_db = await loadDB()}
    }

    return Store;
})();

/**
 * Loads a random article from the passed GlobalDictDB
 *
 * @returns A closure containing two methods: get and getStyle
 */
export async function GetRandomArticle() {
    const db = GlobalDictDB.get();

    const categories = Object.keys(db)
    const selectedCategory = categories[Math.floor(Math.random() * categories.length)];

    const articles = Object.keys(db[selectedCategory].articles);
    const selectedArticle = articles[Math.floor(Math.random() * articles.length)];

    const Store = {
        get: async () => structuredClone(db[selectedCategory].articles[selectedArticle]),
        getCategory: async () => structuredClone(selectedCategory)
    }

    return Object.freeze(Store);
}

/**
 * Loads all the css vars for all the styles
 *
 * @returns undefined (has no return)
 */
async function LoadCategoryStyles() {
    const db = GlobalDictDB.get();
    const root = document.documentElement;

    for (const category of Object.keys(db)) {
        const categoryStyle = await getJsonData(`${GlobalBasePath.get()}/${category}/style.json`);
        
        root.style.setProperty(`--primary-color-${category}`, categoryStyle.primary);
        root.style.setProperty(`--secondary-color-${category}`, categoryStyle.secondary);
        root.style.setProperty(`--tertiary-color-${category}`, categoryStyle.tertiary);
    }
}

/**
 * Loads the needed css for the category style classes
 *
 * @returns undefined (has no return)
 */
export async function LoadBaseStyleClasses() {
    await LoadCategoryStyles();

    const db = GlobalDictDB.get();
    const categories = Object.keys(db);

    var style = document.createElement('style');

    let classesDefinitions = '';
    categories.map(category => {
        classesDefinitions += `
            .primary-color-${category} {
                color: var(--primary-color-${category});
            }
            .secondary-color-${category} {
                color: var(--secondary-color-${category});
            }
            .tertiary-color-${category} {
                color: var(--tertiary-color-${category});
            }
            .primary-background-color-${category} {
                background-color: var(--primary-color-${category});
            }
            .secondary-background-color-${category} {
                background-color: var(--secondary-color-${category});
            }
            .tertiary-background-color-${category} {
                background-color: var(--tertiary-color-${category});
            }
            .primary-mark-color-${category}::marker {
                color: var(--primary-color-${category});
            }
            .secondary-mark-color-${category}::marker {
                color: var(--secondary-color-${category});
            }
            .tertiary-mark-color-${category}::marker {
                color: var(--tertiary-color-${category});
            }
            .background-gradient-${category} {
                background: linear-gradient(45deg, var(--tertiary-color-${category}), var(--primary-color-${category}));
            }
            .primary-hover-color-${category}:hover {
                color: var(--primary-color-${category});
            }
            .secondary-hover-color-${category}:hover {
                color: var(--secondary-color-${category});
            }
            .tertiary-hover-color-${category}:hover {
                color: var(--tertiary-color-${category});
            }
        `
    });

    style.innerHTML = classesDefinitions;
    document.getElementsByTagName('head')[0].appendChild(style);
}