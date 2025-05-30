/**
 * Classe représentant la caméra pour gérer le viewport dans le canvas.
 */
export class Camera {
    public offsetX: number;
    public offsetY: number;
    private viewportWidth: number;
    private viewportHeight: number;

    constructor(viewportWidth: number, viewportHeight: number) {
        this.offsetX = 0;
        this.offsetY = 0;
        this.viewportWidth = viewportWidth;
        this.viewportHeight = viewportHeight;
    }

    /**
     * Centre la caméra sur une position donnée (par exemple, le joueur).
     */
    public centerOn(x: number, y: number): void {
        this.offsetX = x - this.viewportWidth / 2;
        this.offsetY = y - this.viewportHeight / 2;
    }
}
