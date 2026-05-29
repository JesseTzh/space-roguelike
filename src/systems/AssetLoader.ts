export interface ImageAssetDefinition {
  key: string
  url: string
}

export class AssetLoader {
  private readonly images = new Map<string, HTMLImageElement>()

  async loadImages(definitions: ImageAssetDefinition[]): Promise<void> {
    await Promise.all(definitions.map(definition => this.loadImage(definition)))
  }

  getImage(key: string): HTMLImageElement | undefined {
    return this.images.get(key)
  }

  private async loadImage(definition: ImageAssetDefinition): Promise<void> {
    await new Promise<void>(resolve => {
      const image = new Image()
      image.onload = () => {
        this.images.set(definition.key, image)
        resolve()
      }
      image.onerror = () => {
        resolve()
      }
      image.src = definition.url
    })
  }
}
