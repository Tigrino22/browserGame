import type { Camera } from "./Camera";
import { Tile } from "./Tile";

export class IsoMap {

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private tileSize: number = 32;
    private tiles: Tile[][] = [];

    constructor (canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        const ctx = canvas?.getContext('2d');

        if (!canvas || !ctx) {
        throw new Error('Canvas or context not found');
        }
        
        this.ctx = ctx;

        this.generateTiles();

    }

    private generateTiles(): void {
        const maxTileWidth = Math.floor(this.canvas.width / this.tileSize / 2);
        const maxTileHeight = Math.floor(this.canvas.height / this.tileSize * 2);

        for (let i = 0; i < maxTileWidth; i++) {
            this.tiles[i] = [];
            for (let j = 0; j < maxTileHeight; j++) {
                const x = this.tileSize * i * 2 + this.tileSize + (j % 2 === 0 ? 0 : this.tileSize);
                const y = j * (this.tileSize / 2) + this.tileSize;

                if (x + this.tileSize <= this.canvas.width && y + this.tileSize <= this.canvas.height) {
                    this.tiles[i][j] = new Tile(x, y, this.tileSize);
                }
            }
        }
    }

    public drawTiles(camera: Camera): void {
        for (let i = 0; i < this.tiles.length; i++) {
            for (let j = 0; j < this.tiles[i].length; j++) {
                const tile = this.tiles[i][j];
                if (tile) {
                    tile.draw(this.ctx, camera.offsetX, camera.offsetY);
                }
            }
        }
    }


    public getTiles(): Tile[][] {
        return this.tiles;
    }
}
