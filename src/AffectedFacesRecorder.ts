
export default class AffectedFacesRecorder {
    private _nAffectedFaces: number = 0;
    private _affectedFaces: Uint32Array;
    private _isFaceAffected: Uint8Array; // Used as if it's a boolean array
    private _isFaceAffectedEmpty: Uint8Array; // Used to clear _isFaceAffected. Should not be modified once initialized.

    constructor(nFaces: number) {
        this._affectedFaces = new Uint32Array(nFaces);
        this._isFaceAffected = new Uint8Array(nFaces);
        this._isFaceAffectedEmpty = new Uint8Array(nFaces);
    }

    add(faceIndex: number) {
        if (!this._isFaceAffected[faceIndex]) {
            this._isFaceAffected[faceIndex] = 1;
            this._affectedFaces[this._nAffectedFaces] = faceIndex;
            this._nAffectedFaces += 1;
        }
    }

    reset() {
        this._nAffectedFaces = 0;
        this._isFaceAffected.set(this._isFaceAffectedEmpty);
    }

    forEach(f: (i: any) => any) {
        for (var i = 0; i < this._nAffectedFaces; i += 1) {
            f(this._affectedFaces[i]);
        }
    }

    get length(): number {
        return this._nAffectedFaces;
    }

    contains(faceIndex: number): boolean {
        return !!this._isFaceAffected[faceIndex];
    }
}

