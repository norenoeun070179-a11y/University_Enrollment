// const passport = require("passport");
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import Customer from "../models/customer.model";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL:
        "http://localhost:3001/auth/google/callback"
    },
    
    async (
      accessToken,
      refreshToken,
      profile,
      done
    ) => {
      try {

        let customer = await Customer.findOne({
          where: {
            google_id: profile.id
          }
        });

        if (!customer) {

          customer = await Customer.create({
            google_id: profile.id,
            email: profile.emails?.[0].value!,
            first_name:
              profile.name?.givenName || "",
            last_name:
              profile.name?.familyName || "",
            profile_picture:
              profile.photos?.[0].value,
          });

        }

        return done(null, customer);

      } catch (error) {
        return done(error, false);
      }
    }
  )
);

export default passport;