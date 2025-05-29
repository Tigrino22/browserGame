import { HUDController } from "../controllers/HUDControllers";
import { IsoMap } from "../graphics/IsoMap";

export class Engine {

    gameCanvas: HTMLCanvasElement;
    gameCtx: CanvasRenderingContext2D;

    hudCanvas: HTMLCanvasElement;
    hudCtx: CanvasRenderingContext2D;

    map: IsoMap;
    // player: Entity;

    keys: Record<string, boolean> = {};

    private lastTime: number = 0;
    private accumulator: number = 0;
    private readonly timestep: number = 1000 / 60;
    private fps: number = 0;
    private frameCount: number = 0;
    private fpsTimer: number = 0;

    private hudController: HUDController;

    constructor(gameCanvasName: string, hudCanvasName: string) {
        const gameCanvas = document.getElementById(gameCanvasName) as HTMLCanvasElement;
        const gameCtx = gameCanvas.getContext("2d");

        const hudCanvas = document.getElementById(hudCanvasName) as HTMLCanvasElement;
        const hudCtx = hudCanvas.getContext("2d");

        if (!gameCanvas || !gameCtx) throw new Error("Canvas or context game not found.");
        if (!hudCanvas || !hudCtx) throw new Error("Canvas or context HUD not found.");

        this.gameCanvas = gameCanvas;
        this.gameCtx = gameCtx;

        this.hudCanvas = hudCanvas;
        this.hudCtx = hudCtx;

        this.map = new IsoMap(this.gameCanvas);

        this.hudController = new HUDController();

        this.init();
    }

    private init(): void {
        this.setupInput();
    }

    private setupInput(): void {
        // window.addEventListener("keydown", e => this.keys[e.key] = true);
        // window.addEventListener("keyup", e => this.keys[e.key] = false);
    }

    public start(): void {
        this.lastTime = 0;

        requestAnimationFrame(this.gameLoop);
    }

    private gameLoop = (timestamp: number = 0): void => {
        if (!this.lastTime) this.lastTime = timestamp;

        const delta = timestamp - this.lastTime;
        this.lastTime = timestamp;
        this.accumulator += delta;

        this.input();

        while (this.accumulator >= this.timestep) {
            this.update();
            this.accumulator -= this.timestep;
        }

        this.render();

        this.frameCount++;
        this.fpsTimer += delta;

        if (this.fpsTimer >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.fpsTimer = 0;
        }

        requestAnimationFrame(this.gameLoop);
    }

    private input(): void {

    }

    private update(): void {
        // Future logique
    }

    private render(): void {
        this.gameCtx.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
        this.hudCtx.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);

        this.map.drawTiles();
        // this.player.draw(this.ctx);

        this.drawInfo();
    }
        
    private drawInfo(): void {
        this.hudCtx.save();

        this.hudCtx.font = "16px monospace";
        this.hudCtx.fillStyle = "white";
        this.hudCtx.strokeStyle = "black";
        this.hudCtx.lineWidth = 2;

        const lines: string[] = [];

        // const { worldX, worldY } = this.player;
        // const isoX = (worldX - worldY) * this.tileWidth / 2 + this.offsetX;
        // const isoY = (worldX + worldY) * this.tileHeight / 2 + this.offsetY;

        lines.push(`FPS: ${this.fps.toFixed(0)}`);
        // lines.push(`Player world: (${worldX.toFixed(2)}, ${worldY.toFixed(2)})`);
        // lines.push(`Screen (iso): (${isoX.toFixed(1)}, ${isoY.toFixed(1)})`);

        lines.forEach((line, i) => {
            const x = 10;
            const y = 20 + i * 20;
            this.hudCtx.strokeText(line, x, y);
            this.hudCtx.fillText(line, x, y);
        });

        this.hudCtx.restore();

            // Dessiner les coordonnées des tuiles sur le gameCanvas si activé
        if (this.hudController.shouldShowTileCoords()) {
            this.drawTileCoordinates();
        }
    }

    private drawTileCoordinates(): void {
        this.gameCtx.save();
        this.gameCtx.font = "12px monospace";
        this.gameCtx.fillStyle = "yellow";
        this.gameCtx.strokeStyle = "black";
        this.gameCtx.lineWidth = 1;

        for (let i = 0; i < this.map.getTiles().length; i++) {
            for (let j = 0; j < this.map.getTiles()[i].length; j++) {
                const tile = this.map.getTiles()[i][j];
                if (tile) {
                    const label = `${i},${j}`;
                    const x = tile.x - 10;
                    const y = tile.y + 4;

                    this.gameCtx.strokeText(label, x, y);
                    this.gameCtx.fillText(label, x, y);
                }
            }
        }

        this.gameCtx.restore();
    }


}