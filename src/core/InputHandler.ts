import type { Player } from "../entity/Player";

/**
 * Gère les interactions utilisateur via la souris.
 * Permet de déplacer le joueur en cliquant sur une tuile de la carte.
 */
export class InputHandler {
    private clicked: boolean = false;
    private listenersAttached: boolean = false;

    constructor(
        private canvas: HTMLCanvasElement,
        private player: Player
    ) {}

    /**
     * Initialise les écouteurs d'événements si ce n'est pas déjà fait.
     * Appelé à chaque frame depuis le moteur, mais ne s'exécute qu'une fois.
     */
    public input(): void {
        if (this.listenersAttached) return;

        this.listenersAttached = true;

        this.canvas.addEventListener("mousedown", (e: MouseEvent) => {
            if (!this.clicked) {
                this.clicked = true;
                this.onClick(e);
            }
        });

        this.canvas.addEventListener("mouseup", () => {
            this.clicked = false;
        });
    }

    /**
     * Détermine quelle tuile a été cliquée et ordonne au joueur de s'y déplacer.
     */
    private onClick(e: MouseEvent): void {
        const rect = this.canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        const clickedTile = this.player.map.screenToGrid(clickX, clickY, this.player.camera);

        if (!clickedTile) return;

        this.player.moveToTile(clickedTile.x, clickedTile.y);
    }
}
