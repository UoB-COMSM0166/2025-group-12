
export class myutil{
    static mod2PiPositive(x) {
        return (((x % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI)) / Math.PI;
    }
}