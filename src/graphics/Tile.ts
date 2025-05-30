import type { Camera } from "../graphics/Camera";

/**
 * Classe représentant une tuile isométrique.
 */
export class Tile {
    private posX: number;
    private posY: number;
    private size: number;
    private image: HTMLImageElement;
    private walkable: boolean;

    constructor(posX: number, posY: number, size: number, imageSrc: string, walkable: boolean = true) {
        this.posX = posX;
        this.posY = posY;
        this.size = size;
        this.walkable = walkable;

        this.image = new Image();
        this.image.src = imageSrc;
    }

    /**
     * Retourne si la tuile est praticable par le joueur.
     */
    public isWalkable(): boolean {
        return this.walkable;
    }

    /**
     * Retourne la position en pixel iso.
     */
    public getPosX(): number { return this.posX; }
    public getPosY(): number { return this.posY; }

    /**
     * Dessine la tuile dans le canvas en tenant compte de la caméra.
     */
    public draw(ctx: CanvasRenderingContext2D, camera: Camera): void {
        if (this.image.complete && this.image.naturalWidth !== 0) {
            ctx.drawImage(
                this.image,
                this.posX - camera.offsetX,
                this.posY - camera.offsetY,
                this.size,
                this.size
            );
        }
    }
}
