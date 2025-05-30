import type { Camera } from "../graphics/Camera";

/**
 * Classe de base représentant une entité visible et mobile sur la carte.
 */
export class Entity {
    private posX: number;
    private posY: number;
    private speed: number;
    private size: number;
    private image: HTMLImageElement;

    /**
     * @param size Taille en pixels de l'entité (largeur/hauteur)
     * @param imageSrc Chemin vers l'image représentant l'entité
     * @param speed Vitesse de déplacement (par défaut 2)
     */
    constructor(size: number, imageSrc: string, speed: number = 2) {
        this.posX = 0;
        this.posY = 0;
        this.size = size;
        this.speed = speed;

        this.image = new Image();
        this.image.src = imageSrc;

        this.image.onload = () => {
            console.log("Image loaded:", this.image.src);
        };
    }

    /**
     * Initialise la position de l'entité.
     */
    public setupPosition(x: number, y: number): void {
        this.posX = x;
        this.posY = y;
    }

    /**
     * Déplace l'entité dans la direction donnée, normalisée si nécessaire.
     * @param dirX Direction horizontale (-1 à 1)
     * @param dirY Direction verticale (-1 à 1)
     */
    public move(dirX: number, dirY: number): void {
        if (dirX !== 0 && dirY !== 0) {
            const len = Math.hypot(dirX, dirY);
            dirX /= len;
            dirY /= len;
        }

        this.posX += dirX * this.speed;
        this.posY += dirY * this.speed;
    }

    /**
     * Vérifie si l'image est chargée et prête à être dessinée.
     */
    public isReady(): boolean {
        return this.image.complete && this.image.naturalWidth !== 0;
    }

    /**
     * Dessine l'entité sur le canvas en prenant en compte le décalage de la caméra.
     */
    public draw(ctx: CanvasRenderingContext2D, camera: Camera): void {
        if (this.isReady()) {
            ctx.drawImage(
                this.image,
                this.posX - camera.offsetX - this.size / 2,
                this.posY - camera.offsetY - this.size / 2,
                this.size,
                this.size
            );
        } else {
            console.warn("Image not ready:", this.image.src);
        }
    }

    // Accesseurs
    public getPosX(): number { return this.posX; }
    public getPosY(): number { return this.posY; }
    public getSpeed(): number { return this.speed; }
    public getSize(): number { return this.size; }
    public getImage(): HTMLImageElement { return this.image; }
}
