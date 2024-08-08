const User = require("./../models/User");

/*
 {
        "name": "Yash Gupta",
        "picture": "https://lh3.googleusercontent.com/a/ACg8ocL8en6Hh33W7IRqWjzKd8uqa6-gf2TzBXxKg6QJT12WPb-AXw=s96-c",
        "iss": "https://securetoken.google.com/epic-test-4c318",
        "aud": "epic-test-4c318",
        "auth_time": 1722933135,
        "user_id": "svFU3kQL1JU2C4uyVHafriapd133",
        "sub": "svFU3kQL1JU2C4uyVHafriapd133",
        "iat": 1722933135,
        "exp": 1722936735,
        "email": "work200010@gmail.com",
        "email_verified": true,
        "firebase": {
            "identities": {
                "google.com": [
                    "102526335006057231276"
                ],
                "email": [
                    "work200010@gmail.com"
                ]
            },
            "sign_in_provider": "google.com"
        },
        "uid": "svFU3kQL1JU2C4uyVHafriapd133"
    }
*/

module.exports.signUp = async (req, res) => {
  try {
    const user = req.user;
    let { role, designation, approved, dob, city, pin_code, email, name } =
      req.body;

    const userId = user.uid;
    if (!name) {
      name = user.name || "";
    }

    const userToSave = new User({
      name,
      userId,
      email,
      role,
      designation,
      approved,
      dob,
      city,
      pin_code,
    });
    const data = await userToSave.save();

    res.send({ ok: true, msg: "User Added Successfully!", data });
  } catch (err) {
    console.log(err);
    res.send({ ok: false, msg: err?.message || "Something Went Wrong!" });
  }
};
