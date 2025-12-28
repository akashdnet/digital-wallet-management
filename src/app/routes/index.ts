import { Router } from "express"
import { AdminRoutes } from "../modules/admin/admin.route"
import { AuthRoutes } from "../modules/auth/auth.route"
import { ChargeRoutes } from "../modules/charge/charge.route"
import { ContactUsRoutes } from "../modules/contactus/contactus.route"
import { TestRoutes } from "../modules/test/test.route"
import { TransactionRoutes } from "../modules/transaction/transaction.route"
import { UserRoutes } from "../modules/user/user.route"
import { WalletRoutes } from "../modules/wallet/wallet.route"


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
    {
        path: "/contact-us",
        route: ContactUsRoutes
    },
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})