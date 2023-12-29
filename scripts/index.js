// VARIABLES
const PAGE_ANCHORS = document.querySelectorAll("a")
const INDEX_ANCHOR = document.getElementById("index")
const ABOUT_ANCHOR = document.getElementById("about")
const CONTACT_ANCHOR = document.getElementById("contact")

let hidden_poems = []
let tag_selected = false
let tag_text = ""

// READY
async function onReady() {
    try {
        console.log("<SCRIPT STARTED>")
        var text = await convertMarkdownToText("content/poem_1.md");
        console.log(CONVERTER.makeHtml(text));

    } catch (error) {
        console.error("Error:", error);
    }
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
        console.error("Failed to fetch file: ", error);
        throw error;
    }
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
            reject("Error extracting Markdown file.");
        };

        // Read file as text
        reader.readAsText(blob);
    });
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
    console.log("<DOM CONTENT LOADED>")
    onReady()
});