export class Tile {
    x: number;
    y: number;
    size: number;
    color: string;

    constructor(x: number, y: number, size: number, color: string = "#555") {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (!ctx) return;
        const halfW = this.size;
        const halfH = this.size / 2;

        ctx.beginPath();
        ctx.moveTo(this.x, this.y - halfH)                 // haut
        ctx.lineTo(this.x + halfW, this.y)                 // droite
        ctx.lineTo(this.x, this.y + halfH)                 // bas
        ctx.lineTo(this.x - halfW, this.y)                 // gauche
        ctx.closePath();

        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = "#333";
        ctx.stroke();
    }
}