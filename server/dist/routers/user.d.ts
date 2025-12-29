export declare const userRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: {
        req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
        res: import("express").Response<any, Record<string, any>>;
        db: import("pg").Pool;
        user: any;
    };
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    me: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: any;
        meta: object;
    }>;
    getUserById: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            userId: string;
        };
        output: any;
        meta: object;
    }>;
    updateProfile: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            email: string;
            firstName: string;
            lastName: string;
            avatarBase64?: string | undefined;
        };
        output: any;
        meta: object;
    }>;
}>>;
//# sourceMappingURL=user.d.ts.map