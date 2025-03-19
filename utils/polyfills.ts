if (typeof window !== 'undefined') {
  // @ts-ignore
  window.global = window;
  // @ts-ignore
  window.process = window.process || require('process/browser');
  // @ts-ignore
  window.Buffer = window.Buffer || require('buffer').Buffer;
}

export {}; 