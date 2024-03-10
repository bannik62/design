import { loadArticles } from '../back/backBlog/serverBlog/targetGpt.js';

const blogPage = `
<div id="travaux">load
    ${loadArticles()} 
    <footer class="footer">
        <div class="footer-content">
            <p>blog personel</p>
            <ul>
                <li><a href="#">Accueil</a></li>
                <li><a href="#">À propos</a></li>
                <li><a href="#">Services</a></li>
                <li><a href="#">Contact</a></li>
            </ul>
            <p>&copy; 2024 CodeurBase.fr</p>
        </div>
    </footer>
`;

export { blogPage };
