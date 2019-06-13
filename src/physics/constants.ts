
export class Constants {
    public static readonly mu = 0.004
    public static readonly g = 9.8
    public static readonly rho = 0.4
    public static readonly m = 1
    public static readonly Mz = ((Constants.mu * Constants.m * Constants.g * 2) / 3) * Constants.rho
    public static readonly Mxy = (7 / (5 * Math.sqrt(2))) * Constants.mu * Constants.m * Constants.g
    public static readonly e = 0.8
}

