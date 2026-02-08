/**
 * DOM utility functions to simplify element access and type casting.
 */

export function id(id: string): HTMLElement | null {
  return document.getElementById(id)
}

export function getButton(id: string): HTMLButtonElement | null {
  return document.getElementById(id) as HTMLButtonElement
}

export function getInput(id: string): HTMLInputElement | null {
  return document.getElementById(id) as HTMLInputElement
}

export function getCanvas(id: string): HTMLCanvasElement | null {
  return document.getElementById(id) as HTMLCanvasElement
}
