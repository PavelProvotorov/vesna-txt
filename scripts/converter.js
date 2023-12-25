// SHOWDOWN OPTIONS
showdown.setOption("noHeaderId", "true")

// EXTENSION
// Define !class-name at the end of text, to add that class to the HTML element
// Example: "This is a paragraph !myclass" will convert to <p class="myclass"> This is a paragraph</p>
const classExtension = [{
    type: 'output',
    regex: /<(.*?)>(.*?)!([\w-]+)(.*?)<\/(.*?)>/g,
    replace: function (output, openTag, content, className) {
        return `<${openTag} class="${className}">${content.trim()}</${openTag}>`;
    }
}];

// VARIABLES
const CONVERTER = new showdown.Converter({
  extensions: [classExtension]
});