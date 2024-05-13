const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Gerekli paketleri kur
console.log('Installing required packages...');
exec('npm install react-router react-router-dom json-server react-helmet', (error, stdout, stderr) => {
    if (error) {
        console.error('Error installing packages:', error);
        return;
    }
    console.log('Packages installed successfully.');
    
    // Quick.js dosyasını çalıştır

    console.log('Creating directory structure...');
    const rootDirectory = 'src';

    // Object representing the file structure
    const pages=(str)=>{

        value=`
    import React, { useContext } from 'react'
    import { Helmet } from 'react-helmet'
    import MainContext from '../../../context/context'
    
    const ${str} = () => {
        const {data,setdata} = useContext(MainContext)
        return (
        <>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>${str}</title>
                    {/* <link rel="icon" type="image/x-icon" href="x"></link> favicon*/}
                    <link rel="canonical" href="http://mysite.com/example" />
                </Helmet>
                <div>${str} page
                </div>
        </>
        )
    }
    
    export default ${str}
        `
    
    
        return value
    
    }
    

    const files = {
        //* src/files
        components: {
            
        },
        context:{
            "context.jsx": `
import { createContext } from "react";
const MainContext = createContext()
export default MainContext
`
        },
        data: {
            "db.json": `
{
    "products": [
    {

    }
]
}
            `
        },
        layout:{
            admin: {
                    Footer: {
                        "footer.jsx": `
import React from 'react'

const Footer = () => {
    return (
        <div>Footer</div>
    )
}

export default Footer
                        `
                    },
                    Header: {
                        "header.jsx": `
import React from 'react'

const Header = () => {
    return (
        <div>Header</div>
    )
}

export default Header
                                `
                    }
                },
            site: {
                Footer: {
                    "footer.jsx": `
import React from 'react'

const Footer = () => {
return (
    <div>Footer</div>
)
}

export default Footer
                    `
                },
                Header: {
                    "header.jsx": `
import React from 'react'

const Header = () => {
return (
    <div>Header</div>
)
}

export default Header
                            `
                }}
        },
        pages: {
            admin: {
                add:{
                    "add.jsx": pages("Add")
                },
                dashboard:{
                    "dashboard.jsx": pages("Dashboard")
                }
                ,
                
                "AdminRoot.jsx": `
import React from 'react'
import { Outlet } from 'react-router'
import Header from '../../layout/admin/Header/header'
import Footer from '../../layout/admin/Footer/footer'

const AdminRoot = () => {
    return (
        <div>
            <Header/>
            <Outlet/>
            <Footer/>
        </div>
    )
}

export default AdminRoot
`
            },
            site: {
                home:{
                "home.jsx": pages("Home")},
                "SiteRoot.jsx": `
import React from 'react'
import Header from '../../layout/site/Header/header'
import { Outlet } from 'react-router'
import Footer from '../../layout/site/Footer/footer'

const SiteRoot = () => {
    return (
        <div>
            <Header/>
            <Outlet/>
            <Footer/>
        </div>
    )
}

export default SiteRoot
`
            },
            error: {
                error: {
                    "error.jsx": pages("Error")
                }
            },
            loading: {
                
            }
        },
        Routes: {
            "routes.jsx":`
import AdminRoot from "../pages/admin/AdminRoot"
import Dashboard from "../pages/admin/dashboard/dashboard"
import Add from "../pages/admin/add/add"
import Error from "../pages/error/error/error"
import SiteRoot from "../pages/site/SiteRoot"
import Home from "../pages/site/home/home"

const ROUTES =[
    {
        path:"/",
        element:<SiteRoot/>,
        children:[
            {
                path:"",
                element:<Home/>
            }
        ]
    },
    {
        path:"/admin",
        element: <AdminRoot/>,
        children:[
            {
                path:"",
                element:<Dashboard/>
            },
            {
                path:"add",
                element:<Add/>
            }
        ]
    }
    ,    {
        path:"*",
        element:<Error/>,
        
    },
]
export default ROUTES;`
        },
        "App.jsx": `
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ROUTES from "./Routes/routes";
import MainContext from "./context/context";
import { useState } from "react";
function App() {
    const[loading, setLoading] = useState(true);
    const[error, setError] = useState('false');
    const [data, setdata] = useState([]);
    const router = createBrowserRouter(ROUTES);
    return (
        <>
        <MainContext.Provider value={{data, setdata, loading, setLoading, error, setError}}>
            <RouterProvider router={router }/>
        </MainContext.Provider>
        </>
    );
}

export default App;
`
        ,
        "index.jsx":`
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);        `
    
};

    // Function to create files
    function createFiles(directory, files) {
        // Iterate over all keys (folders/files)
        Object.keys(files).forEach(key => {
            // Create file path
            const filePath = path.join(directory, key);

            // If the key is an object, create a directory and process its content
            if (typeof files[key] === 'object') {
                fs.mkdirSync(filePath, { recursive: true });
                createFiles(filePath, files[key]);
            } else { // If the key is a file, create the file and write its content
                fs.writeFileSync(filePath, files[key]);
            }
        });
    }

    // Create files
    createFiles(rootDirectory, files);

    console.log("Files successfully created.");

    console.log('quick.js executed successfully.');
    
    // quickdircraft paketini kaldır
    console.log('Uninstalling quickdircraft...');
    exec('npm uninstall -g quickdircraft', (error, stdout, stderr) => {
        if (error) {
            console.error('Error uninstalling quickdircraft:', error);
            return;
        }
        console.log('quickdircraft deleted successfully.');
    });

});
