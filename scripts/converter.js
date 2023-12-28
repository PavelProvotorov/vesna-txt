// SHOWDOWN OPTIONS
showdown.setOption("noHeaderId", "true")

// EXTENSION
const classExtension = [{
    // Define @class-name at the end of text, to add that class to the HTML element
    // Example: "This is a paragraph @class-name" will convert to <p class="class-name"> This is a paragraph</p>
    type: 'output',
    regex: /<(.*?)>(.*?)@([\w-]+)(.*?)<\/(.*?)>/g,
    replace: (match, openTag, content, className) => {
        return `<${openTag} class="${className}">${content.trim()}</${openTag}>`;
    }
}];

const tagExtension = [{
  // Define ^^ at the start of text, to convert the text to a <button class="tag"> element
  // Example: "^^tag-name" will convert to <button class=tag>tag-name</button>
  type: 'output',
  regex: /<[^>]*>\^\^([^<]+)<\/[^>]*>/g,
  replace: (match, text) => {
      return `<button class=tag">${text}</button>`;
  }
}];

// VARIABLES
const CONVERTER = new showdown.Converter({
  extensions: [
    classExtension,
    tagExtension
  ]
});