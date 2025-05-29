export class Camera {

    private _x: number;
    private _y: number;
    private canvasWidth: number;
    private canvasHeight: number;

    constructor(canvasWidth: number, canvasHeight: number) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this._x = 0;
        this._y = 0;
    }

    public update(playerX: number, playerY: number): void {
        this._x = playerX - this.canvasWidth / 2;
        this._y = playerY - this.canvasHeight / 2;
    }

    public get offsetX(): number {
        return this._x;
    }

    public get offsetY(): number {
        return this._y;
    }
}