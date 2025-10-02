// Grid coordinate transformation utilities for 5x5 isometric grid

export interface GridCoordinate {
  x: number; // -2 to 2
  y: number; // -2 to 2
}

export interface GridPosition {
  col: number; // 0 to 4
  row: number; // 0 to 4
}

/**
 * Convert save data coordinates (-2 to 2) to array index (0-24)
 */
export function coordinateToIndex(x: number, y: number): number {
  const col = x + 2; // Convert -2->0, -1->1, 0->2, 1->3, 2->4
  const row = y + 2; // Convert -2->0, -1->1, 0->2, 1->3, 2->4
  return row * 5 + col;
}

/**
 * Convert array index (0-24) to save data coordinates (-2 to 2)
 */
export function indexToCoordinate(index: number): GridCoordinate {
  const col = index % 5;
  const row = Math.floor(index / 5);
  return {
    x: col - 2, // Convert 0->-2, 1->-1, 2->0, 3->1, 4->2
    y: row - 2  // Convert 0->-2, 1->-1, 2->0, 3->1, 4->2
  };
}

/**
 * Convert save data coordinates to grid position (0-4, 0-4)
 */
export function coordinateToPosition(coord: GridCoordinate): GridPosition {
  return {
    col: coord.x + 2,
    row: coord.y + 2
  };
}

/**
 * Convert grid position to save data coordinates
 */
export function positionToCoordinate(pos: GridPosition): GridCoordinate {
  return {
    x: pos.col - 2,
    y: pos.row - 2
  };
}

/**
 * Calculate isometric transform for rendering
 */
export function getIsometricTransform(x: number, y: number): string {
  return `translate(${(x - y) * 32}px, ${(x + y) * 16}px)`;
}

/**
 * Check if coordinates are valid (-2 to 2)
 */
export function isValidCoordinate(x: number, y: number): boolean {
  return x >= -2 && x <= 2 && y >= -2 && y <= 2;
}

/**
 * Get all coordinates for 5x5 grid
 */
export function getAllGridCoordinates(): GridCoordinate[] {
  const coordinates: GridCoordinate[] = [];
  for (let y = -2; y <= 2; y++) {
    for (let x = -2; x <= 2; x++) {
      coordinates.push({ x, y });
    }
  }
  return coordinates;
}

/**
 * Check if plot is in center 9 (default unlocked area)
 */
export function isInCenterNine(x: number, y: number): boolean {
  return Math.abs(x) <= 1 && Math.abs(y) <= 1;
}

/**
 * Generate unique key for grid cell
 */
export function getCellKey(x: number, y: number): string {
  return `${x},${y}`;
}