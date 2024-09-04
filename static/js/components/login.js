const login = Vue.component("login", {
    template: `
      <div>
        <div class="back">
          <div class="div-center">
            <div class="content">
              <h4 v-if="smsg" style="color: red;">{{ message }}</h4>
              <h3>Login</h3>
              <hr />
              <form @submit.prevent="loginuser">
                <div class="form-group">
                  <label for="exampleInputEmail1">Email address</label>
                  <input type="email" class="form-control" id="exampleInputEmail1" placeholder="Email" v-model="email">
                </div>
                <div class="form-group">
                  <label for="exampleInputPassword1">Password</label>
                  <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" v-model="password">
                </div>
                <button type="submit" class="btn btn-primary">Login</button>
                <hr />
                <button type="button" class="btn btn-primary">
                  <router-link to="/signup" style="color:white; text-decoration:none">Signup</router-link>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    `,
    data() {
      return {
        smsg: false,
        message: "",
        email: "",
        password: ""
      };
    },
    methods: {
      loginuser() {
        const payload = {
          email: this.email,
          password: this.password,
        };
        fetch("http://127.0.0.1:5000/login?include_auth_token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error("Invalid Username/password");
            }
          })
          .then((data) => {
            localStorage.setItem(
              'auth_token',
              data.response.user.authentication_token
            );
            window.location.href = '/';
          })
          .catch((error) => {
            this.smsg = true;
            setTimeout(() => {
              this.smsg = false;
            }, 3000);
            this.message = "Invalid Username/password";
            console.error(error);
          });
      },
    },
  });
  
  export default login;
  