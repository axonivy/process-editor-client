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

type Tag<K extends keyof HTMLElementTagNameMap> = K | ((props: any, children: any[]) => HTMLElementTagNameMap[K]);
type Props = Record<string, string | number | null | undefined> | null;
type Child = Node | string;
type Children = Array<Child>;

export const h = <K extends keyof HTMLElementTagNameMap>(tag: Tag<K>, props: Props, ...children: Children): HTMLElement => {
  if (typeof tag === 'function') {
    return tag({ ...props }, children);
  }

  const el = document.createElement(tag);
  if (props) {
    Object.entries(props).forEach(([key, val]) => {
      if (key === 'className') {
        el.classList.add(...((val as string) || '').trim().split(' '));
        return;
      }
      if (key === 'style' && val && typeof val === 'object') {
        Object.entries(val).forEach(([styleKey, styleValue]) => {
          if (styleKey.startsWith('--')) {
            el.style.setProperty(styleKey, styleValue as string);
          } else {
            const kebabKey = styleKey.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
            (el.style as any)[kebabKey] = styleValue;
          }
        });
        return;
      }

      (el as any)[key as keyof HTMLElement] = val;
    });
  }

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
  style?: Partial<CSSStyleDeclaration> & Record<`--${string}`, string>;
  children?: string | number | boolean | null | Node | Array<string | number | boolean | null | Node>;
};
