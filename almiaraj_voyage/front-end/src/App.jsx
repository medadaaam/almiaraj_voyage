import { RouterProvider } from "react-router-dom";
import { route } from "./router";

export default function App() {
    return(
        <RouterProvider router={route} />
    )   
}