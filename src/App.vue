<template>
  <!-- <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </div> -->
  <router-view/>
</template>

<style>
      

        /* tells the browser how the bar will look */
          
        ::-webkit-scrollbar {
            width: 7.5px;
            height: 7.5px;
        }
        /*tells the browser how the arrows will appear*/
          
        ::-webkit-scrollbar-button:single-button {
            background-color: red;
            height: 16px;
            width: 16px;
            display: none;
        }
        /* tells the browser how the scrollable 
          handle would look like */
          
        ::-webkit-scrollbar-thumb {
            background: rgba(100,100,100,0.8);
            border-radius: 15px;
            
        }
        /* tells the browser how will the 
         path of the handle will look like */
          
        ::-webkit-scrollbar-track {
            background: rgba(0.0,0.0,0.0,0.5);
        }
        /* works the same as ::-webkit-scrollbar-track 
              but tells the browser how the path where 
              the handle is not present currently*/
        /* ::-webkit-scrollbar-track-piece{
            background: green;
        } */
        /* tells the browser how will the point 
           where vertical and  horizontal meet will look like*/
        /* ::-webkit-scrollbar-corner{
            background: orange ;
            display: solid;
        } */
        /* resizer*/
          
        ::-webkit-resizer {
            background: rgba(255,255,255,0.35);
        }

#app {
  font-family: 'Fira Code', Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
  margin:0;
  padding: 0;
  overflow: hidden;
}

/* CODEMIRROR STYLING  */

    .CodeMirror, .CodeMirror-gutters{
        padding: 0;
        margin: 0;
        background: rgba(0.0, 0.0, 0.0, 0.0) !important;
        border: solid 0.5px;
        border-color: rgba(255,255,255,0.35);

    }
    .CodeMirror{
        resize: both;
        /* overflow: auto !important; */
        min-height: 50vh;
        min-width: 35vh;
    }

    span{
      background-color: rgba(0.0,0.0,0.0,0.35);
    }
input{
        font-family: 'Fira Code';
}

body{
    margin:0;
  padding: 0;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
