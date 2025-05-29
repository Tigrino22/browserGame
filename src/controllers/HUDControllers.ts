export class HUDController {
    private toggleTileCoordsCheckbox: HTMLInputElement;

    constructor() {
        const checkbox = document.getElementById("toggleTileCoords") as HTMLInputElement;
        if (!checkbox) throw new Error("HUD checkbox not found");
        this.toggleTileCoordsCheckbox = checkbox;
    }

    public shouldShowTileCoords(): boolean {
        return this.toggleTileCoordsCheckbox.checked;
    }
}
