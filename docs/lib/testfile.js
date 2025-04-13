// logic.js
class Logic {
    static sayHi() {
        return 'hi';
    }
}


export { Logic };

if (typeof module !== 'undefined') {
    module.exports = { Logic };
}
