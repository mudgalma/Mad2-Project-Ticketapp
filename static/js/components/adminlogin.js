const adminlogin = Vue.component("adminlogin", {
        template: `<div >
<div class="back">
<div class="div-center">
<div class="content">
<h3>Login</h3>
  <hr />
  <form>
    <div class="form-group">
      <label for="exampleInputEmail1">Email address</label>
      <input type="email" class="form-control" id="exampleInputEmail1" placeholder="Email" v-model='credential1.email'>
    </div>
    <div class="form-group">
      <label for="exampleInputPassword1">Password</label>
      <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" v-model ='credential1.password'>
    </div>
    <button type="submit" class="btn btn-primary" @click="adminlogin">adminlogin</button>
    <hr />

    </form>
    </div>
</div>
</div>

</div>`,



        data() {
            //data should lways be afunction which should return a object
            return {
                credential1: {
                    email: null,
                    password: null,

                }
            }

        },
        methods: {

            adminlogin() {
                fetch('/login?include_auth_token', {
                    method: 'POST',
                    body: JSON.stringify(this.credential1),
                    headers: {
                        'Content-Type': 'application/json',

                    },
                }).then((res) => {
                    return res.json()

                }).then((data) => {
                    console.log(data.response.user.authentication_token)
                    localStorage.setItem('auth_token', data.response.user.authentication_token)
                    window.location.href = '/';

                })


            },


        },
    })
    // we are using vue model to bind the email and password with the input
export default adminlogin