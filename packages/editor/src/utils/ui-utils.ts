export function createElement(tagName: string, cssClasses?: string[], label?: string): HTMLElement {
  const element = document.createElement(tagName);
  if (cssClasses) {
    element.classList.add(...cssClasses);
  }
  if (label) {
    element.textContent = label;
  }
  return element;
}

export function changeCSSClass(element: Element, css: string): void {
  element.classList.toggle(css);
}

type Tag<K extends keyof HTMLElementTagNameMap> = K | ((props: any, children: any[]) => HTMLElementTagNameMap[K]);
type Props = Record<string, string | number | null | undefined> | null;
type Child = Node | string;
type Children = Array<Child>;

export const h = <K extends keyof HTMLElementTagNameMap>(tag: Tag<K>, props: Props, ...children: Children) => {
  // If the tag is a function component, pass props and children inside it
  if (typeof tag === 'function') {
    return tag({ ...props }, children);
  }

  // Create the element and add attributes to it
  const el = document.createElement(tag);
  if (props) {
    Object.entries(props).forEach(([key, val]) => {
      if (key === 'className') {
        el.classList.add(...((val as string) || '').trim().split(' '));
        return;
      }

      (el as any)[key as keyof HTMLElement] = val;
    });
  }

  // Append all children to the element
  children.forEach((child: Child) => {
    el.append(child);
  });

  return el;
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      i: HTMLAttributes<HTMLElement>;
      div: HTMLAttributes<HTMLDivElement>;
      span: HTMLAttributes<HTMLSpanElement>;
      label: HTMLAttributes<HTMLLabelElement>;
      input: HTMLAttributes<HTMLInputElement>;
    }
  }
}

type HTMLAttributes<T> = Partial<Omit<T, 'style'>> & {
  style?: Partial<CSSStyleDeclaration>;
  children?: string | number | boolean | null | Node | Array<string | number | boolean | null | Node>;
};
