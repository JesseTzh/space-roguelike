export interface InputVector {
  x: number
  y: number
}

export class PlayerControlSystem {
  private keys = new Set<string>()
  private dragging = false
  private lastPointerX = 0
  private lastPointerY = 0
  private pendingDragX = 0
  private pendingDragY = 0
  dragSensitivity = 1

  attach(canvas: HTMLCanvasElement, uiRoot: HTMLElement): void {
    window.addEventListener('keydown', event => this.handleKeyDown(event))
    window.addEventListener('keyup', event => this.handleKeyUp(event))

    const isUiTarget = (target: EventTarget | null): boolean => target instanceof Node && uiRoot.contains(target)

    canvas.addEventListener('pointerdown', event => {
      if (isUiTarget(event.target)) return
      this.dragging = true
      this.lastPointerX = event.clientX
      this.lastPointerY = event.clientY
      canvas.setPointerCapture(event.pointerId)
      event.preventDefault()
    })

    canvas.addEventListener('pointermove', event => {
      if (!this.dragging) return
      const dx = event.clientX - this.lastPointerX
      const dy = event.clientY - this.lastPointerY
      this.pendingDragX += dx * this.dragSensitivity
      this.pendingDragY += dy * this.dragSensitivity
      this.lastPointerX = event.clientX
      this.lastPointerY = event.clientY
      event.preventDefault()
    })

    const stopDrag = (event: PointerEvent): void => {
      if (!this.dragging) return
      this.dragging = false
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId)
      event.preventDefault()
    }
    canvas.addEventListener('pointerup', stopDrag)
    canvas.addEventListener('pointercancel', stopDrag)
  }

  consumeDrag(): InputVector {
    const vector = { x: this.pendingDragX, y: this.pendingDragY }
    this.pendingDragX = 0
    this.pendingDragY = 0
    return vector
  }

  getKeyboardVector(): InputVector {
    if (this.dragging) return { x: 0, y: 0 }
    let x = 0
    let y = 0
    if (this.keys.has('KeyA')) x -= 1
    if (this.keys.has('KeyD')) x += 1
    if (this.keys.has('KeyW')) y -= 1
    if (this.keys.has('KeyS')) y += 1
    return { x, y }
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (['KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(event.code)) {
      this.keys.add(event.code)
      event.preventDefault()
    }
  }

  private handleKeyUp(event: KeyboardEvent): void {
    this.keys.delete(event.code)
  }
}
