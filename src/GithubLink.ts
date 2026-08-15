const getRepoUrlFromLocation = (): string => {
  const { hostname, pathname } = window.location;

  // Example: username.github.io
  const username = hostname.split('.')[0];

  // pathname will be like /repo-name/ or just /
  const pathParts = pathname.split('/').filter(Boolean);

  if (!username || pathParts.length === 0) {
    return '';
  }

  const repo = pathParts[0];

  return `https://github.com/${username}/${repo}`;
};

const githubSVG = `
  <svg
      class="github-icon"
      height="24"
      viewBox="0 0 16 16"
      version="1.1"
      width="24"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="currentColor"
        d="M8 0C3.58 0 0 3.58 0 8a8 8 0 005.47 7.59c.4.07.55-.17.55-.38
        0-.19-.01-.82-.01-1.49-2 .37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13
        -.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87
        2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95
        0-.87.31-1.59.82-2.15-.08-.2-.36-1.01.08-2.11
        0 0 .67-.21 2.2.82a7.7 7.7 0 012-.27c.68 0 1.36.09 2 .27
        1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.91.08 2.11
        .51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95
        .29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2
        0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"
      ></path>
  </svg>`;

class GithubLink extends HTMLElement {
  private link: HTMLAnchorElement;

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    // Create button
    this.link = document.createElement('a');
    this.link.href = getRepoUrlFromLocation();
    this.link.innerHTML = githubSVG;
    this.link.classList.add('github-link');

    // Optional styling
    const style = document.createElement('style');
    style.textContent = `
      a.github-link, 
      a.github-link:visited {
        margin:auto;
        display:block;
        text-align: center;
        padding: 1rem;
        margin-top: 3rem;
        color: var(--text-color);
      }

      .github-icon {
        fill: #333;
        transition: fill 0.2s;
      }

      .github-icon:hover {
        fill: #000;
        cursor: pointer;
      }
    `;

    // Add to shadow DOM
    shadow.appendChild(style);
    shadow.appendChild(this.link);
  }
}

customElements.define('github-link', GithubLink);
