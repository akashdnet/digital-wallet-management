import { Router } from "express"
import { UserRoutes } from "../modules/user/user.route"
import { AuthRoutes } from "../modules/auth/auth.route"
import { WalletRoutes } from "../modules/wallet/wallet.route"
import { ChargeRoutes } from "../modules/charge/charge.route"
import { TransactionRoutes } from "../modules/transaction/transaction.route"
import { TestRoutes } from "../modules/test/test.route"
import { AdminRoutes } from "../modules/admin/admin.route"

export const router = Router()

const moduleRoutes = [
    {
        path: "/user",
        route: UserRoutes
    },
    {
        path: "/admin",
        route: AdminRoutes
    },
    {
        path: "/auth",
        route: AuthRoutes
    },
    {
        path: "/wallet",
        route: WalletRoutes
    },
    {
        path: "/service-charge",
        route: ChargeRoutes
    },
    {
        path: "/transaction",
        route: TransactionRoutes
    },
    {
        path: "/test",
        route: TestRoutes
    },
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})