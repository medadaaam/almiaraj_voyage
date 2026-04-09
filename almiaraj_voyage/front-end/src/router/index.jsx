import { createBrowserRouter } from 'react-router-dom'
import Layout from '../layouts/layout'
import Home from '../pages/home'
import Contact from '../pages/contact'
import About from '../pages/about'
import NotFound from '../pages/notFound'
export const route = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                path: '/',
                element: <Home />
            }, {
                path: '/login',
                element: <h1>Hi  login</h1>
            }, {
                path: '/register',
                element: <h1>hi register</h1>
            }, {
                path: '/services',
                element: <h1>Hi services </h1>
            }, {
                path: '/about',
                element: <About/>
            }, {
                path: '/contact',
                element: <Contact/>
            },{
            
                path: '*',
                element: <NotFound />
            },
        ]
    }

]

)