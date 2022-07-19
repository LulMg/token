const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      permiso: false,
      user: "",
      message: null,
      usuarios: [],
      urlApi: process.env.BACKEND_URL,

      demo: [
        {
          title: "FIRST",
          background: "white",
          initial: "white",
        },
      ],
    },
    actions: {
      //funcion que me ayuda a conseguir los datos privados

      privada: () => {
        var myHeaders = new Headers();
        myHeaders.append(
          "Authorization",
          `Bearer ${sessionStorage.getItem("token")}`
        );

        var requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        };

        fetch(getStore().urlApi + "/privada", requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
            setStore({ permiso: result.permiso });
            setStore({ user: result.email });
          })
          .catch((error) => console.log("error", error));
      },

      // Use getActions to call a function within a fuction
      exampleFunction: () => {
        getActions().changeColor(0, "green");
      },

      //iniciar sesion

      //      login: (email, password) => {
      //        var myHeaders = new Headers();
      //        myHeaders.append("Content-Type", "application/json");
      //
      //        var raw = JSON.stringify({
      //          email: email,
      //          password: password,
      //        });
      //
      //        var requestOptions = {
      //          method: "POST",
      //          headers: myHeaders,
      //          body: raw,
      //          redirect: "follow",
      //        };
      //
      //        fetch(getStore().urlApi + "/login", requestOptions)
      //          .then((response) => response.json())
      //          .then((result) => {
      //            console.log(result);
      //            alert(result.mensaje);
      //            sessionStorage.setItem("token", result.token);
      //          })
      //          .catch((error) => {
      //            console.log("error", error);
      //          });
      //      },
      login: async (email, password) => {
        const response = await fetch(getStore().urlApi + "/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        });
        if (response.status == 200) {
          const data = await response.json();
          console.log(data);
          setStore({ permiso: true });
          sessionStorage.setItem("token", data.token);
          return true;
        }
      },

      //cerrar sesion

      logOut: () => {
        sessionStorage.removeItem("token");
      },

      //registrarse

      signup: (uName, email, password) => {
        console.log("estamos en actions", uName, email, password);

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
          name: uName,
          email: email,
          password: password,
        });

        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        fetch(getStore().urlApi + "/signup", requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
            alert(result.mensaje);
          })
          .catch((error) => console.log("error", error));
      },

      getMessage: () => {
        // fetching data from the backend
        fetch(process.env.BACKEND_URL + "/api/hello")
          .then((resp) => resp.json())
          .then((data) => setStore({ message: data.message }))
          .catch((error) =>
            console.log("Error loading message from backend", error)
          );
      },
      changeColor: (index, color) => {
        //get the store
        const store = getStore();

        //we have to loop the entire demo array to look for the respective index
        //and change its color
        const demo = store.demo.map((elm, i) => {
          if (i === index) elm.background = color;
          return elm;
        });

        //reset the global store
        setStore({ demo: demo });
      },
    },
  };
};

export default getState;
