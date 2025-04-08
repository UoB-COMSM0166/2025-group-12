export function assertInterface({name, impl, methods}) {
    for (const method of methods) {
        if (typeof impl[method] !== 'function') {
            console.error(`${name}: "${method}" is not implemented in "${impl.name || 'UnknownImpl'}"`);
        }
    }
}