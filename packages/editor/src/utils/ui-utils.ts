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
  private input?: HTMLInputElement;

  constructor(state: boolean, onclick: (state: boolean) => void) {
    this.state = state;
    this.onclick = onclick;
  }

  public create(): HTMLElement {
    const toggle = createElement('label', ['switch']);
    this.input = document.createElement('input');
    this.input.type = 'checkbox';
    this.input.checked = this.state;
    this.input.onchange = _ev => {
      const newState = this.input?.checked ?? !this.state;
      this.state = newState;
      this.onclick(newState);
    };
    toggle.appendChild(this.input);
    toggle.appendChild(createElement('span', ['slider', 'round']));
    return toggle;
  }

  public switch(): void {
    if (this.input) {
      this.input.checked = !this.state;
      this.input?.dispatchEvent(new UIEvent('change'));
    }
  }
}

export function changeCSSClass(element: Element, css: string): void {
  element.classList.contains(css) ? element.classList.remove(css) : element.classList.add(css);
}
