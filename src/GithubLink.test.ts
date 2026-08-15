import { describe, it, expect, beforeEach } from 'vitest';
import './GithubLink';

describe('GithubLink', () => {
  let githubLink: HTMLElement;

  beforeEach(() => {
    githubLink = document.createElement('github-link');
    document.body.appendChild(githubLink);
  });

  it('should render the github link component', () => {
    expect(githubLink).toBeDefined();
  });

  it('should have shadow DOM with anchor element', () => {
    const shadowRoot = githubLink.shadowRoot;
    expect(shadowRoot).toBeDefined();
    expect(shadowRoot?.querySelector('a')).toBeDefined();
  });

  it('should have github-link class on anchor', () => {
    const shadowRoot = githubLink.shadowRoot;
    const link = shadowRoot?.querySelector('a');
    expect(link?.classList.contains('github-link')).toBe(true);
  });

  it('should contain SVG icon', () => {
    const shadowRoot = githubLink.shadowRoot;
    const svg = shadowRoot?.querySelector('svg');
    expect(svg).toBeDefined();
    expect(svg?.classList.contains('github-icon')).toBe(true);
  });

  it('should have SVG with path element', () => {
    const shadowRoot = githubLink.shadowRoot;
    const path = shadowRoot?.querySelector('path');
    expect(path).toBeDefined();
  });

  it('should contain styling', () => {
    const shadowRoot = githubLink.shadowRoot;
    const style = shadowRoot?.querySelector('style');
    expect(style).toBeDefined();
    expect(style?.textContent).toContain('github-link');
  });

  it('should set href attribute on link', () => {
    const shadowRoot = githubLink.shadowRoot;
    const link = shadowRoot?.querySelector('a') as HTMLAnchorElement;
    expect(link?.href).toBeDefined();
  });
});
