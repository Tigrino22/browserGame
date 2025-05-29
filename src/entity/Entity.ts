import type { Camera } from "../graphics/Camera";

export class Entity {
    private posX: number;
    private posY: number;
    private speed: number;
    private size: number;
    private image: HTMLImageElement;

    constructor(x: number, y: number, size: number, imageSrc: string, speed: number = 0.1) {
        this.posX = x;
        this.posY = y;
        this.size = size;
        this.speed = speed;

        this.image = new Image();
        this.image.src = imageSrc;

        this.image.onload = () => {
            console.log("Image loaded:", this.image.src);
        };
    }

    public move(dirX: number, dirY: number): void {

        if (dirX !== 0 && dirY !== 0) {
            const len = Math.hypot(dirX, dirY);
            dirX /= len;
            dirY /= len;
        }
        
        this.posX += dirX * this.speed;
        this.posY += dirY * this.speed;
    }

    public isReady(): boolean {
        return this.image.complete && this.image.naturalWidth !== 0;
    }

    public draw(ctx: CanvasRenderingContext2D, camera: Camera): void {

        if (this.isReady()) {
            ctx.drawImage( this.image, this.posX - camera.offsetX, this.posY - camera.offsetY, this.size, this.size);
        } else {
            console.warn("Image not ready:", this.image.src);
        }
    }

    public getPosX(): number {
        return this.posX;
    }

    public getPosY(): number {
        return this.posY;
    }

    public getSpeed(): number {
        return this.speed;
    }

    public getSize(): number {
        return this.size;
    }

    public getImage(): HTMLImageElement {
        return this.image;
    }

}
