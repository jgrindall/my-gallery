export type Direction = "forward" | "backward" | "left" | "right"

export type Motion = {[key in Direction]: boolean} 

export const motion:Motion = {
    forward: false,
    backward: false,
    left: false,
    right: false
}

export const allowedKeys = [
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight"
] as const

export type AllowedKeyCode = typeof allowedKeys[number]

export const keyToDirection: {[key in AllowedKeyCode]: Direction} =  {
    ArrowUp: 'forward',
    ArrowDown: 'backward',
    ArrowLeft: 'left',
    ArrowRight: 'right'
}