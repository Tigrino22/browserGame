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

    draw(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number): void {
        const screenX = this.x - offsetX;
        const screenY = this.y - offsetY;
        // ne dessine pas si hors écran
        if (screenX + this.size < 0 || screenY + this.size < 0 || screenX - this.size > ctx.canvas.width || screenY - this.size > ctx.canvas.height)
            return;

        const halfW = this.size;
        const halfH = this.size / 2;

        ctx.beginPath();
        ctx.moveTo(screenX, screenY - halfH);
        ctx.lineTo(screenX + halfW, screenY);
        ctx.lineTo(screenX, screenY + halfH);
        ctx.lineTo(screenX - halfW, screenY);
        ctx.closePath();

        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = "#333";
        ctx.stroke();
    }

}