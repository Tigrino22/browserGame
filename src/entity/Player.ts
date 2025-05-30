import type { Camera } from "../graphics/Camera";
import type { IsoMap } from "../graphics/IsoMap";
import { Entity } from "./Entity";
import PF from 'pathfinding';

/**
 * Classe représentant le joueur, extension d'Entity avec gestion du pathfinding.
 */
export class Player extends Entity {
    private path: { x: number; y: number }[] = [];
    private isMoving: boolean = false;

    public map: IsoMap;
    public camera: Camera;

    /**
     * @param size Taille en pixels du joueur
     * @param imageSrc Chemin vers l'image du joueur
     * @param speed Vitesse de déplacement (par défaut 2)
     * @param map Référence à la carte isométrique
     * @param camera Référence à la caméra
     */
    constructor(size: number, imageSrc: string, speed: number = 2, map: IsoMap, camera: Camera) {
        super(size, imageSrc, speed);
        this.map = map;
        this.camera = camera;
    }

    /**
     * Calcule un chemin vers une tuile cible via A* et commence le déplacement.
     */
    public moveToTile(targetX: number, targetY: number): void {
        const grid = this.map.getPathfindingGrid();
        const finder = new PF.AStarFinder();

        const startTile = this.map.isoToGrid(this.getPosX(), this.getPosY());
        if (!startTile) return;

        const path = finder.findPath(startTile.x, startTile.y, targetX, targetY, grid);

        if (path.length > 0) {
            // Supprime la première étape (position actuelle)
            path.shift();

            // Convertit chaque étape du chemin en coordonnées isométriques
            this.path = path.map(([x, y]) => {
                return this.map.getTileIsoPosition(x, y)!;
            });

            this.isMoving = true;
        }
    }

    /**
     * Mets à jour la position du joueur en suivant le chemin calculé.
     */
    public update(): void {
        if (this.isMoving && this.path.length > 0) {
            const target = this.path[0];
            const dx = target.x - this.getPosX();
            const dy = target.y - this.getPosY();

            const distance = Math.hypot(dx, dy);

            if (distance < this.getSpeed()) {
                // Arrivé à la cible
                this.setupPosition(target.x, target.y);
                this.path.shift();

                if (this.path.length === 0) {
                    this.isMoving = false;
                }
            } else {
                // Se déplace vers la cible
                const dirX = dx / distance;
                const dirY = dy / distance;
                this.move(dirX, dirY);
            }
        }
    }

    // Accesseur pour savoir si le joueur est en train de bouger
    public getIsMoving(): boolean {
        return this.isMoving;
    }
}
