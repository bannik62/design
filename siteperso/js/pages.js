import { extensionPage } from '../pages/extension.js';
import { blogPage } from '../pages/blog.js';
import { toolsPage } from '../pages/tools.js';
import { proposPage } from '../pages/propos.js';


let content = document.getElementById("content")

let blog = document.getElementById('blog')
let extension = document.getElementById('extension')
let tools = document.getElementById('tools')
let propos = document.getElementById('propos')

extension.addEventListener('click', function() {
    content.innerHTML = extensionPage;
});

blog.addEventListener('click', function() {
    content.innerHTML = blogPage;
});

tools.addEventListener('click', function() {
    content.innerHTML = toolsPage;
});

propos.addEventListener('click', function() {
    content.innerHTML = proposPage;
});
