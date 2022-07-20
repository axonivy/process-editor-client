export function createIcon(cssClasses: string[]): HTMLElement {
  const classes = cssClasses.map(cssClass => cssClass.split(' ')).flat();
  return createElement('i', classes);
}

export function createElement(tagName: string, cssClasses?: string[]): HTMLElement {
  const element = document.createElement(tagName);
  if (cssClasses) {
    element.classList.add(...cssClasses);
  }
  return element;
}

export class ToggleSwitch {
  private state: boolean;
  private onclick: (state: boolean) => void;

  constructor(state: boolean, onclick: (state: boolean) => void) {
    this.state = state;
    this.onclick = onclick;
  }

  public create(): HTMLElement {
    const toggle = createElement('label', ['switch']);

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = this.state;
    input.onchange = ev => {
      this.state = !this.state;
      this.onclick(this.state);
    };
    toggle.appendChild(input);
    toggle.appendChild(createElement('span', ['slider', 'round']));
    return toggle;
  }
}

export function changeCSSClass(element: Element, css: string): void {
  element.classList.contains(css) ? element.classList.remove(css) : element.classList.add(css);
}
