import type { Camera } from "./Camera";
import { Tile } from "./Tile";
import PF from "pathfinding";

/**
 * Classe représentant la carte isométrique composée de tuiles.
 */
export class IsoMap {
    private tiles: Tile[][] = [];
    private tileSize: number;
    private mapWidth: number;
    private mapHeight: number;

    constructor(tileSize: number, width: number, height: number) {
        this.tileSize = tileSize;
        this.mapWidth = width;
        this.mapHeight = height;

        this.generateTiles(width, height, tileSize);
    }

    private generateTiles(width: number, height: number, tileSize: number): void {
    
        for (let x = 0; x < width; x++) {
            this.tiles[x] = [];
            for (let y = 0; y < height; y++) {
                // Calcule la position iso classique en pixels (à ajuster selon ta projection)
                const posX = (x - y) * (tileSize / 2);
                const posY = (x + y) * (tileSize / 4);
                // Image par défaut (à changer avec un chemin valide)
                this.tiles[x][y] = new Tile(posX, posY, tileSize, "/tiles/grass_01.png", true);
            }
        }
    }


    /**
     * Convertit des coordonnées iso (pixel) en coordonnées de grille (index).
     */
    public isoToGrid(x: number, y: number): { x: number; y: number } | null {
        const tileWidthHalf = this.tileSize / 2;
        const tileHeightQuarter = this.tileSize / 4;

        const gridX = (y / tileHeightQuarter + x / tileWidthHalf) / 2;
        const gridY = (y / tileHeightQuarter - x / tileWidthHalf) / 2;

        const tileX = Math.floor(gridX);
        const tileY = Math.floor(gridY);

        if (tileX < 0 || tileX >= this.mapWidth || tileY < 0 || tileY >= this.mapHeight) {
            return null;
        }
        return { x: tileX, y: tileY };
    }

    public screenToGrid(screenX: number, screenY: number, camera: Camera): { x: number; y: number } | null {
        // Ajuster les coordonnées par la caméra pour passer des coords écran aux coords monde
        const worldX = screenX + camera.offsetX;
        const worldY = screenY + camera.offsetY;

        const tileWidthHalf = this.tileSize / 2;
        const tileHeightQuarter = this.tileSize / 4;

        // Inversion des formules iso :
        // gridX - gridY = worldX / tileWidthHalf
        // gridX + gridY = worldY / tileHeightQuarter

        const gridX = (worldY / tileHeightQuarter + worldX / tileWidthHalf) / 2;
        const gridY = (worldY / tileHeightQuarter - worldX / tileWidthHalf) / 2;

        // Arrondir à l'entier le plus proche (car indices de grille)
        const tileX = Math.floor(gridX);
        const tileY = Math.floor(gridY);

        // Vérifier que la tuile est dans les bornes
        if (tileX < 0 || tileX >= this.mapWidth || tileY < 0 || tileY >= this.mapHeight) {
            return null;
        }

        return { x: tileX, y: tileY };
    }


    /**
     * Retourne la position iso en pixels du centre de la tuile (x, y) de la grille.
     */
    public getTileIsoPosition(gridX: number, gridY: number): { x: number; y: number } | null {
        if (gridX < 0 || gridX >= this.mapWidth || gridY < 0 || gridY >= this.mapHeight) {
            return null;
        }
        const tile = this.tiles[gridX][gridY];
        return { x: tile.getPosX(), y: tile.getPosY() };
    }

    /**
     * Génère et retourne une grille utilisable par pathfinding.js (0 = walkable, 1 = bloqué).
     */
    public getPathfindingGrid(): PF.Grid {
        const matrix = this.tiles.map(row =>
            row.map(tile => (tile.isWalkable() ? 0 : 1))
        );
        return new PF.Grid(matrix);
    }

    /**
     * Dessine toutes les tuiles de la carte sur le canvas.
     */
    public draw(ctx: CanvasRenderingContext2D, camera: Camera): void {
        for (let x = 0; x < this.mapWidth; x++) {
            for (let y = 0; y < this.mapHeight; y++) {
                this.tiles[x][y].draw(ctx, camera);
            }
        }
    }

    /**
     * Getters & Setters
     */
    public getTileSize(): number {return this.tileSize;}
    public getMapWidth(): number {return this.mapWidth;}
    public getMapHeight(): number {return this.mapHeight;}
    public getTiles(): Tile[][] {return this.tiles;}

}
