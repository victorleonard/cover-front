import Api from "./Api.js";

export default {
  getUsers() {
    return Api().get("/users");
  },
  getUser(userId) {
    return Api().get("/user/" + userId);
  },
  getProfile(userId) {
    return Api().get('/profiles?filter{"where":{"userId":' + userId + "}}");
  },
  createProfile(userId, username) {
    return Api().post("/profiles", {
      userId: userId,
      username: username
    });
  },
  register(username, email, password) {
    return Api().post("/auth/local/register", {
      username: username,
      email: email,
      password: password
    });
  },
  logIn(email, password) {
    return Api().post("/auth/local", {
      identifier: email,
      password: password
    });
  }
};
