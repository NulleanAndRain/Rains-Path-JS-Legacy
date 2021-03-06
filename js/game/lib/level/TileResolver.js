class TileResolver {
	constructor(levelMap) {
		this.levelMap = levelMap;
		this.tileSize = _TILESIZE;
	}

	toIndex(pos) {
		return Math.floor(pos / _TILESIZE);
	}

	toIndexRange(pos1, pos2) {
		const pMax = Math.ceil(pos2 / this.tileSize);
		const range = [];
		let pos = this.toIndex(pos1);
		do {
			range.push(pos);
			pos++;
			// pos += this.tileSize;
		} while (pos < pMax);
		return range;
	}

	getByIndex(indexX, indexY) {
		const tile = this.levelMap.getTile(indexX, indexY);
		if (tile) {
			const x1 = indexX * this.tileSize;
			const x2 = x1 + this.tileSize;
			const y1 = indexY * this.tileSize;
			const y2 = y1 + this.tileSize;
			return {
				tile,
				x1,
				x2,
				y1,
				y2,
			};
		}
	}

	searchByPosition(posX, posY) {
		return this.getByIndex(
			this.toIndex(posX),
			this.toIndex(posY));
	}

	searchByRange(x1, x2, y1, y2) {
		const matches = [];
		this.toIndexRange(x1, x2).forEach(indexX => {
			this.toIndexRange(y1, y2).forEach(indexY => {
				const match = this.getByIndex(indexX, indexY);
				if (match) {
					matches.push(match);
				}
			});
		});
		return matches;
	}
}
