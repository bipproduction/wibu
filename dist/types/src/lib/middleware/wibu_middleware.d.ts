import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
/**
 * # GUIDE
 * @see https://github.com/bipproduction/wibu/tree/main/GUIDE/wibu-midleware.md
 */
export declare function wibuMiddleware(req: NextRequest, { apiPath, loginPath, userPath, encodedKey, publicRoutes, sessionKey, validationApiRoute, log }: {
    apiPath?: string;
    loginPath?: string;
    userPath?: string;
    encodedKey: string;
    publicRoutes?: string[];
    sessionKey: string;
    validationApiRoute?: string;
    log?: boolean;
}): Promise<NextResponse<unknown>>;
