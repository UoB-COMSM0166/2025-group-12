export function assertInterface({name, impl, methods = [], fields = []}) {
    for (const method of methods) {
        if (typeof impl[method] !== 'function') {
            console.error(`${name}: "${method}" is not implemented in "${impl.name || 'UnknownImpl'}"`);
        }
    }
    for (const field of fields) {
        if (!(field in impl)) {
            console.error(`${name}: missing field "${field}" in "${impl.constructor.name}"`);
        }
    }
}