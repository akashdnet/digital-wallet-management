import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../modules/user/user.model";
import bcryptjs from "bcryptjs";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { envList } from "./envList";
import { TUserRole } from "../modules/user/user.interface";





passport.use(
    new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    }, async (email: string, password: string, done:any) => {
        try {
            const isUserExist = await User.findOne({ email })
            if (!isUserExist) {
                return done("User does not exist")
            }

            const isGoogleAuthenticated = isUserExist.authProviders?.some(providerObjects => providerObjects.provider == "google")
            if (isGoogleAuthenticated && !isUserExist.password) {
                return done(null, false, { message: "Your are already signup with google." })
            }

            const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string)
            if (!isPasswordMatched) {
                return done(null, false, { message: "Incorrect Password" })
            }


            return done(null, isUserExist)

        } catch (error) {
            console.log(error);
            done(error)
        }
    })
)

passport.use(
    new GoogleStrategy(
        {
            clientID: envList.GOOGLE_CLIENT_ID,
            clientSecret: envList.GOOGLE_CLIENT_SECRET,
            callbackURL: envList.GOOGLE_CALLBACK_URL
        }, async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {

            try {

                const email = profile.emails?.[0].value;
                if (!email) {
                    return done(null, false, { message: "No email found" })
                }


                let user = await User.findOne({ email })
                if (!user) {
                    user = await User.create({
                        email,
                        name: profile.displayName,
                        picture: profile.photos?.[0].value,
                        role: TUserRole.USER,
                        auths: [
                            {
                                provider: "google",
                                providerId: profile.id
                            }
                        ]
                    })
                }

                return done(null, user)


            } catch (error) {
                console.log("Google Strategy Error", error);
                return done(error)
            }
        }
    )
)






passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
    done(null, user._id)
})

passport.deserializeUser(async (id: string, done: any) => {
    try {
        const user = await User.findById(id);
        done(null, user)
    } catch (error) {
        console.log(error);
        done(error)
    }
})