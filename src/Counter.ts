class CounterButton extends HTMLElement {
  private count = 0;

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    // Create button
    const button = document.createElement('button');
    button.textContent = `Add kiwi`;

    // create div to show count
    const countDiv = document.createElement('div');
    countDiv.textContent = `Count: ${this.count}`;
    countDiv.style.width = '300px';

    // Add to shadow DOM
    shadow.appendChild(button);
    shadow.appendChild(countDiv);

    // Handle click
    button.addEventListener('click', () => {
      this.count++;
      const kiwis = '🥝'.repeat(this.count);
      countDiv.textContent = `Count: ${this.count} ${kiwis}`;
    });
  }
}

customElements.define('counter-button', CounterButton);
