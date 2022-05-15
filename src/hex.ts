export function toHex(input: string, uri?:boolean) {
    // utf-8 to hex (with optional uri encoding)
    // Inspired by https://gist.github.com/valentinkostadinov/5875467
    let s = uri ? encodeURIComponent(input) : input
    let h = ''
    for (let i = 0; i < s.length; i++) {
        h += s.charCodeAt(i).toString(16)
    }
    return h
}

export function fromHex(h: string) {
    // hex to utf-8
    // Inspired by https://gist.github.com/valentinkostadinov/5875467
    let s = '';
    for (let i = 0; i < h.length; i+=2) {
        s += String.fromCharCode(parseInt(h.substring(i, i+2), 16));
    }
    let uri = s.indexOf('%') !== -1;
    return uri ? decodeURIComponent(s) : s;
}

export function NodeToHex(input: string, uri?:boolean) {
    // utf-8 to hex with Node.js Buffer.from()
    let s = uri ? Buffer.from(encodeURIComponent(input), 'ascii') : Buffer.from(input, 'ascii')
    let h = ''
    for (const c of s) {
        h += c.toString(16)
    }
    return  h;
}

export function NodeFromHex(h: string) {
    // hex to utf-8 with Node.js Buffer.from()
    let s = Buffer.from(h.replace(/\s/g, ''), 'hex').toString('utf-8')
    let uri = s.indexOf('%') !== -1;
    return uri ? decodeURIComponent(s) : s;
}

export function Base64ToUtf(input: string) {
    // Base64 encoding to utf-8 with Node.js Buffer.from()
    let s = Buffer.from(input, 'base64').toString('utf-8')
    return s;
}

export function example() {
    // Inspired by https://stackoverflow.com/questions/60504945/javascript-encode-decode-utf8-to-hex-and-hex-to-utf8
    const hex = "48656c6c6f20576f726c6421";

    const utf8 = NodeFromHex(hex);
    const hex2 = NodeToHex(utf8);

    console.log("Hex: " + hex);
    console.log("UTF8: " + utf8);
    console.log("Hex2: " + hex2);
    console.log("Is conversion OK: " + (hex == hex2));
}