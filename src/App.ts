import './Counter';
import './GithubLink';

class App extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <header>
        <h2>This is a simple vanilla TS seed</h2>
      </header>
      <main>
        <counter-button/>
      </main>
      <footer>
        <github-link/>
      </footer>
      `;

    const style = document.createElement('style');
    style.textContent = `
     :host {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }
      header {
        flex-shrink: 0;
      }
      main {
        flex: 1;
      }
      footer {
        flex-shrink: 0;
      }
    `;
    shadow.appendChild(style);
  }
}

customElements.define('my-app', App);
