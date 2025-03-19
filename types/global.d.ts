declare global {
  interface Window {
    global: Window;
    process: any;
    Buffer: any;
  }
}

export {}; 