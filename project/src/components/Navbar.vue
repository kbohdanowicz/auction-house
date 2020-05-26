<template>
  <div class="navbar">
    <header>
      <nav>
        <ul>
          <li><router-link to="/">Home</router-link></li>
          <!-- v-if isAuthorised-->
          <li><router-link to="/login">Log in</router-link></li>
        </ul>
      </nav>
    </header>
  </div>
</template>

<script>

export default {
    name: "Navbar",
    components: {
    }
};
</script>

<style scoped lang="scss">
* {
    //box-sizing: border-box;
    margin: 0;
    padding: 0;
    background-color: royalblue;
}

ul {
    //list-style: none;

    li {
        font-family: 'Montserrat', sans-serif;
        //font-weight: 500;
        //font-size: 16px;
        //text-decoration: none;
        display: inline-block;
        //padding: 0px 25px;
        a {
            padding: 20px 25px;
            text-decoration: none;
            color: white;
        }
        a:hover {
            color: lightgray;
        }
    }
}

header {
    //display: flex;
    //justify-content: space-between;
    //align-items: center;
    padding: 20px 10%;
}
</style>
