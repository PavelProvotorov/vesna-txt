// SHOWDOWN OPTIONS
showdown.setOption("noHeaderId", "true")

// EXTENSION
const classExtension = [{
    // Define @@class-name at the end of text, to add that class to the HTML element
    // Example: "This is a paragraph @@class-name" will convert to <p class="class-name"> This is a paragraph</p>
    type: 'output',
    regex: /<(.*?)>(.*?)@@([\w-]+)(.*?)<\/(.*?)>/g,
    replace: (match, open_tag, content, class_name) => {
        return `<${open_tag} class="${class_name}">${content.trim()}</${open_tag}>`;
    }
}];

const tagExtension = [{
  // Define ^^ at the start of text, to convert the text to a <button class="tag"> element
  // Example: "^^tag-name" will convert to <button class=tag>tag-name</button>
  type: 'output',
  regex: /<[^>]*>\^\^([^<]+)<\/[^>]*>/g,
  replace: (match, text) => {
      return `<button class="tag">${text}</button>`;
  }
}];

const timeExtension = [{
  // Define §§ at the start of text, to convert the text to a <time datetime=""> element
  // Example: "§§time" will convert to <time datetime="time">time</time>
  type: 'output',
  regex: /<[^>]*>§§([^<]+)<\/[^>]*>/g,
  replace: (match, text) => {
      return `<time datetime="${text}">${text}</time>`;
  }
}];

const breakExtension = [{
  // Define :: at the start of text, to convert the text to a <br> element
  // Example: "::" will convert to <br>
  type: 'output',
  regex: /<[^>]*>::([^<]*)<\/[^>]*>/g,
  replace: (match, text) => {
      return `<br>`;
  }
}];

// VARIABLES
const CONVERTER = new showdown.Converter({
  extensions: [
    classExtension,
    tagExtension,
    timeExtension,
    breakExtension
  ]
});