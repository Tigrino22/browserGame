import { HUDController } from "../controllers/HUDControllers";
import { Player } from "../entity/Player";
import { Camera } from "../graphics/Camera";
import { IsoMap } from "../graphics/IsoMap";
import { InputHandler } from "./InputHandler";

export class Engine {
    gameCanvas: HTMLCanvasElement;
    gameCtx: CanvasRenderingContext2D;
    hudCanvas: HTMLCanvasElement;
    hudCtx: CanvasRenderingContext2D;

    camera: Camera;
    map: IsoMap;
    player: Player;
    inputHandler: InputHandler;
    private hudController: HUDController;

    private lastTime = 0;
    private accumulator = 0;
    private readonly timestep = 1000 / 60;

    private fps = 0;
    private frameCount = 0;
    private fpsTimer = 0;

    constructor(gameCanvasName: string, hudCanvasName: string) {
        const gameCanvas = document.getElementById(gameCanvasName) as HTMLCanvasElement;
        const hudCanvas = document.getElementById(hudCanvasName) as HTMLCanvasElement;

        const gameCtx = gameCanvas?.getContext("2d");
        const hudCtx = hudCanvas?.getContext("2d");

        if (!gameCanvas || !gameCtx || !hudCanvas || !hudCtx)
            throw new Error("Canvas or context not found.");

        this.gameCanvas = gameCanvas;
        this.gameCtx = gameCtx;
        this.hudCanvas = hudCanvas;
        this.hudCtx = hudCtx;

        this.camera = new Camera(this.gameCanvas.width, this.gameCanvas.height);
        this.map = new IsoMap(64, 20, 20);
        this.player = new Player(64, "/player.png", 3, this.map, this.camera);
        this.inputHandler = new InputHandler(this.gameCanvas, this.player);
        this.hudController = new HUDController();

        this.init();
    }

    private init(): void {
        const tileCoords = this.map.getTileIsoPosition(5, 3);
        if (tileCoords) {
            this.player.setupPosition(tileCoords.x, tileCoords.y - this.map.getTileSize() / 2);
        }
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

        this.inputHandler.input();

        while (this.accumulator >= this.timestep) {
            this.camera.centerOn(this.player.getPosX(), this.player.getPosY());
            this.player.update();
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

    private render(): void {
        this.gameCtx.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
        this.hudCtx.clearRect(0, 0, this.hudCanvas.width, this.hudCanvas.height);

        this.map.draw(this.gameCtx, this.camera);
        this.player.draw(this.gameCtx, this.camera);
        this.drawInfo();
    }

    private drawInfo(): void {
        this.hudCtx.save();
        this.hudCtx.font = "16px monospace";
        this.hudCtx.fillStyle = "white";
        this.hudCtx.strokeStyle = "black";
        this.hudCtx.lineWidth = 2;

        const lines = [
            `FPS: ${this.fps.toFixed(0)}`,
            `Player:`,
            `    PosX: ${this.player.getPosX()}`,
            `    PosY: ${this.player.getPosY()}`
        ];

        lines.forEach((line, i) => {
            const x = 10;
            const y = 20 + i * 20;
            this.hudCtx.strokeText(line, x, y);
            this.hudCtx.fillText(line, x, y);
        });

        this.hudCtx.restore();

        if (this.hudController.shouldShowTileCoords()) {
            // this.drawTileCoordinates();
        }
    }

    // private drawTileCoordinates(): void {
    //     this.gameCtx.save();
    //     this.gameCtx.font = "12px monospace";
    //     this.gameCtx.fillStyle = "yellow";
    //     this.gameCtx.strokeStyle = "black";
    //     this.gameCtx.lineWidth = 1;

    //     const tiles = this.map.getTiles();
    //     for (let i = 0; i < tiles.length; i++) {
    //         for (let j = 0; j < tiles[i].length; j++) {
    //             const tile = tiles[i][j];
    //             if (tile) {
    //                 const label = `${i},${j}`;
    //                 const x = tile.x - 10;
    //                 const y = tile.y + 4;
    //                 this.gameCtx.strokeText(label, x, y);
    //                 this.gameCtx.fillText(label, x, y);
    //             }
    //         }
    //     }

    //     this.gameCtx.restore();
    // }
}
