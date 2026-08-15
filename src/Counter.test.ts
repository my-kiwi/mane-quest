import { describe, it, expect, beforeEach } from 'vitest';
import './Counter';

describe('CounterButton', () => {
  let counter: HTMLElement;

  beforeEach(() => {
    counter = document.createElement('counter-button');
    document.body.appendChild(counter);
  });

  it('should render the counter component', () => {
    expect(counter).toBeDefined();
  });

  it('should have shadow DOM with button and count display', () => {
    const shadowRoot = counter.shadowRoot;
    expect(shadowRoot).toBeDefined();
    expect(shadowRoot?.querySelector('button')).toBeDefined();
    expect(shadowRoot?.querySelector('div')).toBeDefined();
  });

  it('should display initial count as 0', () => {
    const shadowRoot = counter.shadowRoot;
    const countDiv = shadowRoot?.querySelector('div');
    expect(countDiv?.textContent).toContain('Count: 0');
  });

  it('should increment count when button is clicked', () => {
    const shadowRoot = counter.shadowRoot;
    const button = shadowRoot?.querySelector('button') as HTMLButtonElement;
    const countDiv = shadowRoot?.querySelector('div');

    button.click();
    expect(countDiv?.textContent).toContain('Count: 1');

    button.click();
    expect(countDiv?.textContent).toContain('Count: 2');
  });

  it('should display kiwi emoji for each count', () => {
    const shadowRoot = counter.shadowRoot;
    const button = shadowRoot?.querySelector('button') as HTMLButtonElement;
    const countDiv = shadowRoot?.querySelector('div');

    button.click();
    button.click();
    button.click();

    expect(countDiv?.textContent).toContain('🥝🥝🥝');
  });
});
