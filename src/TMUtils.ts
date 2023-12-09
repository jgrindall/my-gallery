var EPSILON = 1e-3;

export enum TextureInUse {
    Viewing, Drawing, Packed
}

export function isPointInCircle(point: THREE.Vector2, center: THREE.Vector2, radius: number): boolean {
    return Math.abs(radius) >= EPSILON &&
        center.distanceToSquared(point) <= radius * radius;
}

export function isPointInTriangle(point: THREE.Vector2, t0: THREE.Vector2, t1: THREE.Vector2, t2: THREE.Vector2): boolean {
    //compute vectors & dot products
    var cx = point.x, cy = point.y,
        v0x = t2.x - t0.x, v0y = t2.y - t0.y,
        v1x = t1.x - t0.x, v1y = t1.y - t0.y,
        v2x = cx - t0.x, v2y = cy - t0.y,
        dot00 = v0x * v0x + v0y * v0y,
        dot01 = v0x * v1x + v0y * v1y,
        dot02 = v0x * v2x + v0y * v2y,
        dot11 = v1x * v1x + v1y * v1y,
        dot12 = v1x * v2x + v1y * v2y;

    // Compute barycentric coordinates
    var b = (dot00 * dot11 - dot01 * dot01),
        inv = Math.abs(b) < EPSILON ? 0 : (1 / b),
        u = (dot11 * dot02 - dot01 * dot12) * inv,
        v = (dot00 * dot12 - dot01 * dot02) * inv;
    return u >= 0 && v >= 0 && (u + v <= 1);
}

export function lineOverlapsCircle(a: THREE.Vector2, b: THREE.Vector2, center: THREE.Vector2, radius: number): boolean {
    //check to see if start or end points lie within circle
    if (isPointInCircle(a, center, radius) || isPointInCircle(b, center, radius)) {
        return true;
    }

    var x1 = a.x, y1 = a.y,
        x2 = b.x, y2 = b.y,
        cx = center.x, cy = center.y;

    var c1x = cx - x1;
    var c1y = cy - y1;
    var e1x = x2 - x1;
    var e1y = y2 - y1;
    var k = c1x * e1x + c1y * e1y;

    if (k <= 0) {
        return false;
    }

    var len = Math.sqrt(e1x * e1x + e1y * e1y);
    k /= len;
    return k < len && c1x * c1x + c1y * c1y - k * k <= radius * radius;
}

export function triangleCircleOverlaps(t1: THREE.Vector2, t2: THREE.Vector2, t3: THREE.Vector2, center: THREE.Vector2, radius: number): boolean {
    return isPointInTriangle(center, t1, t2, t3) ||
        lineOverlapsCircle(t1, t2, center, radius) ||
        lineOverlapsCircle(t2, t3, center, radius) ||
        lineOverlapsCircle(t3, t1, center, radius);
}

export function lineSegmentsIntersect(v1: THREE.Vector2, v2: THREE.Vector2, v3: THREE.Vector2, v4: THREE.Vector2): boolean {
    var a = v1.x, b = v1.y, c = v2.x, d = v2.y,
        p = v3.x, q = v3.y, r = v4.x, s = v4.y;
    var det, gamma, lambda;
    det = (c - a) * (s - q) - (r - p) * (d - b);
    if (Math.abs(det) < EPSILON) {
        return false;
    } else {
        lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
        gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
        return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
    }
}

export function triangleRectangleOverlaps(t1: THREE.Vector2, t2: THREE.Vector2, t3: THREE.Vector2,
                                    r1: THREE.Vector2, r2: THREE.Vector2, r3: THREE.Vector2, r4: THREE.Vector2): boolean {
    return isPointInTriangle(r1, t1, t2, t3) ||
        isPointInTriangle(r2, t1, t2, t3) ||
        isPointInTriangle(r3, t1, t2, t3) ||
        isPointInTriangle(r4, t1, t2, t3) ||
        isPointInTriangle(t1, r1, r2, r3) || isPointInTriangle(t1, r2, r3, r4) ||
        isPointInTriangle(t2, r1, r2, r3) || isPointInTriangle(t2, r2, r3, r4) ||
        isPointInTriangle(t3, r1, r2, r3) || isPointInTriangle(t3, r2, r3, r4) ||
        lineSegmentsIntersect(r1, r2, t1, t2) || lineSegmentsIntersect(r1, r2, t2, t3) || lineSegmentsIntersect(r1, r2, t3, t1) ||
        lineSegmentsIntersect(r1, r3, t1, t2) || lineSegmentsIntersect(r1, r3, t2, t3) || lineSegmentsIntersect(r1, r3, t3, t1) ||
        lineSegmentsIntersect(r2, r4, t1, t2) || lineSegmentsIntersect(r2, r4, t2, t3) || lineSegmentsIntersect(r2, r4, t3, t1) ||
        lineSegmentsIntersect(r3, r4, t1, t2) || lineSegmentsIntersect(r3, r4, t2, t3) || lineSegmentsIntersect(r3, r4, t3, t1);
}

