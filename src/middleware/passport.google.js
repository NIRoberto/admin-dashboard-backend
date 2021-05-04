// import passport from 'passport';
// import GoogleStrategy from 'passport-google-oauth';

// // Use the GoogleStrategy within Passport.
// //   Strategies in Passport require a `verify` function, which accept
// //   credentials (in this case, an accessToken, refreshToken, and Google
// //   profile), and invoke a callback with a user object.
// class configureGoogleStrategy {
//   static googleAuth() {
//     passport.use(
//       new GoogleStrategy(
//         {
//           clientID: process.env.CLIENT_ID,
//           clientSecret: process.env.CLIENT_SECRET,
//           callbackURL: process.env.CALLBACK_URL,
//         },
//         function (accessToken, refreshToken, profile, done) {
//           // User.findOrCreate({ googleId: profile.id }, function (err, user) {
//           //   return done(err, user);
//           // });

//           console.log('accessToken', accessToken);
//           console.log('refreshToken', refreshToken);
//           console.log('profile', profile);
//           done(null, profile);
//         }
//       )
//     );
//   }
// }
// export default configureGoogleStrategy;
