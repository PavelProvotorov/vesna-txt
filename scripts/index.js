// VARIABLES
const PAGE_ANCHORS = document.querySelectorAll("a")
const INDEX_ANCHOR = document.getElementById("index")
const ABOUT_ANCHOR = document.getElementById("about")
const CONTACT_ANCHOR = document.getElementById("contact")
const MAIN = document.getElementById("main")

let STORED_POEMS = undefined
let STORED_POEMS_PATH = undefined

let hidden_poems = []
let tag_selected = false
let tag_text = ""

// READY
async function onReady() {
    try {
        await preparePoems()
        STORED_POEMS_PATH = await createBlobFromHTML(STORED_POEMS.outerHTML)
        htmx.ajax("GET", STORED_POEMS_PATH, {target:"#main", swap:"innerHTML"})

    } catch (error) {
        console.error("Error:", error);
    };
};

// FUNCTIONS
async function convertMarkdownToText(path) {
    try {
        // Fetch local storage file
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error("Network error");
        }

        // Extract text from blob
        const blob = await response.blob();
        const text = await extractMarkdownText(blob);
        return text;

    } catch (error) {
        console.error("Error converting markdown:", error);
        throw error;
    };
};

async function extractMarkdownText(blob) {
    return new Promise((resolve, reject) => {
        // Initiate FileReader
        const reader = new FileReader();
        
        // Listen to events
        reader.onload = function (event) {
            const text = event.target.result;
            resolve(text);
        };
        reader.onerror = function (event) {
            reject("Error extracting .md file.");
        };

        // Read file as text
        reader.readAsText(blob);
    });
};

async function preparePoems() {
    try {
        // Prepare local poem file
        STORED_POEMS = document.createElement("div");
        STORED_POEMS.setAttribute("id", "page")

        // Fetch local storage .json file with poems
        const response = await fetch("content/poems.json");
        if (!response.ok) {
            throw new Error("Network error");
        }

        // Extract poem paths to .md files
        const poem_data = await response.json();
        const poem_paths = poem_data.paths;
        
        // Build poems and add them to storage
        for (const path of poem_paths) {
            const text = await convertMarkdownToText(path);
            const text_converted = await CONVERTER.makeHtml(text);
            await buildPoemFromHTML(text_converted);
        }

    } catch (error) {
        console.error("Error preparing poems:", error);
    };
};

async function buildPoemFromHTML(html) {
    try {
        // Fetch .html template
        const response = await fetch("content/poem_template.html");
        if (!response.ok) {
            throw new Error("Failed to fetch poem template");
        }
        let template_text = await response.text();

        // Prepare template element
        let template_element = document.createElement("div");
        template_element.innerHTML = template_text;

        const template_content_section = template_element.querySelector("article.poem");
        const template_tag_section = template_element.querySelector("div.tag-container");
        const template_time_section = template_element.querySelector("div.time-container");

        // Prepare content element
        let content_element = document.createElement("div");
        content_element.innerHTML = html;

        const content_title = Array.from(content_element.querySelectorAll("h1")).reverse();
        const content_lines = Array.from(content_element.querySelectorAll("p, br")).reverse();
        const content_tags = Array.from(content_element.querySelectorAll("button.tag"));
        const content_time= Array.from(content_element.querySelectorAll("time"));

        // Append content to template
        content_lines.forEach((element) => {
            template_content_section.prepend(element)
        });

        content_title.forEach((element) => {
            template_content_section.prepend(element)
        });

        content_tags.forEach((element) => {
            template_tag_section.appendChild(element)
        });

        content_time.forEach((element) => {
            template_time_section.appendChild(element)
        });

        // Add poem to storage
        STORED_POEMS.appendChild(template_content_section)

    } catch (error) {
        console.error('Error:', error);
    }
};

async function createBlobFromHTML(html) {
    try {
        // Create a Blob containing the HTML content
        const blob = new Blob([html], { type: "text/html" });

        // Create a temporary URL to access the Blob content
        return blob_url = URL.createObjectURL(blob);

    } catch (error) {
        console.error("Error:", error);
    };
};

function clickedTag(tag) {
    const poems = Array.from(document.querySelectorAll("article.poem"))

    // Enable tag
    if(!tag_selected){
        hidden_poems = []
        poems.forEach((element) => {
            const tag_container = element.getElementsByClassName("tag-container")[0]
            findTag(element, tag_container, tag)
            });
        disablePoem(hidden_poems)
        scrollToTop()

    // Switch tag
    } else if((tag_selected) && (tag_text !== tag)){
        disableTag(Array.from(document.querySelectorAll("button.tag-toggle")))
        enablePoem(hidden_poems)
        hidden_poems = []
        poems.forEach((element) => {
            const tag_container = element.getElementsByClassName("tag-container")[0]
            findTag(element, tag_container, tag)
            });
        disablePoem(hidden_poems)
        scrollToTop()

    // Disable tag
    } else if((tag_selected) && (tag_text === tag)){
        disableTag(Array.from(document.querySelectorAll("button.tag-toggle")))
        enablePoem(hidden_poems)
        tag_selected = false
        scrollToTop()
    };
};

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
};

function findTag(element, container, tag) {
    // Find tag in list
    for (let i = 0; i < container.children.length; i++) {
        let child = container.children[i];
        if (child.textContent === tag) {
            enableTag([child])
            tag_selected = true
            tag_text = tag
            return
        };
    };
    // Push element for reference
    hidden_poems.push(element)
};

function enableTag(list, tag) {
    list.forEach((element) => {
        element.classList.add("tag-toggle")
    });
};

function disableTag(list, tag) {
    list.forEach((element) => {
        element.classList.remove("tag-toggle")
    });
};

function enablePoem(list) {
    list.forEach((element) => {
        element.classList.remove("hidden")
    });
};

function disablePoem(list) {
    list.forEach((element) => {
        element.classList.add("hidden")
    });
};

// EVENTS
PAGE_ANCHORS.forEach((element) => {
    element.addEventListener("click", (event) => {
        // Prevent <a> from jumping
        event.preventDefault()

        // Smooth scroll into view
        const target_id = element.getAttribute("href").substring(1)
        const target_element = document.getElementById(target_id)
        
        target_element.scrollIntoView({ behavior: "smooth"});

        const anchor = event.target.id
        if (anchor === "index"){
            htmx.ajax("GET", STORED_POEMS_PATH, {target:"#main", swap:"innerHTML show:window:top"})
        }

        if (anchor === "about"){
            htmx.ajax("GET", "content/about.html", {target:"#main", swap:"innerHTML show:window:top"})
        }
    });
});

document.addEventListener("click", (event) => {
    const target = event.target
    const target_name = target.tagName

    if(target_name === "BUTTON" && target.classList.contains("tag")){
        clickedTag(target.textContent)
    };
});

document.addEventListener('DOMContentLoaded', (event) => {
    onReady()
});